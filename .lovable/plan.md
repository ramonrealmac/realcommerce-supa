

## Avaliacao das Sugestoes

### 1. `multiEmpresaFilter.ts` — NAO VIAVEL

**Problema**: As tabelas do projeto NAO possuem coluna `empresa_matriz_id`. Apenas a tabela `empresa` tem esse campo. Tabelas como `unidade`, `produto`, `cadastro`, etc. possuem apenas `empresa_id`.

A logica proposta (`empresa_id IS NULL AND empresa_matriz_id = X`) nao funciona porque:
- Nenhuma tabela de dados tem `empresa_matriz_id`
- Dados compartilhados entre filiais ja usam `empresa_id = XEmpresaMatrizId` (o ID da matriz)
- Adicionar `empresa_matriz_id` a todas as tabelas seria uma mudanca massiva e desnecessaria

**Veredicto**: REJEITAR. O padrao atual (filtrar por `XEmpresaMatrizId` para dados compartilhados, `XEmpresaId` para dados da filial) ja esta correto.

### 2. `baseService.ts` — VIAVEL (simplificado)

Um service base para padronizar queries repetitivas (select + eq excluido + order) e valido, mas SEM o filtro multiempresa proposto. Apenas encapsular o padrao existente.

### 3. `useGridFilter.ts` — VIAVEL

Hook para filtro client-side com normalize. Elimina duplicacao de logica de filtro em cada form.

### 4. `DataGridPro.tsx` — REJEITAR

O `DataGrid.tsx` atual ja e SUPERIOR ao proposto:
- Ja tem ordenacao multi-coluna
- Ja tem exportacao (PDF, CSV, Texto)
- Ja tem filtros por coluna
- Ja tem ocultacao de colunas via menu de contexto
- Ja tem render customizado e getValue

O "DataGridPro" proposto e uma versao INFERIOR (tabela HTML basica sem ordenacao, sem exportacao, sem features). Nao ha upgrade aqui.

### 5. Alteracoes no backend (ADD empresa_matriz_id) — REJEITAR

Adicionar `empresa_matriz_id` a todas as tabelas nao traz beneficio. O modelo atual resolve multiempresa pelo campo `empresa_id` que aponta para a matriz quando os dados sao compartilhados.

---

## Plano: Implementar apenas o que agrega valor

### Passo 1: Criar `src/utils/baseService.ts`

Service generico para padronizar operacoes CRUD repetitivas:

```typescript
export const baseService = {
  async listar(table: string, empresaId: number, orderBy: string, selectCols = "*") {
    return (supabase as any).from(table).select(selectCols)
      .eq("empresa_id", empresaId).eq("excluido", false).order(orderBy);
  },
  async excluirLogico(table: string, pkField: string, pkValue: any) {
    return (supabase as any).from(table)
      .update({ excluido: true, dt_alteracao: new Date().toISOString() })
      .eq(pkField, pkValue);
  }
};
```

### Passo 2: Criar `src/hooks/useGridFilter.ts`

Hook reutilizavel para filtro client-side com normalize, eliminando codigo duplicado nos forms.

### Passo 3: Corrigir build error em `ControleAcessoForm.tsx`

O erro TS2345 e causado pelo `{ [XField]: XValue }` com tipo dinamico. Corrigir com cast adequado.

### Passo 4: Refatorar 2-3 forms como exemplo

Aplicar `baseService` e `useGridFilter` em `UnidadeForm`, `LinhaProdutoForm` e `GrupoProdutosForm` como referencia para os demais.

---

### Resumo

| Sugestao | Decisao | Motivo |
|----------|---------|--------|
| multiEmpresaFilter | REJEITAR | Tabelas nao tem empresa_matriz_id, modelo atual funciona |
| baseService | ACEITAR (simplificado) | Reduz duplicacao de queries |
| useGridFilter | ACEITAR | Elimina normalize duplicado nos forms |
| DataGridPro | REJEITAR | DataGrid atual ja e superior |
| ALTER TABLE add empresa_matriz_id | REJEITAR | Mudanca massiva sem beneficio real |
| Fix build error ControleAcessoForm | ACEITAR | Erro de build precisa ser corrigido |

