import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormToolbar from "@/components/shared/FormToolbar";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const db = supabase as any;

type TFormMode = "view" | "edit" | "insert";

interface ICidade {
  cidade_id: number;
  descricao: string;
  uf: string | null;
  cd_ibge: string | null;
  dt_cadastro: string | null;
  dt_alteracao: string | null;
}

const XLocalizarColumns: IGridColumn[] = [
  { key: "cidade_id", label: "Código", width: "80px", align: "right" },
  { key: "descricao", label: "Descrição", width: "1fr" },
  { key: "uf", label: "UF", width: "80px" },
  { key: "cd_ibge", label: "Cód. IBGE", width: "120px" },
];

const UF_OPTIONS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const CidadeForm: React.FC = () => {
  const { closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XData, setXData] = useState<ICidade[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XF, setXF] = useState({ descricao: "", uf: "PR", cd_ibge: "" });
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const XCurrentRecord = XData[XCurrentIdx] || null;
  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  const set = useCallback((key: string, val: string) => setXF(prev => ({ ...prev, [key]: val })), []);

  const loadData = useCallback(async () => {
    const { data } = await db
      .from("cidade")
      .select("*")
      .eq("excluido_visivel", false)
      .order("cidade_id");
    setXData(data || []);
  }, []);

  useEffect(() => { loadData(); setXCurrentIdx(0); setXFormMode("view"); }, []);

  useEffect(() => {
    if (XCurrentRecord && XFormMode === "edit") {
      setXF({ descricao: XCurrentRecord.descricao || "", uf: XCurrentRecord.uf || "PR", cd_ibge: XCurrentRecord.cd_ibge || "" });
    }
  }, [XCurrentRecord, XFormMode]);

  const handleIncluir = () => { setXFormMode("insert"); setXF({ descricao: "", uf: "PR", cd_ibge: "" }); setXInnerTab("cadastro"); };
  const handleEditar = () => { if (!XCurrentRecord) return; setXFormMode("edit"); setXInnerTab("cadastro"); };

  const handleSalvar = async () => {
    if (!XF.descricao.trim()) { toast.error("A descrição é obrigatória."); return; }
    const payload = { descricao: XF.descricao.trim(), uf: XF.uf || "PR", cd_ibge: XF.cd_ibge.trim() || null };

    if (XFormMode === "insert") {
      const { error } = await db.from("cidade").insert(payload);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Cidade incluída com sucesso.");
    } else if (XCurrentRecord) {
      const { error } = await db.from("cidade").update({ ...payload, dt_alteracao: new Date().toISOString() }).eq("cidade_id", XCurrentRecord.cidade_id);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Cidade alterada com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  };

  const handleCancelar = () => setXFormMode("view");

  const handleExcluir = async () => {
    if (!XCurrentRecord) return;
    if (!confirm(`Deseja realmente excluir "${XCurrentRecord.descricao}"?`)) return;
    await db.from("cidade").update({ excluido_visivel: true }).eq("cidade_id", XCurrentRecord.cidade_id);
    toast.success("Cidade excluída.");
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
    const idx = XData.findIndex(r => r.cidade_id === row.cidade_id);
    if (idx >= 0) { setXCurrentIdx(idx); setXInnerTab("cadastro"); setXFormMode("view"); }
  };

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
                <input type="text" value={XFormMode === "insert" ? "(Novo)" : XCurrentRecord?.cidade_id ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Descrição <span className="text-destructive">*</span></label>
                {XIsEditing ? (
                  <input type="text" value={XF.descricao} onChange={e => set("descricao", e.target.value.toUpperCase())} autoFocus className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none" />
                ) : (
                  <input type="text" value={XCurrentRecord?.descricao ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
              <div className="w-full md:w-32">
                <label className="block text-xs font-medium text-muted-foreground mb-1">UF</label>
                {XIsEditing ? (
                  <Select value={XF.uf || "PR"} onValueChange={v => set("uf", v)}>
                    <SelectTrigger className="h-[34px] text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UF_OPTIONS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <input type="text" value={XCurrentRecord?.uf ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
              <div className="w-full md:w-40">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Cód. IBGE</label>
                {XIsEditing ? (
                  <input type="text" value={XF.cd_ibge} onChange={e => set("cd_ibge", e.target.value)} className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none" />
                ) : (
                  <input type="text" value={XCurrentRecord?.cd_ibge ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <DataGrid columns={XLocalizarColumns} data={XFilteredData} showFilters filterValues={XSearchFilters}
            onFilterChange={(key, value) => setXSearchFilters(prev => ({ ...prev, [key]: value }))}
            onRowDoubleClick={handleSelectFromSearch} maxHeight="400px" exportTitle="Cidades" />
        )}
      </div>
    </div>
  );
};

export default CidadeForm;
