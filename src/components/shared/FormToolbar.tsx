import React, { useCallback, useEffect } from "react";
import {
  Plus, Save, SquarePen, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  Trash2, RefreshCw, Search, List, HelpCircle, LogOut, Mic, MicOff, X
} from "lucide-react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export type TFormMode = "view" | "edit" | "insert";

export const ToolbarBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color?: "success" | "destructive" | "default" | "voice";
}> = ({ icon, label, onClick, disabled, color = "default" }) => {
  const XColorClass =
    color === "success" ? "text-success hover:bg-success/10" :
    color === "destructive" ? "text-destructive hover:bg-destructive/10" :
    color === "voice" ? "text-destructive bg-destructive/10 animate-pulse" :
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

export const ToolbarSep = () => <div className="w-px h-5 bg-border mx-0.5" />;

interface FormToolbarProps {
  XIsEditing: boolean;
  XHasRecord: boolean;
  XIsFirst: boolean;
  XIsLast: boolean;
  onIncluir: () => void;
  onEditar: () => void;
  onSalvar: () => void;
  onCancelar: () => void;
  onExcluir: () => void;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onRefresh: () => void;
  onLocalizar: () => void;
  onSair: () => void;
}

const FormToolbar: React.FC<FormToolbarProps> = ({
  XIsEditing, XHasRecord, XIsFirst, XIsLast,
  onIncluir, onEditar, onSalvar, onCancelar, onExcluir,
  onFirst, onPrev, onNext, onLast, onRefresh, onLocalizar, onSair,
}) => {
  const handleVoiceResult = useCallback((transcript: string) => {
    const el = document.activeElement as HTMLInputElement;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && !el.readOnly) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(el, transcript);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }, []);

  const { isListening, isSupported, toggle: toggleVoice, stop: stopVoice } = useSpeechRecognition({
    continuous: true,
    autoRestart: true,
    onResult: handleVoiceResult,
  });

  // Stop voice when leaving edit mode
  useEffect(() => {
    if (!XIsEditing && isListening) stopVoice();
  }, [XIsEditing, isListening, stopVoice]);

  // Enter moves to next editable field while voice is active
  useEffect(() => {
    if (!isListening) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const el = document.activeElement as HTMLElement;
        const container = el?.closest("[data-form-container]") || document;
        const inputs = Array.from(
          container.querySelectorAll(
            "input:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled]), select:not([disabled])"
          )
        );
        const idx = inputs.indexOf(el);
        if (idx >= 0 && idx < inputs.length - 1) {
          (inputs[idx + 1] as HTMLElement).focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isListening]);

  const XVoiceButton = isSupported ? (
    <ToolbarBtn
      icon={isListening ? <MicOff size={16} /> : <Mic size={16} />}
      label={isListening ? "Parar voz" : "Preencher por voz"}
      onClick={toggleVoice}
      color={isListening ? "voice" : "default"}
    />
  ) : null;

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-card flex-wrap">
      {!XIsEditing ? (
        <>
          <ToolbarBtn icon={<Plus size={16} />} label="Incluir" onClick={onIncluir} color="success" />
          <ToolbarBtn icon={<SquarePen size={16} />} label="Editar" onClick={onEditar} disabled={!XHasRecord} />
          <ToolbarSep />
          <ToolbarBtn icon={<ChevronsLeft size={16} />} label="Primeiro" onClick={onFirst} disabled={XIsFirst} />
          <ToolbarBtn icon={<ChevronLeft size={16} />} label="Anterior" onClick={onPrev} disabled={XIsFirst} />
          <ToolbarBtn icon={<ChevronRight size={16} />} label="Próximo" onClick={onNext} disabled={XIsLast} />
          <ToolbarBtn icon={<ChevronsRight size={16} />} label="Último" onClick={onLast} disabled={XIsLast} />
          <ToolbarSep />
          <ToolbarBtn icon={<Trash2 size={16} />} label="Excluir" onClick={onExcluir} disabled={!XHasRecord} color="destructive" />
          <ToolbarBtn icon={<RefreshCw size={16} />} label="Recarregar" onClick={onRefresh} />
          <ToolbarBtn icon={<Search size={16} />} label="Localizar" onClick={onLocalizar} />
          <ToolbarBtn icon={<List size={16} />} label="Log" onClick={() => toast.info("Log de operações")} />
          <ToolbarBtn icon={<HelpCircle size={16} />} label="Ajuda" onClick={() => toast.info("Ajuda do formulário")} />
          <ToolbarBtn icon={<LogOut size={16} />} label="Sair" onClick={onSair} />
        </>
      ) : (
        <>
          <ToolbarBtn icon={<Save size={16} />} label="Salvar" onClick={onSalvar} color="success" />
          {XVoiceButton}
          <ToolbarSep />
          <ToolbarBtn icon={<X size={16} />} label="Cancelar" onClick={onCancelar} color="destructive" />
        </>
      )}
    </div>
  );
};

export default FormToolbar;
