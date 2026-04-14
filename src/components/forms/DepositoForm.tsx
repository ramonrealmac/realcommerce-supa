import React, { useState, useCallback, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import FormToolbar from "@/components/shared/FormToolbar";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { baseService } from "@/utils/baseService";
import { useGridFilter } from "@/hooks/useGridFilter";

const XLocalizarColumns: IGridColumn[] = [
  { key: "deposito_id", label: "Código", width: "80px", align: "right" },
  { key: "nome", label: "Nome", width: "1fr" },
  { key: "endereco", label: "Endereço", width: "1fr" },
];

type TFormMode = "view" | "edit" | "insert";

interface IDeposito {
  deposito_id: number;
  nome: string;
  endereco: string;
  empresa_id: number;
  excluido: boolean;
  st_privado: boolean;
}

const DepositoForm: React.FC = () => {
  const { XEmpresaId, closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XData, setXData] = useState<IDeposito[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XNomeEdit, setXNomeEdit] = useState("");
  const [XEnderecoEdit, setXEnderecoEdit] = useState("");
  const [XStPrivadoEdit, setXStPrivadoEdit] = useState(true);
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const XCurrentRecord = XData[XCurrentIdx] || null;
  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  const loadData = useCallback(async () => {
    const { data } = await baseService.listar("deposito", XEmpresaId, "deposito_id");
    setXData(data || []);
  }, [XEmpresaId]);

  useEffect(() => { loadData(); setXCurrentIdx(0); setXFormMode("view"); }, [XEmpresaId]);

  useEffect(() => {
    if (XCurrentRecord && XFormMode === "edit") {
      setXNomeEdit(XCurrentRecord.nome);
      setXEnderecoEdit(XCurrentRecord.endereco || "");
      setXStPrivadoEdit(XCurrentRecord.st_privado ?? true);
    }
  }, [XCurrentRecord, XFormMode]);

  const handleIncluir = () => { setXFormMode("insert"); setXNomeEdit(""); setXEnderecoEdit(""); setXStPrivadoEdit(true); setXInnerTab("cadastro"); };
  const handleEditar = () => { if (!XCurrentRecord) return; setXFormMode("edit"); setXInnerTab("cadastro"); };

  const handleSalvar = async () => {
    if (!XNomeEdit.trim()) { toast.error("O nome do depósito é obrigatório."); return; }
    if (XFormMode === "insert") {
      const { error } = await baseService.inserir("deposito", { empresa_id: XEmpresaId, nome: XNomeEdit.trim(), endereco: XEnderecoEdit.trim(), st_privado: XStPrivadoEdit });
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Depósito incluído com sucesso.");
    } else if (XCurrentRecord) {
      const { error } = await baseService.atualizar("deposito", "deposito_id", XCurrentRecord.deposito_id, { nome: XNomeEdit.trim(), endereco: XEnderecoEdit.trim(), st_privado: XStPrivadoEdit });
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Depósito alterado com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  };

  const handleCancelar = () => setXFormMode("view");

  const handleExcluir = async () => {
    if (!XCurrentRecord) return;
    if (!confirm(`Deseja realmente excluir o depósito "${XCurrentRecord.nome}"?`)) return;
    const { error } = await baseService.excluirLogico("deposito", "deposito_id", XCurrentRecord.deposito_id);
    if (error) { toast.error("Erro: " + error.message); return; }
    toast.success("Depósito excluído com sucesso.");
    await loadData();
    if (XCurrentIdx > 0) setXCurrentIdx(XCurrentIdx - 1);
  };

  const handleSair = () => { const XTab = XTabs.find(t => t.id === XActiveTabId); if (XTab) closeTab(XTab.id); };

  const XFilteredData = useGridFilter(XData, XSearchFilters);

  const handleSelectFromSearch = (row: IDeposito) => {
    const XIdx = XData.findIndex(r => r.deposito_id === row.deposito_id);
    if (XIdx >= 0) { setXCurrentIdx(XIdx); setXInnerTab("cadastro"); setXFormMode("view"); }
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
                <input type="text" value={XFormMode === "insert" ? "(Novo)" : XCurrentRecord?.deposito_id ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nome <span className="text-destructive">*</span></label>
                {XIsEditing ? (
                  <input type="text" value={XNomeEdit} onChange={(e) => setXNomeEdit(e.target.value)} className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none" autoFocus />
                ) : (
                  <input type="text" value={XCurrentRecord?.nome ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Endereço</label>
              {XIsEditing ? (
                <input type="text" value={XEnderecoEdit} onChange={(e) => setXEnderecoEdit(e.target.value)} className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none" />
              ) : (
                <input type="text" value={XCurrentRecord?.endereco ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
              )}
            </div>
          </div>
        ) : (
          <DataGrid
            columns={XLocalizarColumns}
            data={XFilteredData}
            showFilters
            filterValues={XSearchFilters}
            onFilterChange={(key, value) => setXSearchFilters(prev => ({ ...prev, [key]: value }))}
            onRowDoubleClick={(row) => handleSelectFromSearch(row as IDeposito)}
            maxHeight="400px"
            exportTitle="Depósitos"
          />
        )}
      </div>
    </div>
  );
};

export default DepositoForm;
