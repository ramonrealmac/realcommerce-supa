import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import type { IMovimento, IMovimentoPagamento } from "./types";

const db = supabase as any;

interface ICondicao { condicao_id: number; descricao: string; qtd_parcelas: number | null; }

interface IProps {
  pedido: IMovimento | null;
  podeEditar: boolean;
}

const fmt = (v: number) => (v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PedidoPagamentoTab: React.FC<IProps> = ({ pedido, podeEditar }) => {
  const { XEmpresaId } = useAppContext();
  const [XPagtos, setXPagtos] = useState<IMovimentoPagamento[]>([]);
  const [XCondicoes, setXCondicoes] = useState<ICondicao[]>([]);
  const [XEdit, setXEdit] = useState<Partial<IMovimentoPagamento> | null>(null);
  const [XEditingId, setXEditingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!pedido?.movimento_id) { setXPagtos([]); return; }
    const { data, error } = await db.from("movimento_pagamento")
      .select("*").eq("movimento_id", pedido.movimento_id).eq("excluido", false)
      .order("movimento_pagamento_id");
    if (error) { toast.error(error.message); return; }
    setXPagtos(data || []);
  }, [pedido?.movimento_id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    (async () => {
      const { data } = await db.from("condicao_pagamento")
        .select("condicao_id, descricao, qtd_parcelas").eq("excluido", false).order("descricao");
      setXCondicoes(data || []);
    })();
  }, []);

  const totalPago = XPagtos.reduce((a, p) => a + Number(p.vl_pagamento || 0), 0);
  const valorAPagar = Math.max(0, Number(pedido?.vl_movimento || 0) - totalPago);

  const novo = () => {
    setXEditingId(null);
    setXEdit({ vl_pagamento: valorAPagar, n_parcelas: 1, vl_parcelas: valorAPagar, condicao_id: 0, tp_pagamento: "DI", obs_pagamento: "", nr_autorizacao: "" });
  };

  const editar = (p: IMovimentoPagamento) => { setXEdit({ ...p }); setXEditingId(p.movimento_pagamento_id); };

  const setCondicao = (cid: number) => {
    const c = XCondicoes.find(x => x.condicao_id === cid);
    const parc = c?.qtd_parcelas || 1;
    setXEdit(prev => {
      const v = Number(prev?.vl_pagamento) || 0;
      return { ...prev!, condicao_id: cid, n_parcelas: parc, vl_parcelas: parc > 0 ? +(v / parc).toFixed(2) : v };
    });
  };

  const setVlPagto = (v: number) => setXEdit(prev => {
    const p = Number(prev?.n_parcelas) || 1;
    return { ...prev!, vl_pagamento: v, vl_parcelas: p > 0 ? +(v / p).toFixed(2) : v };
  });

  const salvar = async () => {
    if (!pedido?.movimento_id) { toast.error("Salve o pedido antes."); return; }
    if (!XEdit?.condicao_id) { toast.error("Selecione a condição."); return; }
    const payload = { ...XEdit, empresa_id: XEmpresaId, movimento_id: pedido.movimento_id };
    if (XEditingId) {
      const { error } = await db.from("movimento_pagamento").update(payload).eq("movimento_pagamento_id", XEditingId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await db.from("movimento_pagamento").insert(payload);
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Pagamento salvo.");
    setXEdit(null); setXEditingId(null);
    await load();
  };

  const excluir = async (p: IMovimentoPagamento) => {
    if (!confirm("Excluir pagamento?")) return;
    const { error } = await db.from("movimento_pagamento").update({ excluido: true }).eq("movimento_pagamento_id", p.movimento_pagamento_id);
    if (error) { toast.error(error.message); return; }
    await load();
  };

  const cols: IGridColumn[] = [
    { key: "condicao_id", label: "Condição", width: "2fr", render: r => XCondicoes.find(c => c.condicao_id === r.condicao_id)?.descricao || r.condicao_id },
    { key: "vl_pagamento", label: "Valor", width: "120px", align: "right", render: r => fmt(r.vl_pagamento) },
    { key: "n_parcelas", label: "Parcelas", width: "100px", align: "right" },
    { key: "vl_parcelas", label: "Valor Parcela", width: "120px", align: "right", render: r => fmt(r.vl_parcelas) },
    {
      key: "_acoes", label: "Ações", width: "100px",
      render: r => (
        <div className="flex gap-1">
          <button disabled={!podeEditar} onClick={() => editar(r)} className="text-xs px-2 py-0.5 border border-border rounded disabled:opacity-50">✏</button>
          <button disabled={!podeEditar} onClick={() => excluir(r)} className="text-xs px-2 py-0.5 border border-border rounded text-destructive disabled:opacity-50">🗑</button>
        </div>
      ),
    },
  ];

  if (!pedido?.movimento_id) {
    return <div className="text-sm text-muted-foreground p-4">Salve o pedido para inserir pagamentos.</div>;
  }
  const ro = !podeEditar;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Valor a Pagar:</span>{" "}
          <span className="font-bold text-primary text-lg">{fmt(valorAPagar)}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Total Pedido:</span>{" "}
          <span className="font-medium">{fmt(Number(pedido?.vl_movimento || 0))}</span>
        </div>
        <button disabled={ro} onClick={novo} className="ml-auto text-sm px-3 py-1.5 border border-border rounded bg-primary text-primary-foreground disabled:opacity-50">+ Novo Pagamento</button>
      </div>

      {XEdit && (
        <div className="border border-border rounded p-3 space-y-2 bg-card">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5"><label className="text-xs text-muted-foreground">Condição</label>
              <select disabled={ro} value={XEdit.condicao_id ?? 0} onChange={e => setCondicao(Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm bg-card">
                <option value={0}>--</option>
                {XCondicoes.map(c => <option key={c.condicao_id} value={c.condicao_id}>{c.descricao}</option>)}
              </select>
            </div>
            <div className="col-span-3"><label className="text-xs text-muted-foreground">Valor</label><input type="number" disabled={ro} value={XEdit.vl_pagamento ?? 0} onChange={e => setVlPagto(Number(e.target.value))} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Parcelas</label><input type="number" disabled={ro} value={XEdit.n_parcelas ?? 1} onChange={e => setXEdit(prev => { const p = Number(e.target.value) || 1; const v = Number(prev?.vl_pagamento) || 0; return { ...prev!, n_parcelas: p, vl_parcelas: p > 0 ? +(v / p).toFixed(2) : v }; })} className="w-full border border-border rounded px-2 py-1 text-sm text-right" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground">Vlr. Parcela</label><input readOnly value={fmt(XEdit.vl_parcelas || 0)} className="w-full border border-border rounded px-2 py-1 text-sm bg-secondary text-right" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={salvar} disabled={ro} className="text-sm px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-50">Salvar</button>
            <button onClick={() => { setXEdit(null); setXEditingId(null); }} className="text-sm px-3 py-1 rounded border border-border">Cancelar</button>
          </div>
        </div>
      )}

      <DataGrid columns={cols} data={XPagtos} maxHeight="300px" />
    </div>
  );
};

export default PedidoPagamentoTab;
