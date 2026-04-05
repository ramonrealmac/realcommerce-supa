import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormToolbar from "@/components/shared/FormToolbar";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const db = supabase as any;

type TFormMode = "view" | "edit" | "insert";

interface ICondicao {
  condicao_id: number;
  descricao: string;
  tp_doc: string;
  prazo_1: number | null;
  prazo_2: number;
  prazo_3: number;
  prazo_4: number;
  prazo_5: number;
  prazo_6: number;
  prazo_7: number;
  prazo_8: number;
  prazo_9: number;
  prazo_10: number;
  prazo_11: number;
  prazo_12: number;
  empresa_id: number;
}

const XLocalizarColumns: IGridColumn[] = [
  { key: "condicao_id", label: "Código", width: "80px", align: "right" },
  { key: "descricao", label: "Descrição", width: "1fr" },
  { key: "tp_doc", label: "Tipo Doc.", width: "100px" },
];

const TP_DOC_OPTIONS = [
  { v: "", l: "— Nenhum —" },
  { v: "DM", l: "Duplicata Mercantil" },
  { v: "NP", l: "Nota Promissória" },
  { v: "RC", l: "Recibo" },
  { v: "BO", l: "Boleto" },
  { v: "CH", l: "Cheque" },
  { v: "DI", l: "Dinheiro" },
  { v: "CC", l: "Cartão Crédito" },
  { v: "CD", l: "Cartão Débito" },
  { v: "PIX", l: "PIX" },
];

const PRAZO_KEYS = ["prazo_1","prazo_2","prazo_3","prazo_4","prazo_5","prazo_6","prazo_7","prazo_8","prazo_9","prazo_10","prazo_11","prazo_12"] as const;

const emptyForm = (): Record<string, string> => {
  const f: Record<string, string> = { descricao: "", tp_doc: "" };
  PRAZO_KEYS.forEach(k => (f[k] = "0"));
  return f;
};

const CondicaoPagamentoForm: React.FC = () => {
  const { XEmpresaId, closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XData, setXData] = useState<ICondicao[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XF, setXF] = useState(emptyForm());
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const XCurrentRecord = XData[XCurrentIdx] || null;
  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  const set = useCallback((key: string, val: string) => setXF(prev => ({ ...prev, [key]: val })), []);

  const loadData = useCallback(async () => {
    const { data } = await db
      .from("condicao_pagamento")
      .select("*")
      .eq("empresa_id", XEmpresaId)
      .eq("excluido", false)
      .order("condicao_id");
    setXData(data || []);
  }, [XEmpresaId]);

  useEffect(() => { loadData(); setXCurrentIdx(0); setXFormMode("view"); }, [XEmpresaId]);

  useEffect(() => {
    if (XCurrentRecord && XFormMode === "edit") {
      const nf: Record<string, string> = {
        descricao: XCurrentRecord.descricao || "",
        tp_doc: XCurrentRecord.tp_doc || "",
      };
      PRAZO_KEYS.forEach(k => (nf[k] = String((XCurrentRecord as any)[k] ?? 0)));
      setXF(nf);
    }
  }, [XCurrentRecord, XFormMode]);

  const handleIncluir = () => { setXFormMode("insert"); setXF(emptyForm()); setXInnerTab("cadastro"); };
  const handleEditar = () => { if (!XCurrentRecord) return; setXFormMode("edit"); setXInnerTab("cadastro"); };

  const handleSalvar = async () => {
    if (!XF.descricao.trim()) { toast.error("A descrição é obrigatória."); return; }

    const payload: any = {
      empresa_id: XEmpresaId,
      descricao: XF.descricao.trim(),
      tp_doc: XF.tp_doc || "",
    };
    PRAZO_KEYS.forEach(k => (payload[k] = parseInt(XF[k]) || 0));

    if (XFormMode === "insert") {
      const { error } = await db.from("condicao_pagamento").insert(payload);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Condição incluída com sucesso.");
    } else if (XCurrentRecord) {
      const { error } = await db.from("condicao_pagamento").update({ ...payload, dt_alteracao: new Date().toISOString() }).eq("condicao_id", XCurrentRecord.condicao_id);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Condição alterada com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  };

  const handleCancelar = () => setXFormMode("view");

  const handleExcluir = async () => {
    if (!XCurrentRecord) return;
    if (!confirm(`Deseja realmente excluir "${XCurrentRecord.descricao}"?`)) return;
    await db.from("condicao_pagamento").update({ excluido: true }).eq("condicao_id", XCurrentRecord.condicao_id);
    toast.success("Condição excluída.");
    await loadData();
    if (XCurrentIdx > 0) setXCurrentIdx(XCurrentIdx - 1);
  };

  const handleSair = () => { const t = XTabs.find(t => t.id === XActiveTabId); if (t) closeTab(t.id); };

  const XFilteredData = useMemo(() => {
    return XData.filter(r => {
      for (const col of XLocalizarColumns) {
        const f = XSearchFilters[col.key] || "";
        if (f && !String((r as any)[col.key] ?? "").toLowerCase().includes(f.toLowerCase())) return false;
      }
      return true;
    });
  }, [XData, XSearchFilters]);

  const handleSelectFromSearch = (row: any) => {
    const idx = XData.findIndex(r => r.condicao_id === row.condicao_id);
    if (idx >= 0) { setXCurrentIdx(idx); setXInnerTab("cadastro"); setXFormMode("view"); }
  };

  const renderPrazoField = (label: string, key: string) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {XIsEditing ? (
        <input type="number" value={XF[key] || "0"} onChange={e => set(key, e.target.value)}
          className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none text-right" />
      ) : (
        <input type="text" value={(XCurrentRecord as any)?.[key] ?? 0} readOnly
          className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card" data-form-container>
      <FormToolbar
        XIsEditing={XIsEditing} XHasRecord={!!XCurrentRecord}
        XIsFirst={XCurrentIdx === 0} XIsLast={XCurrentIdx >= XData.length - 1}
        onIncluir={handleIncluir} onEditar={handleEditar} onSalvar={handleSalvar}
        onCancelar={handleCancelar} onExcluir={handleExcluir}
        onFirst={() => setXCurrentIdx(0)} onPrev={() => setXCurrentIdx(Math.max(0, XCurrentIdx - 1))}
        onNext={() => setXCurrentIdx(Math.min(XData.length - 1, XCurrentIdx + 1))}
        onLast={() => setXCurrentIdx(XData.length - 1)}
        onRefresh={async () => { await loadData(); toast.info("Dados recarregados."); }}
        onLocalizar={() => setXInnerTab("localizar")} onSair={handleSair}
      />

      <div className="flex border-b border-border bg-card">
        {(["cadastro", "localizar"] as const).map(t => (
          <button key={t} className={`px-4 py-1.5 text-sm font-medium border-b-2 ${XInnerTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setXInnerTab(t)}>
            {t === "cadastro" ? "Cadastro" : "Localizar"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {XInnerTab === "cadastro" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:flex md:gap-4 gap-3">
              <div className="w-full md:w-32">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Código</label>
                <input type="text" value={XFormMode === "insert" ? "(Novo)" : XCurrentRecord?.condicao_id ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Descrição <span className="text-destructive">*</span></label>
                {XIsEditing ? (
                  <input type="text" value={XF.descricao} onChange={e => set("descricao", e.target.value.toUpperCase())} autoFocus className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none" />
                ) : (
                  <input type="text" value={XCurrentRecord?.descricao ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Tipo Documento</label>
                {XIsEditing ? (
                  <Select value={XF.tp_doc || "__none__"} onValueChange={v => set("tp_doc", v === "__none__" ? "" : v)}>
                    <SelectTrigger className="h-[34px] text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TP_DOC_OPTIONS.map(o => <SelectItem key={o.v || "__none__"} value={o.v || "__none__"}>{o.l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <input type="text" value={TP_DOC_OPTIONS.find(o => o.v === XCurrentRecord?.tp_doc)?.l || XCurrentRecord?.tp_doc || ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Prazos (dias)</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {PRAZO_KEYS.map((k, i) => renderPrazoField(`${i + 1}ª Parcela`, k))}
              </div>
            </div>
          </div>
        ) : (
          <DataGrid columns={XLocalizarColumns} data={XFilteredData} showFilters filterValues={XSearchFilters}
            onFilterChange={(key, value) => setXSearchFilters(prev => ({ ...prev, [key]: value }))}
            onRowDoubleClick={handleSelectFromSearch} maxHeight="400px" exportTitle="Condições de Pagamento" />
        )}
      </div>
    </div>
  );
};

export default CondicaoPagamentoForm;
