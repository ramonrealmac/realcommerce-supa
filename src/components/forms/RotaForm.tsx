import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormToolbar from "@/components/shared/FormToolbar";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";

const db = supabase as any;

type TFormMode = "view" | "edit" | "insert";

interface IRota {
  rota_id: number;
  nome: string;
  cadastro_id: number | null;
  empresa_id: number;
  dt_cadastro: string | null;
  dt_alteracao: string | null;
}

const XLocalizarColumns: IGridColumn[] = [
  { key: "rota_id", label: "Código", width: "80px", align: "right" },
  { key: "nome", label: "Nome", width: "1fr" },
];

const RotaForm: React.FC = () => {
  const { XEmpresaId, closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XData, setXData] = useState<IRota[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XNomeEdit, setXNomeEdit] = useState("");
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const XCurrentRecord = XData[XCurrentIdx] || null;
  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  const loadData = useCallback(async () => {
    const { data } = await db
      .from("rota")
      .select("*")
      .eq("empresa_id", XEmpresaId)
      .eq("excluido", false)
      .order("rota_id");
    setXData(data || []);
  }, [XEmpresaId]);

  useEffect(() => { loadData(); setXCurrentIdx(0); setXFormMode("view"); }, [XEmpresaId]);

  useEffect(() => {
    if (XCurrentRecord && XFormMode === "edit") {
      setXNomeEdit(XCurrentRecord.nome);
    }
  }, [XCurrentRecord, XFormMode]);

  const handleIncluir = () => { setXFormMode("insert"); setXNomeEdit(""); setXInnerTab("cadastro"); };
  const handleEditar = () => { if (!XCurrentRecord) return; setXFormMode("edit"); setXNomeEdit(XCurrentRecord.nome); setXInnerTab("cadastro"); };

  const handleSalvar = async () => {
    if (!XNomeEdit.trim()) { toast.error("O nome é obrigatório."); return; }

    if (XFormMode === "insert") {
      const { error } = await db.from("rota").insert({ empresa_id: XEmpresaId, nome: XNomeEdit.trim() });
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Rota incluída com sucesso.");
    } else if (XCurrentRecord) {
      const { error } = await db.from("rota").update({ nome: XNomeEdit.trim(), dt_alteracao: new Date().toISOString() }).eq("rota_id", XCurrentRecord.rota_id);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Rota alterada com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  };

  const handleCancelar = () => setXFormMode("view");

  const handleExcluir = async () => {
    if (!XCurrentRecord) return;
    if (!confirm(`Deseja realmente excluir "${XCurrentRecord.nome}"?`)) return;
    await db.from("rota").update({ excluido: true }).eq("rota_id", XCurrentRecord.rota_id);
    toast.success("Rota excluída.");
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
    const idx = XData.findIndex(r => r.rota_id === row.rota_id);
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
                <input type="text" value={XFormMode === "insert" ? "(Novo)" : XCurrentRecord?.rota_id ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nome <span className="text-destructive">*</span></label>
                {XIsEditing ? (
                  <input type="text" value={XNomeEdit} onChange={e => setXNomeEdit(e.target.value.toUpperCase())} autoFocus className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none" />
                ) : (
                  <input type="text" value={XCurrentRecord?.nome ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <DataGrid columns={XLocalizarColumns} data={XFilteredData} showFilters filterValues={XSearchFilters}
            onFilterChange={(key, value) => setXSearchFilters(prev => ({ ...prev, [key]: value }))}
            onRowDoubleClick={handleSelectFromSearch} maxHeight="400px" exportTitle="Rotas" />
        )}
      </div>
    </div>
  );
};

export default RotaForm;
