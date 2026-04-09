import React, { useState, useCallback, useEffect } from "react";
import {
  Plus, Save, Pencil, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  Trash2, RefreshCw, List, HelpCircle, LogOut, Search
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import SubgrupoGrid from "./SubgrupoGrid";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { toast } from "sonner";
import { useGridFilter } from "@/hooks/useGridFilter";

const db = supabase as any;

const XLocalizarColumns: IGridColumn[] = [
  { key: "produto_grupo_id", label: "Código", width: "80px", align: "right" },
  { key: "nome", label: "Nome", width: "1fr" },
];

type TFormMode = "view" | "edit" | "insert";

const GrupoProdutosForm: React.FC = () => {
  const { XEmpresaId, XEmpresaMatrizId, XEmpresas, closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XGrupos, setXGrupos] = useState<any[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XNmGrupoEdit, setXNmGrupoEdit] = useState("");
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    const { data } = await db.from("produto_grupo")
      .select("produto_grupo_id,nome,empresa_id,excluido")
      .eq("empresa_id", XEmpresaMatrizId)
      .eq("excluido", false)
      .order("produto_grupo_id");
    setXGrupos(data || []);
  }, [XEmpresaMatrizId]);

  useEffect(() => {
    loadData();
    setXCurrentIdx(0);
    setXFormMode("view");
  }, [XEmpresaMatrizId]);

  const XCurrentGrupo = XGrupos[XCurrentIdx] || null;

  useEffect(() => {
    if (XCurrentGrupo && XFormMode === "edit") {
      setXNmGrupoEdit(XCurrentGrupo.nome);
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
    setXNmGrupoEdit(XCurrentGrupo.nome);
    setXInnerTab("cadastro");
  };

  const handleSalvar = async () => {
    if (!XNmGrupoEdit.trim()) {
      toast.error("O nome do grupo é obrigatório.");
      return;
    }
    if (XFormMode === "insert") {
      const { error } = await db.from("produto_grupo").insert({
        empresa_id: XEmpresaMatrizId,
        nome: XNmGrupoEdit.trim(),
      });
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Grupo incluído com sucesso.");
    } else if (XFormMode === "edit" && XCurrentGrupo) {
      const { error } = await db.from("produto_grupo").update({
        nome: XNmGrupoEdit.trim(),
        dt_alteracao: new Date().toISOString(),
      }).eq("produto_grupo_id", XCurrentGrupo.produto_grupo_id);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Grupo alterado com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  };

  const handleCancelar = () => {
    setXFormMode("view");
  };

  const handleExcluir = async () => {
    if (!XCurrentGrupo) return;
    if (confirm(`Deseja realmente excluir o grupo "${XCurrentGrupo.nome}"?`)) {
      await db.from("produto_grupo").update({ excluido: true, dt_alteracao: new Date().toISOString() })
        .eq("produto_grupo_id", XCurrentGrupo.produto_grupo_id);
      toast.success("Grupo excluído com sucesso.");
      await loadData();
      if (XCurrentIdx > 0) setXCurrentIdx(XCurrentIdx - 1);
    }
  };

  const handleFirst = () => setXCurrentIdx(0);
  const handlePrev = () => setXCurrentIdx(Math.max(0, XCurrentIdx - 1));
  const handleNext = () => setXCurrentIdx(Math.min(XGrupos.length - 1, XCurrentIdx + 1));
  const handleLast = () => setXCurrentIdx(XGrupos.length - 1);

  const handleRefresh = async () => {
    await loadData();
    toast.info("Dados recarregados.");
  };

  const handleSair = () => {
    const XTab = XTabs.find(t => t.id === XActiveTabId);
    if (XTab) closeTab(XTab.id);
  };

  // Localizar tab - filtered data
  const XFilteredGrupos = useGridFilter(XGrupos, XSearchFilters);

  const handleSelectFromSearch = (XGrupo: any) => {
    const XIdx = XGrupos.findIndex((g: any) => g.produto_grupo_id === XGrupo.produto_grupo_id);
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
            <ToolbarBtn icon={<Save size={16} />} label="Salvar" onClick={handleSalvar} color="success" />
            <ToolbarBtn icon={<LogOut size={16} />} label="Cancelar" onClick={handleCancelar} color="destructive" />
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
            {/* Código + Emp. Matriz + Nome */}
            <div className="grid grid-cols-1 md:flex md:gap-4 gap-3">
              <div className="w-full md:w-32">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Código</label>
                <input type="text" value={XFormMode === "insert" ? "(Novo)" : XCurrentGrupo?.produto_grupo_id ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
              </div>
              <div className="w-full md:w-[13.5rem]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Emp. Matriz</label>
                <input type="text" value={(() => { const em = XEmpresas.find(e => e.empresa_id === XEmpresaMatrizId); return em ? `${em.empresa_id} - ${em.identificacao}` : String(XEmpresaMatrizId); })()} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
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
                    value={XCurrentGrupo?.nome ?? ""}
                    readOnly
                    className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary"
                  />
                )}
              </div>
            </div>

            {/* Subgrupo grid */}
            {XCurrentGrupo && (
              <SubgrupoGrid
                XEmpresaId={XEmpresaMatrizId}
                XGrupoId={XCurrentGrupo.produto_grupo_id}
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
            onRowDoubleClick={(row) => handleSelectFromSearch(row)}
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
