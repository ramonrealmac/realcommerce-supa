import React from "react";
import { Plus, SquarePen, Trash2, RefreshCw, Filter, LucideIcon } from "lucide-react";

/**
 * Botão de ação padrão para toolbar de DataGrid (estilo ghost com cores semânticas).
 * Padrão visual oficial dos grids editáveis do sistema.
 */
export interface IGridActionBtn {
  icon: React.ReactNode;
  label: string;          // tooltip
  onClick?: () => void;
  disabled?: boolean;
  /** Cor do ícone: success (verde, p/ Incluir), destructive (vermelho, p/ Excluir),
   *  primary (azul, opcional), default (neutro). */
  variant?: "default" | "success" | "destructive" | "primary";
  active?: boolean;       // estado "pressionado" (ex: filtro ligado)
}

const GridIconBtn: React.FC<IGridActionBtn> = ({ icon, label, onClick, disabled, variant = "default", active }) => {
  const colorCls =
    variant === "success" ? "text-success hover:bg-success/10" :
    variant === "destructive" ? "text-destructive hover:bg-destructive/10" :
    variant === "primary" ? "text-primary hover:bg-primary/10" :
    "hover:bg-accent";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded transition-colors ${colorCls} ${active ? "bg-accent ring-1 ring-border" : ""} ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {icon}
    </button>
  );
};

export const GridSeparator: React.FC = () => (
  <div className="w-px h-5 bg-border mx-0.5" />
);

interface IGridActionToolbarProps {
  /** Ações principais (Incluir/Alterar/Excluir + extras). Use null para inserir um separador. */
  actions: (IGridActionBtn | null)[];
  /** Texto de contagem à direita (ex: "12 item(ns)"). */
  count?: string;
  /** Conteúdo extra à esquerda do contador (ex: filtros customizados). */
  extras?: React.ReactNode;
}

/**
 * Toolbar padronizada para grids editáveis (Itens, Pagamento, Subgrupo, Veículo, etc.).
 * Use no prop `toolbarLeft` do DataGrid e mantenha `showRecordCount={false}`.
 */
const GridActionToolbar: React.FC<IGridActionToolbarProps> = ({ actions, count, extras }) => {
  return (
    <>
      {actions.map((a, i) =>
        a === null
          ? <GridSeparator key={`sep-${i}`} />
          : <GridIconBtn key={`btn-${i}-${a.label}`} {...a} />
      )}
      {extras}
      {count !== undefined && (
        <>
          <GridSeparator />
          <span className="text-xs text-muted-foreground px-1">{count}</span>
        </>
      )}
    </>
  );
};

/** Helpers para montar rapidamente as ações mais comuns no padrão. */
export const gridActions = {
  incluir: (onClick: () => void, disabled = false): IGridActionBtn =>
    ({ icon: <Plus size={16} />, label: "Incluir", onClick, disabled, variant: "success" }),
  alterar: (onClick: () => void, disabled = false): IGridActionBtn =>
    ({ icon: <SquarePen size={16} />, label: "Alterar", onClick, disabled }),
  excluir: (onClick: () => void, disabled = false): IGridActionBtn =>
    ({ icon: <Trash2 size={16} />, label: "Excluir", onClick, disabled, variant: "destructive" }),
  atualizar: (onClick: () => void): IGridActionBtn =>
    ({ icon: <RefreshCw size={16} />, label: "Atualizar", onClick }),
  filtro: (onClick: () => void, active = false): IGridActionBtn =>
    ({ icon: <Filter size={16} />, label: "Filtrar", onClick, active }),
  custom: (icon: LucideIcon, label: string, onClick: () => void, opts: Partial<IGridActionBtn> = {}): IGridActionBtn => {
    const Ico = icon;
    return { icon: <Ico size={16} />, label, onClick, ...opts };
  },
};

export default GridActionToolbar;
