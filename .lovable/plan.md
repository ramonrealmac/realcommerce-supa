

## Unificação dos campos `empresa_matriz_id` e `empresamatriz_id`

### Diagnóstico

A tabela `empresa` possui dois campos redundantes:
- `empresa_matriz_id` (integer, nullable, sem default)
- `empresamatriz_id` (integer, nullable, sem default)

### Decisão: manter `empresa_matriz_id`

Motivos:
1. Segue a convenção de nomenclatura do projeto (underscores separando nomes compostos)
2. A variável `XEmpresaMatrizId` mapeia naturalmente para `empresa_matriz_id` (camelCase com prefixo X)
3. Já é usada na interface `IEmpresaOption` e nos filtros de `ProdutoForm` e `EstoqueForm`

### Plano de execução

**1. Migração SQL** (migration tool)
```sql
-- Copiar dados de empresamatriz_id para empresa_matriz_id onde empresa_matriz_id é null
UPDATE empresa 
SET empresa_matriz_id = empresamatriz_id 
WHERE empresa_matriz_id IS NULL AND empresamatriz_id IS NOT NULL;

-- Remover a coluna duplicada
ALTER TABLE empresa DROP COLUMN empresamatriz_id;
```

**2. Atualizar `AuthGate.tsx`**
- Remover `empresamatriz_id` do select da query (linha 94)
- Manter apenas `empresa_matriz_id`

**3. Atualizar `EmpresaForm.tsx`**
- Remover `empresamatriz_id` do estado inicial
- Alterar referências de `empresamatriz_id` para `empresa_matriz_id` no select do formulário de Empresa Matriz (linhas ~419-421)

**4. Atualizar `TopBar.tsx`**
- Linha 70: trocar `(emp as any)?.empresamatriz_id` para `emp?.empresa_matriz_id`

**5. Atualizar `Index.tsx`**
- Linha 153: trocar `(empresa as any).empresamatriz_id` para `empresa.empresa_matriz_id`

**6. Manter variáveis inalteradas**
- `XEmpresaId` e `XEmpresaMatrizId` no `AppContext` e em todos os formulários permanecem como estão — já mapeiam bem para `empresa_id` e `empresa_matriz_id`
- A interface `IEmpresaOption` já usa `empresa_matriz_id`, sem alteração necessária

### Impacto
- 5 arquivos editados (AuthGate, EmpresaForm, TopBar, Index, types.ts via migration)
- Nenhuma variável renomeada — zero risco de quebra nos 16 arquivos que usam `XEmpresaMatrizId`
- O `types.ts` será atualizado automaticamente após a migration

