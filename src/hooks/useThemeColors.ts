import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Converts a hex color (#RRGGBB) to HSL values string "H S% L%"
 */
function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const COLOR_MAP: Record<string, string> = {
  xcor_primaria: "--primary",
  xcor_header: "--topbar",
  xcor_fundo: "--background",
  xcor_fundo_card: "--card",
  xcor_texto_principal: "--foreground",
  xcor_texto_secundario: "--muted-foreground",
  xcor_botao: "--ring",
  xcor_botao_negativo: "--destructive",
  xcor_destaque: "--warning",
  xcor_menu: "--sidebar-primary",
  xcor_link: "--accent",
};

export function useThemeColors() {
  const [XLoaded, setXLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const db = supabase as any;
      const { data } = await db
        .from("parametro")
        .select("*")
        .eq("excluido", false)
        .limit(1)
        .single();

      if (!data) { setXLoaded(true); return; }

      const root = document.documentElement;
      for (const [dbKey, cssVar] of Object.entries(COLOR_MAP)) {
        const hex = data[dbKey];
        if (hex) {
          const hsl = hexToHsl(hex);
          if (hsl) root.style.setProperty(cssVar, hsl);
        }
      }

      // Primary foreground stays white for contrast
      // Also set derived vars
      if (data.xcor_primaria) {
        const hsl = hexToHsl(data.xcor_primaria);
        if (hsl) {
          root.style.setProperty("--primary", hsl);
          root.style.setProperty("--sidebar-primary", hexToHsl(data.xcor_menu || data.xcor_primaria));
          root.style.setProperty("--grid-header", hsl);
          root.style.setProperty("--grid-selected", hsl);
        }
      }

      if (data.xcor_header) {
        root.style.setProperty("--topbar", hexToHsl(data.xcor_header));
      }

      // Custom CSS
      if (data.xcss_customizado) {
        let style = document.getElementById("custom-theme-css");
        if (!style) {
          style = document.createElement("style");
          style.id = "custom-theme-css";
          document.head.appendChild(style);
        }
        style.textContent = data.xcss_customizado;
      }

      setXLoaded(true);
    };

    load();
  }, []);

  return XLoaded;
}
