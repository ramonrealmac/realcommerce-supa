import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { rbSubstituirVariaveis } from "../utils/rb_sqlParser";
import type { IRbConexao } from "../models/rb_types";

const db = supabase as any;

/**
 * Executes a raw SQL query via Supabase RPC or REST.
 * Uses the connection's URL/key if provided, otherwise falls back to the main client.
 */
export async function rbExecutarQuery(
  XQuerySql: string,
  XVariaveis: Record<string, string | number | boolean | null>,
  XConexao?: IRbConexao | null
): Promise<{ data: any[]; error: string | null }> {
  const XSqlFinal = rbSubstituirVariaveis(XQuerySql, XVariaveis);
  
  try {
    const XClient = XConexao?.url && XConexao?.api_key
      ? createClient(XConexao.url, XConexao.api_key)
      : supabase;

    // Use PostgREST rpc or direct fetch
    const XResponse = await fetch(
      `${XConexao?.url || "https://zicapdmkddpllxniupgi.supabase.co"}/rest/v1/rpc/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: XConexao?.api_key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppY2FwZG1rZGRwbGx4bml1cGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjE3MTYsImV4cCI6MjA5MDgzNzcxNn0.hqOi69cdFzB_G_JpWS-UvdusCKpeATSMOxci0dEas78",
          Authorization: `Bearer ${XConexao?.api_key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppY2FwZG1rZGRwbGx4bml1cGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjE3MTYsImV4cCI6MjA5MDgzNzcxNn0.hqOi69cdFzB_G_JpWS-UvdusCKpeATSMOxci0dEas78"}`,
        },
      }
    );

    // Fallback: try using the table name from query to do a simple select
    // For now, we'll use a simpler approach - execute via supabase client
    // Parse a simple "SELECT ... FROM table_name ..." pattern
    const XTableMatch = XSqlFinal.match(/FROM\s+(\w+)/i);
    if (!XTableMatch) {
      return { data: [], error: "Não foi possível identificar a tabela na query." };
    }

    const XTableName = XTableMatch[1];
    const XWhereMatch = XSqlFinal.match(/WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)/is);
    
    let XQuery = (XClient as any).from(XTableName).select("*");
    
    // Basic WHERE parsing for simple conditions
    if (XWhereMatch) {
      const XConditions = XWhereMatch[1].trim();
      // For simple "field = value" patterns
      const XSimpleConditions = XConditions.split(/\s+AND\s+/i);
      for (const XCond of XSimpleConditions) {
        const XEqMatch = XCond.trim().match(/^(\w+)\s*=\s*'?([^']*)'?$/);
        if (XEqMatch) {
          XQuery = XQuery.eq(XEqMatch[1], XEqMatch[2]);
        }
      }
    }

    const XOrderMatch = XSqlFinal.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (XOrderMatch) {
      XQuery = XQuery.order(XOrderMatch[1], { ascending: (XOrderMatch[2] || "ASC").toUpperCase() === "ASC" });
    }

    const XLimitMatch = XSqlFinal.match(/LIMIT\s+(\d+)/i);
    if (XLimitMatch) {
      XQuery = XQuery.limit(parseInt(XLimitMatch[1]));
    }

    const { data, error } = await XQuery;
    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (e: any) {
    return { data: [], error: e.message || "Erro ao executar query" };
  }
}
