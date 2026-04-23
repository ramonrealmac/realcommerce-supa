import React, { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const db = supabase as any;

export interface IProdutoRow {
  produto_id: number;
  nome: string;
  unidade_id: string | null;
  preco_venda: number;
  estoque_disponivel: number;
  estoque_reservado: number;
}

interface IProps {
  open: boolean;
  onClose: () => void;
  onSelect: (produto: IProdutoRow) => void;
}

const fmtNum = (v: number, dec = 2) =>
  (v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const ProdutoSearchDialog: React.FC<IProps> = ({ open, onClose, onSelect }) => {
  const { XEmpresaId, XEmpresaMatrizId, XEmpresas } = useAppContext();
  const [XTermo, setXTermo] = useState("");
  const [XRows, setXRows] = useState<IProdutoRow[]>([]);
  const [XLoading, setXLoading] = useState(false);

  const XGroupEmpresaIds = useMemo(() => {
    return XEmpresas
      .filter(e => e.empresa_matriz_id === XEmpresaMatrizId || e.empresa_id === XEmpresaMatrizId)
      .map(e => e.empresa_id);
  }, [XEmpresas, XEmpresaMatrizId]);

  const buscar = useCallback(async (termo: string) => {
    setXLoading(true);
    const ids = XGroupEmpresaIds.length > 0 ? XGroupEmpresaIds : [XEmpresaId];

    let q = db.from("produto")
      .select("produto_id, nome, unidade_id, preco_venda, referencia, gtin")
      .in("empresa_id", ids)
      .eq("excluido", false)
      .order("nome")
      .limit(100);

    const t = termo.trim();
    if (t) {
      if (/^\d+$/.test(t)) {
        q = q.or(`produto_id.eq.${t},referencia.ilike.%${t}%,gtin.ilike.%${t}%,nome.ilike.%${t}%`);
      } else {
        q = q.or(`nome.ilike.%${t}%,referencia.ilike.%${t}%,gtin.ilike.%${t}%`);
      }
    }

    const { data: prods, error } = await q;
    if (error || !prods) { setXLoading(false); setXRows([]); return; }

    // Buscar depósitos visíveis (mesma regra do EstoqueForm)
    const { data: deps } = await db.from("deposito")
      .select("deposito_id, empresa_id, st_privado")
      .in("empresa_id", ids)
      .eq("excluido", false);
    const visibleDepIds = new Set(
      (deps || [])
        .filter((d: any) => d.empresa_id === XEmpresaId || d.st_privado === false)
        .map((d: any) => d.deposito_id)
    );

    // Somar estoque por produto
    const prodIds = prods.map((p: any) => p.produto_id);
    let estMap: Record<number, { disp: number; res: number }> = {};
    if (prodIds.length > 0 && visibleDepIds.size > 0) {
      const { data: ests } = await db.from("estoque")
        .select("produto_id, deposito_id, estoque_disponivel, estoque_reservado")
        .in("produto_id", prodIds)
        .in("empresa_id", ids)
        .eq("excluido", false);
      for (const e of (ests || []) as any[]) {
        if (!visibleDepIds.has(e.deposito_id)) continue;
        const cur = estMap[e.produto_id] || { disp: 0, res: 0 };
        cur.disp += Number(e.estoque_disponivel || 0);
        cur.res += Number(e.estoque_reservado || 0);
        estMap[e.produto_id] = cur;
      }
    }

    const rows: IProdutoRow[] = (prods as any[]).map(p => ({
      produto_id: p.produto_id,
      nome: p.nome,
      unidade_id: p.unidade_id,
      preco_venda: Number(p.preco_venda || 0),
      estoque_disponivel: estMap[p.produto_id]?.disp || 0,
      estoque_reservado: estMap[p.produto_id]?.res || 0,
    }));
    setXRows(rows);
    setXLoading(false);
  }, [XEmpresaId, XGroupEmpresaIds]);

  useEffect(() => {
    if (open) { setXTermo(""); buscar(""); }
  }, [open, buscar]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => buscar(XTermo), 300);
    return () => clearTimeout(t);
  }, [XTermo, open, buscar]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Pesquisar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={XTermo}
              onChange={e => setXTermo(e.target.value)}
              placeholder="Digite código, nome, referência ou GTIN..."
              className="w-full pl-9 pr-9 py-2 border border-border rounded text-sm bg-card"
            />
            {XTermo && (
              <button onClick={() => setXTermo("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="border border-border rounded overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted text-xs font-semibold text-muted-foreground">
              <div className="col-span-1 text-right">Código</div>
              <div className="col-span-5">Nome</div>
              <div className="col-span-1">Und.</div>
              <div className="col-span-2 text-right">Preço Venda</div>
              <div className="col-span-2 text-right">Estoq. Disp.</div>
              <div className="col-span-1 text-right">Reserv.</div>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {XLoading && <div className="p-6 text-center text-sm text-muted-foreground">Carregando...</div>}
              {!XLoading && XRows.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</div>
              )}
              {!XLoading && XRows.map(r => (
                <button
                  key={r.produto_id}
                  onDoubleClick={() => { onSelect(r); onClose(); }}
                  onClick={() => { onSelect(r); onClose(); }}
                  className="w-full grid grid-cols-12 gap-2 px-3 py-2 text-sm text-left border-t border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="col-span-1 text-right font-mono">{r.produto_id}</div>
                  <div className="col-span-5 truncate">{r.nome}</div>
                  <div className="col-span-1">{r.unidade_id || ""}</div>
                  <div className="col-span-2 text-right font-mono">{fmtNum(r.preco_venda)}</div>
                  <div className="col-span-2 text-right font-mono">{fmtNum(r.estoque_disponivel, 3)}</div>
                  <div className="col-span-1 text-right font-mono text-muted-foreground">{fmtNum(r.estoque_reservado, 3)}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Clique (ou duplo-clique) para selecionar. Resultados limitados a 100.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoSearchDialog;
