import React, { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { Search } from "lucide-react";
import type { IMovimento, IMovimentoItem } from "./types";
import ProdutoSearchDialog, { IProdutoRow } from "./ProdutoSearchDialog";

const db = supabase as any;

interface IDepositoLookup { deposito_id: number; nome: string; }

interface IProps {
  pedido: IMovimento | null;
  podeEditar: boolean;
  onTotalsChanged?: () => void;
  autoNovoTrigger?: number; // change value to trigger "novo()"
}

const fmt = (v: number) =>
  (v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PedidoItensTab: React.FC<IProps> = ({ pedido, podeEditar, onTotalsChanged, autoNovoTrigger }) => {
  const { XEmpresaId, XEmpresaMatrizId, XEmpresas } = useAppContext();
  const [XItens, setXItens] = useState<IMovimentoItem[]>([]);
  const [XDepositos, setXDepositos] = useState<IDepositoLookup[]>([]);
  const [XEdit, setXEdit] = useState<Partial<IMovimentoItem> | null>(null);
  const [XEditingId, setXEditingId] = useState<number | null>(null);
  const [XSearchOpen, setXSearchOpen] = useState(false);
  const [XEditEstoque, setXEditEstoque] = useState<{ disp: number; res: number } | null>(null);

  const XGroupEmpresaIds = useMemo(() => {
    return XEmpresas
      .filter(e => e.empresa_matriz_id === XEmpresaMatrizId || e.empresa_id === XEmpresaMatrizId)
      .map(e => e.empresa_id);
  }, [XEmpresas, XEmpresaMatrizId]);

  const loadItens = useCallback(async () => {
    if (!pedido?.movimento_id) { setXItens([]); return; }
    const { data, error } = await db.from("movimento_item")
      .select("*").eq("movimento_id", pedido.movimento_id).eq("excluido", false)
      .order("movimento_item_id");
    if (error) { toast.error("Erro itens: " + error.message); return; }
    setXItens(data || []);
  }, [pedido?.movimento_id]);

  useEffect(() => { loadItens(); }, [loadItens]);

  // Carrega depósitos visíveis (mesma regra do EstoqueForm)
  useEffect(() => {
    (async () => {
      const ids = XGroupEmpresaIds.length > 0 ? XGroupEmpresaIds : [XEmpresaId];
      const { data } = await db.from("deposito")
        .select("deposito_id, nome, empresa_id, st_privado")
        .in("empresa_id", ids)
        .eq("excluido", false)
        .order("nome");
      const filtered = (data || []).filter((d: any) =>
        d.empresa_id === XEmpresaId || d.st_privado === false
      );
      setXDepositos(filtered);
    })();
  }, [XEmpresaId, XGroupEmpresaIds]);

  const novo = useCallback(() => {
    setXEditingId(null);
    setXEditEstoque(null);
    setXEdit({
      qt_movimento: 1, vl_und_produto: 0, vl_produto: 0,
      pc_desconto: 0, vl_desconto: 0, vl_movimento: 0,
      vl_despesa: 0, vl_frete: 0, vl_seguro: 0, vl_outro: 0,
      entrega: "N", deposito_id: 1,
    });
  }, []);

  // Auto disparar "novo item" quando solicitado
  useEffect(() => {
    if (autoNovoTrigger && pedido?.movimento_id && podeEditar && !XEdit) {
      novo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoNovoTrigger, pedido?.movimento_id]);

  const editar = (it: IMovimentoItem) => {
    setXEdit({ ...it });
    setXEditingId(it.movimento_item_id);
    setXEditEstoque(null);
  };

  const recalc = (e: Partial<IMovimentoItem>): Partial<IMovimentoItem> => {
    const qt = Number(e.qt_movimento) || 0;
    const vu = Number(e.vl_und_produto) || 0;
    const sub = qt * vu;
    const pc = Number(e.pc_desconto) || 0;
    const vd = +(sub * pc / 100).toFixed(2);
    const out = (Number(e.vl_despesa) || 0) + (Number(e.vl_frete) || 0) + (Number(e.vl_seguro) || 0) + (Number(e.vl_outro) || 0);
    return { ...e, vl_produto: +sub.toFixed(2), vl_desconto: vd, vl_movimento: +(sub - vd + out).toFixed(2) };
  };

  const setF = <K extends keyof IMovimentoItem>(k: K, v: any) => {
    setXEdit(prev => recalc({ ...prev!, [k]: v }));
  };

  const onPickProduto = (p: IProdutoRow) => {
    setXEdit(prev => recalc({
      ...(prev || {}),
      produto_id: p.produto_id,
      cd_produto: String(p.produto_id),
      nm_produto: p.nome,
      unidade_id: p.unidade_id,
      vl_und_produto: Number(p.preco_venda) || 0,
    }));
    setXEditEstoque({ disp: p.estoque_disponivel, res: p.estoque_reservado });
  };

  const limparProduto = () => {
    setXEdit(prev => recalc({
      ...(prev || {}),
      produto_id: undefined,
      cd_produto: undefined,
      nm_produto: undefined,
      unidade_id: undefined,
      vl_und_produto: 0,
    }));
    setXEditEstoque(null);
  };

  const onPcDesc = (pc: number) => setXEdit(prev => recalc({ ...prev!, pc_desconto: pc }));
  const onVlDesc = (vl: number) => {
    setXEdit(prev => {
      const sub = (Number(prev?.qt_movimento) || 0) * (Number(prev?.vl_und_produto) || 0);
      const pc = sub > 0 ? +(vl / sub * 100).toFixed(2) : 0;
      return recalc({ ...prev!, pc_desconto: pc });
    });
  };

  const salvarItem = async () => {
    if (!pedido?.movimento_id) { toast.error("Salve o pedido antes."); return; }
    if (!XEdit?.produto_id) { toast.error("Selecione o produto."); return; }
    if ((Number(XEdit.qt_movimento) || 0) <= 0) { toast.error("Qtd. inválida."); return; }
    const payload = {
      ...XEdit,
      empresa_id: XEmpresaId,
      movimento_id: pedido.movimento_id,
      tp_movimento: pedido.tp_movimento || "PD",
    };
    if (XEditingId) {
      const { error } = await db.from("movimento_item").update(payload).eq("movimento_item_id", XEditingId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await db.from("movimento_item").insert(payload);
      if (error) { toast.error(error.message); return; }
    }
    await db.rpc("fu_recalcular_pedido", { _movimento_id: pedido.movimento_id });
    toast.success("Item salvo.");
    setXEdit(null); setXEditingId(null); setXEditEstoque(null);
    await loadItens();
    onTotalsChanged?.();
  };

  const excluirItem = async (it: IMovimentoItem) => {
    if (!confirm("Excluir item?")) return;
    const { error } = await db.from("movimento_item").update({ excluido: true }).eq("movimento_item_id", it.movimento_item_id);
    if (error) { toast.error(error.message); return; }
    await db.rpc("fu_recalcular_pedido", { _movimento_id: pedido!.movimento_id });
    await loadItens();
    onTotalsChanged?.();
  };

  const cols: IGridColumn[] = [
    { key: "nm_produto", label: "Produto", width: "2fr" },
    { key: "qt_movimento", label: "Qtd.", width: "80px", align: "right", render: r => fmt(r.qt_movimento) },
    { key: "vl_und_produto", label: "Vlr. Unit", width: "100px", align: "right", render: r => fmt(r.vl_und_produto) },
    { key: "vl_produto", label: "Vlr. Produto", width: "110px", align: "right", render: r => fmt(r.vl_produto) },
    { key: "pc_desconto", label: "Desc. (%)", width: "80px", align: "right", render: r => fmt(r.pc_desconto) },
    { key: "vl_outro", label: "Vlr. Outros", width: "100px", align: "right", render: r => fmt(r.vl_outro) },
    { key: "vl_movimento", label: "Total", width: "110px", align: "right", render: r => fmt(r.vl_movimento) },
    { key: "vl_desconto", label: "Desc. (R$)", width: "100px", align: "right", render: r => fmt(r.vl_desconto) },
    {
      key: "_acoes", label: "Ações", width: "100px",
      render: r => (
        <div className="flex gap-1">
          <button disabled={!podeEditar} onClick={() => editar(r)} className="text-xs px-2 py-0.5 border border-border rounded hover:bg-secondary disabled:opacity-50">✏</button>
          <button disabled={!podeEditar} onClick={() => excluirItem(r)} className="text-xs px-2 py-0.5 border border-border rounded text-destructive hover:bg-secondary disabled:opacity-50">🗑</button>
        </div>
      ),
    },
  ];

  // totals
  const T = XItens.reduce((acc, i) => ({
    vl_produto: acc.vl_produto + Number(i.vl_produto || 0),
    vl_desconto: acc.vl_desconto + Number(i.vl_desconto || 0),
    vl_frete: acc.vl_frete + Number(i.vl_frete || 0),
    vl_despesa: acc.vl_despesa + Number(i.vl_despesa || 0),
    vl_seguro: acc.vl_seguro + Number(i.vl_seguro || 0),
    vl_outro: acc.vl_outro + Number(i.vl_outro || 0),
    vl_movimento: acc.vl_movimento + Number(i.vl_movimento || 0),
  }), { vl_produto: 0, vl_desconto: 0, vl_frete: 0, vl_despesa: 0, vl_seguro: 0, vl_outro: 0, vl_movimento: 0 });

  if (!pedido?.movimento_id) {
    return <div className="text-sm text-muted-foreground p-4">Salve o pedido para começar a inserir itens.</div>;
  }

  const ro = !podeEditar;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button disabled={ro} onClick={novo} className="text-sm px-3 py-1.5 border border-border rounded bg-primary text-primary-foreground disabled:opacity-50">+ Novo Item</button>
        <button onClick={loadItens} className="text-sm px-3 py-1.5 border border-border rounded">↻</button>
      </div>

      {XEdit && (
        <div className="border border-border rounded p-3 space-y-2 bg-card">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5">
              <label className="text-xs text-muted-foreground">Produto</label>
              <div className="flex gap-1">
                <input
                  readOnly
                  value={XEdit.produto_id ? `${XEdit.produto_id} - ${XEdit.nm_produto || ""}` : ""}
                  placeholder="Clique na lupa para pesquisar..."
                  className="flex-1 border border-border rounded px-2 py-1 text-sm bg-secondary"
                />
                <button
                  type="button"
                  disabled={ro}
                  onClick={() => setXSearchOpen(true)}
                  className="px-2 py-1 border border-border rounded bg-card hover:bg-accent disabled:opacity-50"
                  title="Pesquisar produto"
                >
                  <Search className="w-4 h-4" />
                </button>
                {XEdit.produto_id && !ro && (
                  <button
                    type="button"
                    onClick={limparProduto}
                    className="px-2 py-1 border border-border rounded bg-card hover:bg-accent text-xs"
                    title="Limpar"
                  >×</button>
                )}
              </div>
            </div>
            <div className="col-span-1"><label className="text-xs text-muted-foreground">Und.</label><input readOnly value={XEdit.unidade_id ?? ""} className="w-full border border-border rounded px-2 py-1 text-sm bg-secondary" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Preço Unit.</label><input type="number" disabled={ro} value={XEdit.vl_und_produto ?? 0} onChange={e => setF("vl_und_produto", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-1"><label className="text-xs text-muted-foreground">Qtd.</label><input type="number" disabled={ro} value={XEdit.qt_movimento ?? 0} onChange={e => setF("qt_movimento", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-3"><label className="text-xs text-muted-foreground">Subtotal</label><input readOnly value={fmt(XEdit.vl_produto || 0)} className="w-full border border-border rounded px-2 py-1 text-sm bg-secondary text-right" /></div>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Desc. (%)</label><input type="number" disabled={ro || pedido.tp_desconto === "N"} value={XEdit.pc_desconto ?? 0} onChange={e => onPcDesc(Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Desc. (R$)</label><input type="number" disabled={ro || pedido.tp_desconto === "N"} value={XEdit.vl_desconto ?? 0} onChange={e => onVlDesc(Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-1 flex items-end gap-1"><label className="flex items-center gap-1 text-xs"><input type="checkbox" disabled={ro} checked={XEdit.entrega === "S"} onChange={e => setF("entrega", e.target.checked ? "S" : "N")} />P/Entrega?</label></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">FC</label><input disabled={ro} value={XEdit.infad_produto ?? ""} onChange={e => setF("infad_produto", e.target.value)} className="w-full border border-border rounded px-2 py-1 text-sm" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Estoq. Disp.</label><input readOnly value={XEditEstoque ? fmt(XEditEstoque.disp) : ""} className="w-full border border-border rounded px-2 py-1 text-sm bg-secondary text-right" /></div>
            <div className="col-span-3"><label className="text-xs text-muted-foreground">Depósito</label>
              <select disabled={ro} value={XEdit.deposito_id ?? ""} onChange={e => setF("deposito_id", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm bg-card">
                <option value="">--</option>
                {XDepositos.map(d => <option key={d.deposito_id} value={d.deposito_id}>{d.deposito_id} - {d.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Vlr. Desp.</label><input type="number" disabled={ro} value={XEdit.vl_despesa ?? 0} onChange={e => setF("vl_despesa", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Vlr. Frete</label><input type="number" disabled={ro} value={XEdit.vl_frete ?? 0} onChange={e => setF("vl_frete", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Vlr. Seg.</label><input type="number" disabled={ro} value={XEdit.vl_seguro ?? 0} onChange={e => setF("vl_seguro", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Vlr. Outros</label><input type="number" disabled={ro} value={XEdit.vl_outro ?? 0} onChange={e => setF("vl_outro", Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Total</label><input readOnly value={fmt(XEdit.vl_movimento || 0)} className="w-full border border-border rounded px-2 py-1 text-sm bg-secondary text-right font-semibold" /></div>
            <div className="col-span-2 flex items-end gap-1">
              <button onClick={salvarItem} disabled={ro} className="text-sm px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-50">Inserir Produto</button>
              <button onClick={() => { setXEdit(null); setXEditingId(null); setXEditEstoque(null); }} className="text-sm px-3 py-1 rounded border border-border">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <DataGrid columns={cols} data={XItens} maxHeight="320px" />

      <div className="border border-border rounded p-3 bg-card">
        <div className="text-sm font-semibold mb-2">Totais do Pedido</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div><span className="text-muted-foreground">Vlr. dos Itens:</span> <span className="font-medium">{fmt(T.vl_produto)}</span></div>
          <div><span className="text-muted-foreground">Vlr. Desconto:</span> <span className="font-medium">{fmt(T.vl_desconto)}</span></div>
          <div><span className="text-muted-foreground">Vlr. Frete:</span> <span className="font-medium">{fmt(T.vl_frete)}</span></div>
          <div><span className="text-muted-foreground">Vlr. Desp.:</span> <span className="font-medium">{fmt(T.vl_despesa)}</span></div>
          <div><span className="text-muted-foreground">Vlr. Seg.:</span> <span className="font-medium">{fmt(T.vl_seguro)}</span></div>
          <div><span className="text-muted-foreground">Vlr. Outros:</span> <span className="font-medium">{fmt(T.vl_outro)}</span></div>
          <div className="col-span-2"><span className="text-muted-foreground">Vlr. Total:</span> <span className="font-bold text-primary text-lg">{fmt(T.vl_movimento)}</span></div>
        </div>
      </div>

      <ProdutoSearchDialog
        open={XSearchOpen}
        onClose={() => setXSearchOpen(false)}
        onSelect={onPickProduto}
      />
    </div>
  );
};

export default PedidoItensTab;
