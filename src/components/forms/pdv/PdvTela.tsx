import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import { LogOut, Search, Trash2, Plus, Receipt, RefreshCw, Settings } from "lucide-react";
import ProdutoSearchDialog, { buscarProdutoPorCodigo, IProdutoRow } from "../pedido/ProdutoSearchDialog";
import ClienteSearchDialog, { IClienteRow } from "../pedido/ClienteSearchDialog";
import PagamentoDialog from "./PagamentoDialog";
import ConfigurarDialog from "./ConfigurarDialog";
import OpcoesPagamentoDialog, { IImpressaoDados } from "./OpcoesPagamentoDialog";
import type {
  IPdvCaixa, IPdvCaixaAbertura, IPdvParamsEmpresa, IPdvPedidoFechado,
  IPdvPagamentoLinha, IMovimentoPagamento,
} from "./types";

const db = supabase as any;
const fmt = (v: number) => (v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface IProps {
  caixa: IPdvCaixa;
  abertura: IPdvCaixaAbertura;
  dtMovimento: string;
  onSair: () => void;
}

interface ICartItem {
  produto_id: number;
  cd_produto: string;
  nm_produto: string;
  unidade_id: string | null;
  vl_unitario: number;
  qt_item: number;
  deposito_id: number | null;
}

const PdvTela: React.FC<IProps> = ({ caixa, abertura, dtMovimento, onSair }) => {
  const { XEmpresaId, XEmpresaMatrizId, XEmpresas } = useAppContext();
  const [XParams, setXParams] = useState<IPdvParamsEmpresa | null>(null);

  // Configurações por funcionário
  const [XFontePed, setXFontePed] = useState<number>(caixa.tamanho_fonte_pedidos || 12);
  const [XFonteProd, setXFonteProd] = useState<number>(caixa.tamanho_fonte_produtos || 12);
  const [XRefreshSeg, setXRefreshSeg] = useState<number>(caixa.tempo_refresh_pdv || 30);
  const [XOpenConfig, setXOpenConfig] = useState(false);

  // Pedidos fechados disponíveis
  const [XPedidos, setXPedidos] = useState<IPdvPedidoFechado[]>([]);
  const [XPedidoSel, setXPedidoSel] = useState<IPdvPedidoFechado | null>(null);
  const [XPedidoSelItens, setXPedidoSelItens] = useState<any[]>([]);
  const [XBuscaPedido, setXBuscaPedido] = useState("");

  // Venda direta - carrinho
  const [XCart, setXCart] = useState<ICartItem[]>([]);
  const [XCliente, setXCliente] = useState<IClienteRow | null>(null);
  const [XSearchTerm, setXSearchTerm] = useState("");
  const [XOpenProduto, setXOpenProduto] = useState(false);
  const [XOpenCliente, setXOpenCliente] = useState(false);

  // Fluxo de finalização
  const [XOpenOpcoes, setXOpenOpcoes] = useState(false);
  const [XOpenPagto, setXOpenPagto] = useState(false);
  const [XPagtosPedido, setXPagtosPedido] = useState<IMovimentoPagamento[]>([]);
  const [XImpressaoDados, setXImpressaoDados] = useState<IImpressaoDados | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  // Carrega parametros da empresa
  useEffect(() => {
    (async () => {
      const { data, error } = await db.from("empresa")
        .select("tp_operacao_caixa, conta_gerencial_caixa, centro_custo_caixa, deposito_estoque_caixa, imagem_caixa")
        .eq("empresa_id", XEmpresaId).maybeSingle();
      if (error) { toast.error(error.message); return; }
      setXParams(data as IPdvParamsEmpresa);
    })();
  }, [XEmpresaId]);

  // Carrega pedidos fechados (com nome do vendedor)
  const carregarPedidos = useCallback(async () => {
    const { data, error } = await db.from("movimento")
      .select("movimento_id, nr_movimento, cadastro_id, vl_movimento, dt_emissao, funcionario_id")
      .eq("empresa_id", XEmpresaId)
      .eq("st_pedido", "F")
      .eq("excluido", false)
      .order("movimento_id", { ascending: false })
      .limit(200);
    if (error) { toast.error(error.message); return; }

    const cadIds = Array.from(new Set((data || []).map((m: any) => m.cadastro_id).filter(Boolean)));
    const funcIds = Array.from(new Set((data || []).map((m: any) => m.funcionario_id).filter(Boolean)));
    const [cadRes, funcRes] = await Promise.all([
      cadIds.length
        ? db.from("cadastro").select("cadastro_id, razao_social, nome_fantasia").in("cadastro_id", cadIds)
        : Promise.resolve({ data: [] }),
      funcIds.length
        ? db.from("funcionario").select("funcionario_id, nome").in("funcionario_id", funcIds)
        : Promise.resolve({ data: [] }),
    ]);
    const cadMap: Record<number, string> = {};
    for (const c of (cadRes.data || []) as any[]) cadMap[c.cadastro_id] = c.nome_fantasia || c.razao_social;
    const funcMap: Record<number, string> = {};
    for (const f of (funcRes.data || []) as any[]) funcMap[f.funcionario_id] = f.nome || "";

    setXPedidos(((data || []) as any[]).map(m => ({
      movimento_id: m.movimento_id,
      nr_movimento: m.nr_movimento,
      cadastro_id: m.cadastro_id,
      cliente_nome: cadMap[m.cadastro_id] || "(Consumidor)",
      vendedor_id: m.funcionario_id,
      vendedor_nome: funcMap[m.funcionario_id] || "",
      vl_movimento: Number(m.vl_movimento || 0),
      dt_emissao: m.dt_emissao,
    })));
  }, [XEmpresaId]);

  useEffect(() => { carregarPedidos(); }, [carregarPedidos]);

  // Refresh automático
  useEffect(() => {
    const seg = Math.max(5, Math.min(99999, XRefreshSeg || 30));
    const id = setInterval(() => { carregarPedidos(); }, seg * 1000);
    return () => clearInterval(id);
  }, [XRefreshSeg, carregarPedidos]);

  // Carrega itens do pedido selecionado
  useEffect(() => {
    if (!XPedidoSel) { setXPedidoSelItens([]); return; }
    (async () => {
      const { data } = await db.from("movimento_item")
        .select("movimento_item_id, produto_id, nm_produto, qt_movimento, vl_und_produto, vl_movimento, unidade_id")
        .eq("movimento_id", XPedidoSel.movimento_id)
        .eq("excluido", false)
        .order("movimento_item_id");
      setXPedidoSelItens(data || []);
    })();
  }, [XPedidoSel]);

  // Lista filtrada
  const XPedidosFilt = useMemo(() => {
    const t = XBuscaPedido.trim().toLowerCase();
    if (!t) return XPedidos;
    return XPedidos.filter(p =>
      String(p.nr_movimento || p.movimento_id).toLowerCase().includes(t) ||
      (p.cliente_nome || "").toLowerCase().includes(t) ||
      (p.vendedor_nome || "").toLowerCase().includes(t)
    );
  }, [XPedidos, XBuscaPedido]);

  // ===== Venda direta =====
  const adicionarProdutoAoCarrinho = (p: IProdutoRow, depositoId?: number) => {
    setXCart(prev => {
      const idx = prev.findIndex(c => c.produto_id === p.produto_id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = { ...cp[idx], qt_item: cp[idx].qt_item + 1 };
        return cp;
      }
      const preco = p.st_promo && p.preco_promocional > 0 ? p.preco_promocional : p.preco_venda;
      return [...prev, {
        produto_id: p.produto_id,
        cd_produto: String(p.produto_id),
        nm_produto: p.nome,
        unidade_id: p.unidade_id,
        vl_unitario: preco,
        qt_item: 1,
        deposito_id: depositoId || XParams?.deposito_estoque_caixa || null,
      }];
    });
    setXSearchTerm("");
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const buscarTermo = async () => {
    const t = XSearchTerm.trim();
    if (!t) { setXOpenProduto(true); return; }
    const XGroupIds = XEmpresas
      .filter(e => e.empresa_matriz_id === XEmpresaMatrizId || e.empresa_id === XEmpresaMatrizId)
      .map(e => e.empresa_id);
    const p = await buscarProdutoPorCodigo(t, XEmpresaId, XGroupIds);
    if (p) adicionarProdutoAoCarrinho(p);
    else { toast.error("Produto não encontrado. Use a pesquisa avançada."); setXOpenProduto(true); }
  };

  const alterarQt = (idx: number, delta: number) => {
    setXCart(prev => prev.map((c, i) => i === idx ? { ...c, qt_item: Math.max(0.001, c.qt_item + delta) } : c));
  };

  const removerItem = (idx: number) => setXCart(prev => prev.filter((_, i) => i !== idx));

  const totalCart = XCart.reduce((a, c) => a + c.qt_item * c.vl_unitario, 0);

  // ===== Finalizar venda → tela de Opções (Bobina/A4/NFe/NFCe) =====
  const totalReceber = XPedidoSel ? XPedidoSel.vl_movimento : totalCart;
  const podeReceber = (XPedidoSel != null) || (XCart.length > 0);

  const finalizarVenda = async () => {
    if (!podeReceber) { toast.error("Selecione um pedido ou adicione itens à venda direta."); return; }
    if (!XParams) { toast.error("Parâmetros da empresa não carregados."); return; }

    // Pre-busca pagamentos do pedido (somente quando há pedido selecionado)
    let pagtos: IMovimentoPagamento[] = [];
    if (XPedidoSel) {
      const { data } = await db.from("movimento_pagamento")
        .select("movimento_pagamento_id, condicao_id, vl_pagamento, numero_autorizacao, bandeira_id, operadora_id, n_parcelas")
        .eq("movimento_id", XPedidoSel.movimento_id)
        .eq("excluido", false);
      pagtos = (data || []) as IMovimentoPagamento[];
    }
    setXPagtosPedido(pagtos);

    // Monta dados de impressão
    const itensImp = XPedidoSel
      ? XPedidoSelItens.map((it: any) => ({
          nm_produto: it.nm_produto,
          qt_movimento: Number(it.qt_movimento || 0),
          unidade_id: it.unidade_id,
          vl_und_produto: Number(it.vl_und_produto || 0),
          vl_movimento: Number(it.vl_movimento || it.qt_movimento * it.vl_und_produto || 0),
        }))
      : XCart.map(c => ({
          nm_produto: c.nm_produto,
          qt_movimento: c.qt_item,
          unidade_id: c.unidade_id,
          vl_und_produto: c.vl_unitario,
          vl_movimento: c.qt_item * c.vl_unitario,
        }));
    setXImpressaoDados({
      nr_movimento: XPedidoSel ? (XPedidoSel.nr_movimento || XPedidoSel.movimento_id) : "(direta)",
      cliente_nome: XPedidoSel ? XPedidoSel.cliente_nome : (XCliente?.nome_fantasia || XCliente?.razao_social || "(Consumidor)"),
      caixa_nome: caixa.nome,
      dt_movimento: new Date(dtMovimento + "T00:00:00").toLocaleDateString("pt-BR"),
      itens: itensImp,
      total: totalReceber,
    });

    setXOpenOpcoes(true);
  };

  /** Cria movimento (st_pedido='F') quando for venda direta. Retorna movimento_id. */
  const criarMovimentoVendaDireta = async (): Promise<{ movimento_id: number; nr: number; total: number; }> => {
    const { data: maxMov } = await db.from("movimento")
      .select("movimento_id").order("movimento_id", { ascending: false }).limit(1);
    const movId = ((maxMov && maxMov[0]?.movimento_id) || 0) + 1;
    const { data: maxNr } = await db.from("movimento")
      .select("nr_movimento").eq("empresa_id", XEmpresaId).order("nr_movimento", { ascending: false }).limit(1);
    const nr = ((maxNr && maxNr[0]?.nr_movimento) || 0) + 1;
    const total = totalCart;

    const mov = {
      movimento_id: movId,
      empresa_id: XEmpresaId,
      cadastro_id: XCliente?.cadastro_id || null,
      funcionario_id: caixa.funcionario_id,
      nr_movimento: nr,
      tp_movimento: "S",
      tp_origem: "PDV",
      st_pedido: "F",
      faturado: "N",
      dt_emissao: new Date().toISOString(),
      dt_finalizacao: new Date().toISOString(),
      tp_operacao_id: XParams!.tp_operacao_caixa,
      vl_produto: total,
      vl_movimento: total,
      vl_desconto: 0,
      tp_desconto: "N",
      pc_desconto: 0,
      deposito_id: XParams!.deposito_estoque_caixa,
      excluido: false,
    };
    const { error } = await db.from("movimento").insert(mov);
    if (error) throw new Error("Falha ao criar venda: " + error.message);

    const { data: maxIt } = await db.from("movimento_item")
      .select("movimento_item_id").order("movimento_item_id", { ascending: false }).limit(1);
    let nextItId = ((maxIt && maxIt[0]?.movimento_item_id) || 0) + 1;
    const itens = XCart.map(c => ({
      movimento_item_id: nextItId++,
      empresa_id: XEmpresaId,
      movimento_id: movId,
      produto_id: c.produto_id,
      nm_produto: c.nm_produto,
      unidade_id: c.unidade_id,
      tp_movimento: "S",
      qt_movimento: c.qt_item,
      vl_und_produto: c.vl_unitario,
      vl_produto: c.qt_item * c.vl_unitario,
      vl_movimento: c.qt_item * c.vl_unitario,
      vl_desconto: 0,
      pc_desconto: 0,
      tp_desconto: "N",
      deposito_id: c.deposito_id,
      excluido: false,
    }));
    if (itens.length > 0) {
      const { error: e2 } = await db.from("movimento_item").insert(itens);
      if (e2) throw new Error("Falha ao criar itens: " + e2.message);
    }
    return { movimento_id: movId, nr, total };
  };

  /** Confirmação do pagamento: grava caixa_movimento + itens + atualiza pedido para 'R'. */
  const confirmarPagamento = async (linhas: IPdvPagamentoLinha[]) => {
    try {
      let movimentoId: number;
      let nrMov: number;
      let total: number;

      if (XPedidoSel) {
        movimentoId = XPedidoSel.movimento_id;
        nrMov = XPedidoSel.nr_movimento || movimentoId;
        total = XPedidoSel.vl_movimento;
      } else {
        const novo = await criarMovimentoVendaDireta();
        movimentoId = novo.movimento_id;
        nrMov = novo.nr;
        total = novo.total;
      }

      const { data: maxCx } = await db.from("caixa_movimento")
        .select("caixa_movimento_id").order("caixa_movimento_id", { ascending: false }).limit(1);
      const cxId = ((maxCx && maxCx[0]?.caixa_movimento_id) || 0) + 1;

      const cm = {
        caixa_movimento_id: cxId,
        empresa_id: XEmpresaId,
        funcionario_id: caixa.funcionario_id,
        colaborador_id: caixa.funcionario_id,
        dt_movimento: dtMovimento,
        tp_movimento: "E",
        tp_operacao: String(XParams!.tp_operacao_caixa),
        conta_gerencial_id: XParams!.conta_gerencial_caixa,
        centro_custo_id: XParams!.centro_custo_caixa,
        historico: `Recebimento Pedido ${nrMov}`,
        documento: String(nrMov),
        vlr_movimento: total,
        movimento_id: movimentoId,
        excluido: false,
      };
      const { error: e1 } = await db.from("caixa_movimento").insert(cm);
      if (e1) throw new Error("Falha ao gravar caixa_movimento: " + e1.message);

      const { data: maxCxIt } = await db.from("caixa_movimento_item")
        .select("caixa_movimento_item_id").order("caixa_movimento_item_id", { ascending: false }).limit(1);
      let nextCxIt = ((maxCxIt && maxCxIt[0]?.caixa_movimento_item_id) || 0) + 1;
      const itensCx = linhas.map(l => ({
        caixa_movimento_item_id: nextCxIt++,
        caixa_movimento_id: cxId,
        empresa_id: XEmpresaId,
        condicao_id: l.condicao_id,
        prazo_pagamento_id: 0,
        bandeira_id: l.bandeira_id || 0,
        operadora_id: l.operadora_id || 0,
        numero_autoriza: l.numero_autoriza || "",
        qt_parcela: l.qt_parcela,
        vl_parcela: l.vl_parcela,
        vl_recebido: l.vl_recebido,
        excluido: false,
      }));
      const { error: e2 } = await db.from("caixa_movimento_item").insert(itensCx);
      if (e2) throw new Error("Falha ao gravar formas de pagamento: " + e2.message);

      const { error: e3 } = await db.from("movimento")
        .update({ st_pedido: "R", dt_pagamento: new Date().toISOString() })
        .eq("movimento_id", movimentoId);
      if (e3) throw new Error("Falha ao baixar pedido: " + e3.message);

      toast.success(`Pedido ${nrMov} recebido com sucesso.`);
      setXOpenPagto(false);
      setXPedidoSel(null);
      setXCart([]);
      setXCliente(null);
      setXPagtosPedido([]);
      setXImpressaoDados(null);
      carregarPedidos();
    } catch (err: any) {
      toast.error(err.message || "Erro ao finalizar.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-foreground">PDV</span>
          <span className="text-muted-foreground">Caixa: <strong className="text-foreground">{caixa.nome}</strong></span>
          <span className="text-muted-foreground">Data: <strong className="text-foreground">{new Date(dtMovimento + "T00:00:00").toLocaleDateString("pt-BR")}</strong></span>
          <span className="text-muted-foreground">Abertura #<strong className="text-foreground">{abertura.caixa_abertura_id}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setXOpenConfig(true)}
            className="text-sm px-3 py-1 rounded border border-border flex items-center gap-1 hover:bg-accent">
            <Settings size={14} /> Configurar
          </button>
          <button onClick={onSair}
            className="text-sm px-3 py-1 rounded border border-border flex items-center gap-1 hover:bg-accent">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* Coluna esquerda (col-span-8): Venda direta OU detalhes do pedido */}
        <div className="col-span-8 flex flex-col border border-border rounded bg-card overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold">
              {XPedidoSel ? `Itens do Pedido Nº ${XPedidoSel.nr_movimento || XPedidoSel.movimento_id}` : "Venda Direta"}
            </span>
            {XPedidoSel && (
              <button onClick={() => setXPedidoSel(null)} className="text-xs text-muted-foreground hover:text-foreground">
                ← Voltar à venda direta
              </button>
            )}
          </div>

          {!XPedidoSel && (
            <div className="px-3 py-2 border-b border-border flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input ref={searchRef} value={XSearchTerm} onChange={e => setXSearchTerm(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") buscarTermo(); }}
                  placeholder="Código, GTIN ou nome do produto... (Enter)"
                  className="w-full pl-8 pr-2 py-1.5 border border-border rounded text-sm bg-card" />
              </div>
              <button onClick={() => setXOpenProduto(true)}
                className="text-sm px-3 py-1.5 rounded border border-border hover:bg-accent flex items-center gap-1">
                <Plus size={14} /> Pesquisar
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto relative" style={{ fontSize: `${XFonteProd}px` }}>
            {XPedidoSel ? (
              <div className="divide-y divide-border">
                {XPedidoSelItens.map((it: any) => (
                  <div key={it.movimento_item_id} className="px-3 py-2">
                    <div className="flex justify-between">
                      <span className="truncate flex-1">{it.nm_produto}</span>
                      <span className="font-mono">{fmt(Number(it.vl_movimento || it.qt_movimento * it.vl_und_produto))}</span>
                    </div>
                    <div className="text-muted-foreground" style={{ fontSize: `${XFonteProd - 1}px` }}>
                      {fmt(Number(it.qt_movimento))} {it.unidade_id || ""} × {fmt(Number(it.vl_und_produto))}
                    </div>
                  </div>
                ))}
                {XPedidoSelItens.length === 0 && (
                  <div className="p-4 text-xs text-muted-foreground text-center">Sem itens.</div>
                )}
              </div>
            ) : (
              <>
                {XCart.length === 0 && XParams?.imagem_caixa && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img src={XParams.imagem_caixa} alt="" className="max-w-[70%] max-h-[70%] object-contain opacity-30" />
                  </div>
                )}
                <div className="divide-y divide-border relative">
                  {XCart.length === 0 && !XParams?.imagem_caixa && (
                    <div className="p-4 text-xs text-muted-foreground text-center">Bipagem ou pesquisa para incluir itens.</div>
                  )}
                  {XCart.map((c, idx) => (
                    <div key={idx} className="px-3 py-2 flex items-center gap-2">
                      <div className="flex-1">
                        <div className="font-medium truncate">{c.nm_produto}</div>
                        <div className="text-muted-foreground" style={{ fontSize: `${XFonteProd - 1}px` }}>
                          {fmt(c.qt_item)} {c.unidade_id || ""} × {fmt(c.vl_unitario)} = <span className="font-mono">{fmt(c.qt_item * c.vl_unitario)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => alterarQt(idx, -1)} className="px-2 py-0.5 border border-border rounded hover:bg-accent">−</button>
                        <button onClick={() => alterarQt(idx, +1)} className="px-2 py-0.5 border border-border rounded hover:bg-accent">+</button>
                        <button onClick={() => removerItem(idx)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Coluna direita (col-span-4): Pedidos a Receber (topo) + Resumo (rodapé) */}
        <div className="col-span-4 flex flex-col gap-3 overflow-hidden">
          {/* Pedidos a Receber */}
          <div className="flex-1 flex flex-col border border-border rounded bg-card overflow-hidden min-h-0">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold">Pedidos a Receber</span>
              <button onClick={carregarPedidos} title="Atualizar" className="p-1 rounded hover:bg-accent">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="px-2 py-1.5 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={XBuscaPedido}
                  onChange={(e) => setXBuscaPedido(e.target.value)}
                  placeholder="Cliente, vendedor ou nº..."
                  className="w-full pl-7 pr-2 py-1 border border-border rounded text-xs bg-card"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ fontSize: `${XFontePed}px` }}>
              {XPedidosFilt.length === 0 && (
                <div className="p-4 text-xs text-muted-foreground text-center">
                  {XPedidos.length === 0 ? "Nenhum pedido fechado." : "Nenhum resultado para a busca."}
                </div>
              )}
              {XPedidosFilt.map(p => {
                const sel = XPedidoSel?.movimento_id === p.movimento_id;
                return (
                  <button key={p.movimento_id}
                    onClick={() => { setXPedidoSel(p); setXCart([]); }}
                    className={`w-full text-left px-3 py-2 border-b border-border ${sel ? "bg-primary/15" : "hover:bg-accent/50"}`}>
                    <div className="flex justify-between font-medium">
                      <span>Nº {p.nr_movimento || p.movimento_id}</span>
                      <span className="font-mono">{fmt(p.vl_movimento)}</span>
                    </div>
                    <div className="text-muted-foreground truncate">{p.cliente_nome}</div>
                    {p.vendedor_nome && (
                      <div className="text-muted-foreground truncate" style={{ fontSize: `${XFontePed - 1}px` }}>
                        Vend: {p.vendedor_nome}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumo */}
          <div className="flex flex-col border border-border rounded bg-card overflow-hidden">
            <div className="px-3 py-2 border-b border-border text-sm font-semibold">Resumo</div>
            <div className="p-3 space-y-2">
              {!XPedidoSel && (
                <div>
                  <label className="text-xs text-muted-foreground">Cliente</label>
                  <div className="flex gap-1">
                    <div className="flex-1 border border-border rounded px-2 py-1.5 text-sm bg-card truncate">
                      {XCliente ? (XCliente.nome_fantasia || XCliente.razao_social) : "(Consumidor)"}
                    </div>
                    <button onClick={() => setXOpenCliente(true)} className="px-2 border border-border rounded hover:bg-accent">
                      <Search size={14} />
                    </button>
                    {XCliente && (
                      <button onClick={() => setXCliente(null)} className="px-2 border border-border rounded text-destructive hover:bg-destructive/10">
                        ×
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="border border-border rounded px-3 py-3 bg-muted/40 mt-2">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-2xl font-bold text-right">{fmt(totalReceber)}</div>
              </div>
            </div>
            <div className="p-3 border-t border-border">
              <button onClick={finalizarVenda} disabled={!podeReceber}
                className="w-full text-sm px-4 py-2.5 rounded bg-primary text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2 font-semibold">
                <Receipt size={16} /> Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProdutoSearchDialog open={XOpenProduto} onClose={() => setXOpenProduto(false)}
        onSelect={(p, dep) => adicionarProdutoAoCarrinho(p, dep)} />
      <ClienteSearchDialog open={XOpenCliente} onClose={() => setXOpenCliente(false)}
        onSelect={(c) => setXCliente(c)} empresaId={XEmpresaId} />

      <OpcoesPagamentoDialog
        open={XOpenOpcoes}
        dados={XImpressaoDados}
        onClose={() => setXOpenOpcoes(false)}
        onContinuarPagamento={() => { setXOpenOpcoes(false); setXOpenPagto(true); }}
      />

      <PagamentoDialog
        open={XOpenPagto}
        totalPedido={totalReceber}
        pagtosPreCarregados={XPagtosPedido}
        onClose={() => setXOpenPagto(false)}
        onConfirmar={confirmarPagamento}
      />

      <ConfigurarDialog
        open={XOpenConfig}
        funcionarioId={caixa.funcionario_id}
        fontePedidos={XFontePed}
        fonteProdutos={XFonteProd}
        tempoRefresh={XRefreshSeg}
        onClose={() => setXOpenConfig(false)}
        onSalvar={(v) => {
          setXFontePed(v.fontePedidos);
          setXFonteProd(v.fonteProdutos);
          setXRefreshSeg(v.tempoRefresh);
        }}
      />
    </div>
  );
};

export default PdvTela;
