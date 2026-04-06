import React, { useState, useCallback, useEffect } from "react";
import {
  Plus, Save, Pencil, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  Trash2, RefreshCw, List, HelpCircle, LogOut, Search
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { dataStore, IGrupo } from "@/data/store";
import SubgrupoGrid from "./SubgrupoGrid";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { toast } from "sonner";

const XLocalizarColumns: IGridColumn[] = [
  { key: "GRUPO_ID", label: "Código", width: "80px", align: "right" },
  { key: "NM_GRUPO", label: "Nome", width: "1fr" },
];

type TFormMode = "view" | "edit" | "insert";

const GrupoProdutosForm: React.FC = () => {
  const { XEmpresaId, XEmpresaMatrizId, XEmpresas, closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XGrupos, setXGrupos] = useState<IGrupo[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XNmGrupoEdit, setXNmGrupoEdit] = useState("");
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const loadData = useCallback(() => {
    const XData = dataStore.getGrupos(XEmpresaId);
    setXGrupos(XData);
    if (XData.length > 0 && XCurrentIdx >= XData.length) {
      setXCurrentIdx(XData.length - 1);
    }
  }, [XEmpresaId, XCurrentIdx]);

  useEffect(() => {
    loadData();
    setXCurrentIdx(0);
    setXFormMode("view");
  }, [XEmpresaId]);

  const XCurrentGrupo = XGrupos[XCurrentIdx] || null;

  useEffect(() => {
    if (XCurrentGrupo && XFormMode === "edit") {
      setXNmGrupoEdit(XCurrentGrupo.NM_GRUPO);
    }
  }, [XCurrentGrupo, XFormMode]);

  const handleIncluir = () => {
    setXFormMode("insert");
    setXNmGrupoEdit("");
    setXInnerTab("cadastro");
  };

  const handleEditar = () => {
    if (!XCurrentGrupo) return;
    setXFormMode("edit");
    setXNmGrupoEdit(XCurrentGrupo.NM_GRUPO);
    setXInnerTab("cadastro");
  };

  const handleSalvar = () => {
    if (!XNmGrupoEdit.trim()) {
      toast.error("O nome do grupo é obrigatório.");
      return;
    }
    if (XFormMode === "insert") {
      const XNew = dataStore.addGrupo(XEmpresaId, XNmGrupoEdit.trim());
      toast.success(`Grupo ${XNew.GRUPO_ID} incluído com sucesso.`);
    } else if (XFormMode === "edit" && XCurrentGrupo) {
      dataStore.updateGrupo(XEmpresaId, XCurrentGrupo.GRUPO_ID, XNmGrupoEdit.trim());
      toast.success("Grupo alterado com sucesso.");
    }
    setXFormMode("view");
    loadData();
  };

  const handleCancelar = () => {
    setXFormMode("view");
  };

  const handleExcluir = () => {
    if (!XCurrentGrupo) return;
    if (confirm(`Deseja realmente excluir o grupo "${XCurrentGrupo.NM_GRUPO}"?`)) {
      dataStore.deleteGrupo(XEmpresaId, XCurrentGrupo.GRUPO_ID);
      toast.success("Grupo excluído com sucesso.");
      loadData();
      if (XCurrentIdx > 0) setXCurrentIdx(XCurrentIdx - 1);
    }
  };

  const handleFirst = () => setXCurrentIdx(0);
  const handlePrev = () => setXCurrentIdx(Math.max(0, XCurrentIdx - 1));
  const handleNext = () => setXCurrentIdx(Math.min(XGrupos.length - 1, XCurrentIdx + 1));
  const handleLast = () => setXCurrentIdx(XGrupos.length - 1);

  const handleRefresh = () => {
    loadData();
    toast.info("Dados recarregados.");
  };

  const handleSair = () => {
    const XTab = XTabs.find(t => t.id === XActiveTabId);
    if (XTab) closeTab(XTab.id);
  };

  // Localizar tab - filtered data
  const XFilteredGrupos = XGrupos.filter(g => {
    const fc = XSearchFilters["GRUPO_ID"] || "";
    const fn = XSearchFilters["NM_GRUPO"] || "";
    if (fc && !String(g.GRUPO_ID).includes(fc)) return false;
    if (fn && !g.NM_GRUPO.toLowerCase().includes(fn.toLowerCase())) return false;
    return true;
  });

  const handleSelectFromSearch = (XGrupo: IGrupo) => {
    const XIdx = XGrupos.findIndex(g => g.GRUPO_ID === XGrupo.GRUPO_ID);
    if (XIdx >= 0) {
      setXCurrentIdx(XIdx);
      setXInnerTab("cadastro");
      setXFormMode("view");
    }
  };

  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  return (
    <div className="flex flex-col h-full bg-card" data-form-container>
      {/* Main Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-card flex-wrap">
        {!XIsEditing ? (
          <>
            <ToolbarBtn icon={<Plus size={16} />} label="Incluir" onClick={handleIncluir} color="success" />
            <ToolbarBtn icon={<Pencil size={16} />} label="Editar" onClick={handleEditar} disabled={!XCurrentGrupo} />
            <ToolbarSep />
            <ToolbarBtn icon={<ChevronsLeft size={16} />} label="Primeiro" onClick={handleFirst} disabled={XCurrentIdx === 0} />
            <ToolbarBtn icon={<ChevronLeft size={16} />} label="Anterior" onClick={handlePrev} disabled={XCurrentIdx === 0} />
            <ToolbarBtn icon={<ChevronRight size={16} />} label="Próximo" onClick={handleNext} disabled={XCurrentIdx >= XGrupos.length - 1} />
            <ToolbarBtn icon={<ChevronsRight size={16} />} label="Último" onClick={handleLast} disabled={XCurrentIdx >= XGrupos.length - 1} />
            <ToolbarSep />
            <ToolbarBtn icon={<Trash2 size={16} />} label="Excluir" onClick={handleExcluir} disabled={!XCurrentGrupo} color="destructive" />
            <ToolbarBtn icon={<RefreshCw size={16} />} label="Recarregar" onClick={handleRefresh} />
            <ToolbarBtn icon={<Search size={16} />} label="Localizar" onClick={() => setXInnerTab("localizar")} />
            <ToolbarBtn icon={<List size={16} />} label="Log" onClick={() => toast.info("Log de operações")} />
            <ToolbarBtn icon={<HelpCircle size={16} />} label="Ajuda" onClick={() => toast.info("Ajuda do formulário")} />
            <ToolbarBtn icon={<LogOut size={16} />} label="Sair" onClick={handleSair} />
          </>
        ) : (
          <>
            <ToolbarBtn
              icon={<Save size={16} />}
              label="Salvar"
              onClick={handleSalvar}
              color="success"
            />
            <ToolbarBtn
              icon={<LogOut size={16} />}
              label="Cancelar"
              onClick={handleCancelar}
              color="destructive"
            />
          </>
        )}
      </div>

      {/* Inner tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          className={`px-4 py-1.5 text-sm font-medium border-b-2 ${
            XInnerTab === "cadastro"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setXInnerTab("cadastro")}
        >
          Cadastro
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium border-b-2 ${
            XInnerTab === "localizar"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setXInnerTab("localizar")}
        >
          Localizar
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-4">
        {XInnerTab === "cadastro" ? (
          <div className="space-y-4">
            {/* Empresa field */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Empresa</label>
              <input
                type="text"
                value={XEmpresaNome}
                readOnly
                className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary"
              />
            </div>

            {/* Código + Nome */}
            <div className="grid grid-cols-1 md:flex md:gap-4 gap-3">
              <div className="w-full md:w-32">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Código</label>
                <input
                  type="text"
                  value={XFormMode === "insert" ? "(Novo)" : XCurrentGrupo?.GRUPO_ID ?? ""}
                  readOnly
                  className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nome <span className="text-destructive">*</span>
                </label>
                {XIsEditing ? (
                  <input
                    type="text"
                    value={XNmGrupoEdit}
                    onChange={(e) => setXNmGrupoEdit(e.target.value)}
                    className="w-full border border-border rounded px-3 py-1.5 text-sm bg-card focus:ring-2 focus:ring-ring outline-none"
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={XCurrentGrupo?.NM_GRUPO ?? ""}
                    readOnly
                    className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary"
                  />
                )}
              </div>
            </div>

            {/* Subgrupo grid */}
            {XCurrentGrupo && (
              <SubgrupoGrid
                XEmpresaId={XEmpresaId}
                XGrupoId={XCurrentGrupo.GRUPO_ID}
              />
            )}
          </div>
        ) : (
          /* Localizar tab - search grid */
          <DataGrid
            columns={XLocalizarColumns}
            data={XFilteredGrupos}
            showFilters
            filterValues={XSearchFilters}
            onFilterChange={(key, value) => setXSearchFilters(prev => ({ ...prev, [key]: value }))}
            onRowDoubleClick={(row) => handleSelectFromSearch(row as IGrupo)}
            maxHeight="400px"
            exportTitle="Grupos de Produtos"
          />
        )}
      </div>
    </div>
  );
};

// Toolbar button component
const ToolbarBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color?: "success" | "destructive" | "default";
}> = ({ icon, label, onClick, disabled, color = "default" }) => {
  const XColorClass =
    color === "success" ? "text-success hover:bg-success/10" :
    color === "destructive" ? "text-destructive hover:bg-destructive/10" :
    "text-foreground hover:bg-accent";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`p-1.5 rounded transition-colors ${XColorClass} ${
        disabled ? "opacity-30 cursor-not-allowed" : ""
      }`}
    >
      {icon}
    </button>
  );
};

const ToolbarSep = () => <div className="w-px h-5 bg-border mx-0.5" />;

export default GrupoProdutosForm;
