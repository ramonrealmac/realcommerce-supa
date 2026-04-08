import React, { useState, useCallback, useEffect } from "react";
import {
  Plus, Save, Pencil, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  Trash2, RefreshCw, List, HelpCircle, LogOut, Search
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";
import { toast } from "sonner";
import { baseService } from "@/utils/baseService";
import { useGridFilter } from "@/hooks/useGridFilter";

const XLocalizarColumns: IGridColumn[] = [
  { key: "linha_id", label: "Código", width: "80px", align: "right" },
  { key: "nome", label: "Nome", width: "1fr" },
];

type TFormMode = "view" | "edit" | "insert";

interface ILinhaProduto {
  linha_id: number;
  nome: string;
  empresa_id: number;
  excluido: boolean;
}

const LinhaProdutoForm: React.FC = () => {
  const { XEmpresaId, XEmpresaMatrizId, XEmpresas, closeTab, XTabs, XActiveTabId } = useAppContext();

  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XInnerTab, setXInnerTab] = useState<"cadastro" | "localizar">("cadastro");
  const [XData, setXData] = useState<ILinhaProduto[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XNomeEdit, setXNomeEdit] = useState("");
  const [XSearchFilters, setXSearchFilters] = useState<Record<string, string>>({});

  const XCurrentRecord = XData[XCurrentIdx] || null;
  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  const XEmpMatriz = XEmpresas.find(e => e.empresa_id === XEmpresaMatrizId);
  const XEmpMatrizLabel = XEmpMatriz ? `${XEmpMatriz.empresa_id} - ${XEmpMatriz.identificacao}` : String(XEmpresaMatrizId);

  const loadData = useCallback(async () => {
    const { data } = await baseService.listar("linha_produto", XEmpresaMatrizId, "linha_id");
    setXData(data || []);
  }, [XEmpresaMatrizId]);

  useEffect(() => { loadData(); setXCurrentIdx(0); setXFormMode("view"); }, [XEmpresaMatrizId]);

  useEffect(() => {
    if (XCurrentRecord && XFormMode === "edit") {
      setXNomeEdit(XCurrentRecord.nome);
    }
  }, [XCurrentRecord, XFormMode]);

  const handleIncluir = () => { setXFormMode("insert"); setXNomeEdit(""); setXInnerTab("cadastro"); };
  const handleEditar = () => { if (!XCurrentRecord) return; setXFormMode("edit"); setXNomeEdit(XCurrentRecord.nome); setXInnerTab("cadastro"); };

  const handleSalvar = async () => {
    if (!XNomeEdit.trim()) { toast.error("O nome da linha é obrigatório."); return; }
    if (XFormMode === "insert") {
      const { error } = await baseService.inserir("linha_produto", { empresa_id: XEmpresaMatrizId, nome: XNomeEdit.trim() });
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Linha incluída com sucesso.");
    } else if (XCurrentRecord) {
      const { error } = await baseService.atualizar("linha_produto", "linha_id", XCurrentRecord.linha_id, { nome: XNomeEdit.trim(), empresa_id: XEmpresaMatrizId });
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Linha alterada com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  };

  const handleCancelar = () => setXFormMode("view");

  const handleExcluir = async () => {
    if (!XCurrentRecord) return;
    if (confirm(`Deseja realmente excluir a linha "${XCurrentRecord.nome}"?`)) {
      const { error } = await baseService.excluirLogico("linha_produto", "linha_id", XCurrentRecord.linha_id);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Linha excluída com sucesso.");
      await loadData();
      if (XCurrentIdx > 0) setXCurrentIdx(XCurrentIdx - 1);
    }
  };

  const handleFirst = () => setXCurrentIdx(0);
  const handlePrev = () => setXCurrentIdx(Math.max(0, XCurrentIdx - 1));
  const handleNext = () => setXCurrentIdx(Math.min(XData.length - 1, XCurrentIdx + 1));
  const handleLast = () => setXCurrentIdx(XData.length - 1);
  const handleRefresh = () => { loadData(); toast.info("Dados recarregados."); };
  const handleSair = () => { const XTab = XTabs.find(t => t.id === XActiveTabId); if (XTab) closeTab(XTab.id); };

  const XFilteredData = useGridFilter(XData, XSearchFilters);

  const handleSelectFromSearch = (row: ILinhaProduto) => {
    const XIdx = XData.findIndex(r => r.linha_id === row.linha_id);
    if (XIdx >= 0) { setXCurrentIdx(XIdx); setXInnerTab("cadastro"); setXFormMode("view"); }
  };

  return (
    <div className="flex flex-col h-full bg-card" data-form-container>
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-card flex-wrap">
        {!XIsEditing ? (
          <>
            <ToolbarBtn icon={<Plus size={16} />} label="Incluir" onClick={handleIncluir} color="success" />
            <ToolbarBtn icon={<Pencil size={16} />} label="Editar" onClick={handleEditar} disabled={!XCurrentRecord} />
            <ToolbarSep />
            <ToolbarBtn icon={<ChevronsLeft size={16} />} label="Primeiro" onClick={handleFirst} disabled={XCurrentIdx === 0} />
            <ToolbarBtn icon={<ChevronLeft size={16} />} label="Anterior" onClick={handlePrev} disabled={XCurrentIdx === 0} />
            <ToolbarBtn icon={<ChevronRight size={16} />} label="Próximo" onClick={handleNext} disabled={XCurrentIdx >= XData.length - 1} />
            <ToolbarBtn icon={<ChevronsRight size={16} />} label="Último" onClick={handleLast} disabled={XCurrentIdx >= XData.length - 1} />
            <ToolbarSep />
            <ToolbarBtn icon={<Trash2 size={16} />} label="Excluir" onClick={handleExcluir} disabled={!XCurrentRecord} color="destructive" />
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

      <div className="flex border-b border-border bg-card">
        <button className={`px-4 py-1.5 text-sm font-medium border-b-2 ${XInnerTab === "cadastro" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setXInnerTab("cadastro")}>Cadastro</button>
        <button className={`px-4 py-1.5 text-sm font-medium border-b-2 ${XInnerTab === "localizar" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setXInnerTab("localizar")}>Localizar</button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {XInnerTab === "cadastro" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:flex md:gap-4 gap-3">
              <div className="w-full md:w-[13.5rem]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Emp. Matriz</label>
                <input type="text" value={XEmpMatrizLabel} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary" />
              </div>
              <div className="w-full md:w-32">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Código</label>
                <input type="text" value={XFormMode === "insert" ? "(Novo)" : XCurrentRecord?.linha_id ?? ""} readOnly className="w-full border border-border rounded px-3 py-1.5 text-sm bg-secondary text-right" />
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
          </div>
        ) : (
          <DataGrid
            columns={XLocalizarColumns}
            data={XFilteredData}
            showFilters
            filterValues={XSearchFilters}
            onFilterChange={(key, value) => setXSearchFilters(prev => ({ ...prev, [key]: value }))}
            onRowDoubleClick={(row) => handleSelectFromSearch(row as ILinhaProduto)}
            maxHeight="400px"
            exportTitle="Linhas de Produtos"
          />
        )}
      </div>
    </div>
  );
};

const ToolbarBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; color?: "success" | "destructive" | "default"; }> = ({ icon, label, onClick, disabled, color = "default" }) => {
  const XColorClass = color === "success" ? "text-success hover:bg-success/10" : color === "destructive" ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-accent";
  return (
    <button onClick={onClick} disabled={disabled} title={label} className={`p-1.5 rounded transition-colors ${XColorClass} ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}>
      {icon}
    </button>
  );
};

const ToolbarSep = () => <div className="w-px h-5 bg-border mx-0.5" />;

export default LinhaProdutoForm;
