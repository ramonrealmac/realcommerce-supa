import React, { useState, useCallback, useEffect } from "react";
import { Plus, Pencil, Trash2, RefreshCw, Filter } from "lucide-react";
import { dataStore, ISubgrupo } from "@/data/store";
import { toast } from "sonner";
import DataGrid, { IGridColumn } from "@/components/grid/DataGrid";

interface SubgrupoGridProps {
  XEmpresaId: number;
  XGrupoId: number;
}

const XSubgrupoColumns: IGridColumn[] = [
  {
    key: "CODIGO",
    label: "Código",
    width: "100px",
    align: "right",
    getValue: (row: ISubgrupo & { _grupoId: number }) => `${row._grupoId}.${row.SUBGRUPO_ID}`,
  },
  { key: "NM_SUBGRUPO", label: "Nome", width: "1fr" },
];

const SubgrupoGrid: React.FC<SubgrupoGridProps> = ({ XEmpresaId, XGrupoId }) => {
  const [XSubgrupos, setXSubgrupos] = useState<(ISubgrupo & { _grupoId: number })[]>([]);
  const [XSelectedIdx, setXSelectedIdx] = useState<number | null>(null);
  const [XFilterValues, setXFilterValues] = useState<Record<string, string>>({});
  const [XEditMode, setXEditMode] = useState<"none" | "insert" | "edit">("none");
  const [XEditNome, setXEditNome] = useState("");
  const [XShowFilters, setXShowFilters] = useState(true);

  const loadData = useCallback(() => {
    const XData = dataStore.getSubgrupos(XEmpresaId, XGrupoId).map(s => ({ ...s, _grupoId: XGrupoId }));
    setXSubgrupos(XData);
  }, [XEmpresaId, XGrupoId]);

  useEffect(() => {
    loadData();
    setXSelectedIdx(null);
    setXEditMode("none");
  }, [XEmpresaId, XGrupoId, loadData]);

  const XFiltered = XSubgrupos.filter(s => {
    const fc = XFilterValues["CODIGO"] || "";
    const fn = XFilterValues["NM_SUBGRUPO"] || "";
    if (fc && !`${XGrupoId}.${s.SUBGRUPO_ID}`.includes(fc)) return false;
    if (fn && !s.NM_SUBGRUPO.toLowerCase().includes(fn.toLowerCase())) return false;
    return true;
  });

  const XSelectedSub = XSelectedIdx !== null ? XFiltered[XSelectedIdx] : null;

  const handleIncluir = () => { setXEditMode("insert"); setXEditNome(""); };
  const handleEditar = () => {
    if (!XSelectedSub) return;
    setXEditMode("edit");
    setXEditNome(XSelectedSub.NM_SUBGRUPO);
  };

  const handleSalvar = () => {
    if (!XEditNome.trim()) { toast.error("O nome do subgrupo é obrigatório."); return; }
    if (XEditMode === "insert") {
      dataStore.addSubgrupo(XEmpresaId, XGrupoId, XEditNome.trim());
      toast.success("Subgrupo incluído com sucesso.");
    } else if (XEditMode === "edit" && XSelectedSub) {
      dataStore.updateSubgrupo(XEmpresaId, XGrupoId, XSelectedSub.SUBGRUPO_ID, XEditNome.trim());
      toast.success("Subgrupo alterado com sucesso.");
    }
    setXEditMode("none");
    loadData();
  };

  const handleExcluir = () => {
    if (!XSelectedSub) return;
    if (confirm(`Excluir subgrupo "${XSelectedSub.NM_SUBGRUPO}"?`)) {
      dataStore.deleteSubgrupo(XEmpresaId, XGrupoId, XSelectedSub.SUBGRUPO_ID);
      toast.success("Subgrupo excluído.");
      setXSelectedIdx(null);
      loadData();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setXFilterValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-2">
      {/* Subgroup toolbar */}
      <div className="flex items-center gap-1">
        <GridBtn icon={<Plus size={14} />} label="Incluir" onClick={handleIncluir} color="success" />
        <GridBtn icon={<Pencil size={14} />} label="Alterar" onClick={handleEditar} disabled={!XSelectedSub} color="primary" />
        <GridBtn icon={<Trash2 size={14} />} label="Excluir" onClick={handleExcluir} disabled={!XSelectedSub} color="destructive" />
        <GridBtn icon={<RefreshCw size={14} />} label="Atualizar" onClick={loadData} />
        <GridBtn icon={<Filter size={14} />} label="Filtrar" onClick={() => setXShowFilters(!XShowFilters)} active={XShowFilters} />
      </div>

      {/* Edit row (inline) */}
      {XEditMode !== "none" && (
        <div className="flex items-center gap-2 p-2 bg-accent rounded border border-border">
          <span className="text-xs font-medium text-muted-foreground w-16">
            {XEditMode === "insert" ? "Novo:" : "Editar:"}
          </span>
          <input
            type="text"
            placeholder="Nome do subgrupo"
            value={XEditNome}
            onChange={(e) => setXEditNome(e.target.value)}
            className="flex-1 border border-border rounded px-2 py-1 text-sm bg-card outline-none focus:ring-2 focus:ring-ring"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSalvar();
              if (e.key === "Escape") setXEditMode("none");
            }}
          />
          <button onClick={handleSalvar} className="px-3 py-1 text-xs bg-success text-success-foreground rounded hover:opacity-90">
            Salvar
          </button>
          <button onClick={() => setXEditMode("none")} className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90">
            Cancelar
          </button>
        </div>
      )}

      {/* Grid */}
      <DataGrid
        columns={XSubgrupoColumns}
        data={XFiltered}
        selectedIdx={XSelectedIdx}
        onRowClick={(_row, idx) => setXSelectedIdx(idx)}
        onRowDoubleClick={(_row, idx) => {
          setXSelectedIdx(idx);
          const sub = XFiltered[idx];
          if (sub) { setXEditMode("edit"); setXEditNome(sub.NM_SUBGRUPO); }
        }}
        showFilters={XShowFilters}
        filterValues={XFilterValues}
        onFilterChange={handleFilterChange}
        maxHeight="250px"
        exportTitle="Subgrupos"
      />
    </div>
  );
};

const GridBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
  active?: boolean;
}> = ({ icon, label, onClick, disabled, color = "default", active }) => {
  const XColorMap: Record<string, string> = {
    success: "bg-success text-success-foreground hover:opacity-90",
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    default: `bg-secondary text-secondary-foreground hover:bg-accent ${active ? "ring-2 ring-ring" : ""}`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`p-1.5 rounded transition-colors ${XColorMap[color] || XColorMap.default} ${
        disabled ? "opacity-30 cursor-not-allowed" : ""
      }`}
    >
      {icon}
    </button>
  );
};

export default SubgrupoGrid;
