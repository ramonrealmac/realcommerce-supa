import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ZodSchema } from "zod";

const db = supabase as any;

export type TFormMode = "view" | "edit" | "insert";

export interface ICrudConfig<T extends Record<string, any>> {
  XTableName: string;
  XPrimaryKey: keyof T & string;
  XTitle: string;
  XDefaultRecord: Partial<T>;
  XOrderBy?: string;
  XSelectCols?: string;
  XEmpresaId?: number;          // when set, filters/inserts using empresa_id
  XValidator?: ZodSchema<any>;
  XOnBeforeSave?: (rec: Partial<T>, mode: TFormMode) => Partial<T> | Promise<Partial<T>>;
  XOnAfterLoad?: (data: T[]) => void;
  XApplyFilter?: (query: any) => any; // custom filter (e.g. matriz, st_privado)
  XSoftDelete?: boolean;             // default true (uses excluido = true)
}

export function useCrudController<T extends Record<string, any>>(config: ICrudConfig<T>) {
  const [XFormMode, setXFormMode] = useState<TFormMode>("view");
  const [XData, setXData] = useState<T[]>([]);
  const [XCurrentIdx, setXCurrentIdx] = useState(0);
  const [XEditRecord, setXEditRecord] = useState<Partial<T>>(config.XDefaultRecord);
  const [XLoading, setXLoading] = useState(false);

  const XCurrentRecord = (XData[XCurrentIdx] || null) as T | null;
  const XIsEditing = XFormMode === "edit" || XFormMode === "insert";

  const loadData = useCallback(async () => {
    setXLoading(true);
    let q = db.from(config.XTableName).select(config.XSelectCols || "*");
    if (config.XSoftDelete !== false) q = q.eq("excluido", false);
    if (config.XEmpresaId !== undefined) q = q.eq("empresa_id", config.XEmpresaId);
    if (config.XApplyFilter) q = config.XApplyFilter(q);
    q = q.order(config.XOrderBy || config.XPrimaryKey);
    const { data, error } = await q;
    setXLoading(false);
    if (error) { toast.error("Erro ao carregar: " + error.message); return; }
    const list = (data || []) as T[];
    setXData(list);
    config.XOnAfterLoad?.(list);
  }, [config.XTableName, config.XEmpresaId, config.XOrderBy, config.XSelectCols]);

  useEffect(() => {
    loadData();
    setXCurrentIdx(0);
    setXFormMode("view");
  }, [loadData]);

  // Sync edit record when entering edit mode
  useEffect(() => {
    if (XFormMode === "edit" && XCurrentRecord) {
      setXEditRecord({ ...XCurrentRecord });
    } else if (XFormMode === "insert") {
      setXEditRecord({ ...config.XDefaultRecord });
    }
  }, [XFormMode]);

  const handleIncluir = useCallback(() => {
    setXEditRecord({ ...config.XDefaultRecord });
    setXFormMode("insert");
  }, [config.XDefaultRecord]);

  const handleEditar = useCallback(() => {
    if (!XCurrentRecord) return;
    setXEditRecord({ ...XCurrentRecord });
    setXFormMode("edit");
  }, [XCurrentRecord]);

  const handleCancelar = useCallback(() => setXFormMode("view"), []);

  const handleSalvar = useCallback(async () => {
    let payload = { ...XEditRecord };
    if (config.XValidator) {
      const r = config.XValidator.safeParse(payload);
      if (!r.success) { toast.error(r.error.errors[0]?.message || "Dados inválidos."); return; }
    }
    if (config.XOnBeforeSave) {
      try { payload = await config.XOnBeforeSave(payload, XFormMode); }
      catch (e: any) { toast.error(e?.message || "Validação falhou."); return; }
    }
    if (config.XEmpresaId !== undefined && !payload.empresa_id) {
      (payload as any).empresa_id = config.XEmpresaId;
    }

    if (XFormMode === "insert") {
      const { error } = await db.from(config.XTableName).insert(payload);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Registro incluído com sucesso.");
    } else if (XCurrentRecord) {
      const { error } = await db.from(config.XTableName)
        .update({ ...payload, dt_alteracao: new Date().toISOString() })
        .eq(config.XPrimaryKey, XCurrentRecord[config.XPrimaryKey]);
      if (error) { toast.error("Erro: " + error.message); return; }
      toast.success("Registro alterado com sucesso.");
    }
    setXFormMode("view");
    await loadData();
  }, [XEditRecord, XFormMode, XCurrentRecord, config, loadData]);

  const handleExcluir = useCallback(async () => {
    if (!XCurrentRecord) return;
    if (!confirm("Deseja realmente excluir este registro?")) return;
    const { error } = await db.from(config.XTableName)
      .update({ excluido: true, dt_alteracao: new Date().toISOString() })
      .eq(config.XPrimaryKey, XCurrentRecord[config.XPrimaryKey]);
    if (error) { toast.error("Erro: " + error.message); return; }
    toast.success("Registro excluído.");
    await loadData();
    setXCurrentIdx(i => Math.max(0, i - 1));
  }, [XCurrentRecord, config, loadData]);

  const handleFirst = () => setXCurrentIdx(0);
  const handlePrev = () => setXCurrentIdx(i => Math.max(0, i - 1));
  const handleNext = () => setXCurrentIdx(i => Math.min(XData.length - 1, i + 1));
  const handleLast = () => setXCurrentIdx(XData.length - 1);
  const handleRefresh = useCallback(async () => {
    await loadData();
    toast.info("Dados recarregados.");
  }, [loadData]);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setXEditRecord(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    XFormMode,
    XIsEditing,
    XData,
    XCurrentIdx,
    XCurrentRecord,
    XEditRecord,
    XLoading,
    setXEditRecord,
    setXCurrentIdx,
    setField,
    loadData,
    handleIncluir,
    handleEditar,
    handleCancelar,
    handleSalvar,
    handleExcluir,
    handleFirst,
    handlePrev,
    handleNext,
    handleLast,
    handleRefresh,
  };
}
