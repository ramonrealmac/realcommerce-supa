

## Plano: Refatorar formularios do menu Cadastros para usar baseService e useGridFilter

### Formularios a refatorar

Baseado no menu "1. Cadastros", os seguintes forms precisam de refatoracao (excluindo os ja feitos e Cidades):

| Formulario | Arquivo | Escopo empresaId |
|---|---|---|
| Rotas | RotaForm.tsx | XEmpresaId |
| Depositos | DepositoForm.tsx | XEmpresaId |
| Estoque | EstoqueForm.tsx | XEmpresaId |
| Grupos de Parceiros | CadastroGrupoForm.tsx | XEmpresaMatrizId |
| Condicoes de Pagamento | CondicaoPagamentoForm.tsx | XEmpresaId |
| Clientes (CadastroCompleto) | CadastroCompletoForm.tsx | XEmpresaMatrizId |
| Fornecedores/Transportadores | FornecedorTransportadorForm.tsx | Sem alteracao (wrapper) |
| Produtos | ProdutoForm.tsx | XEmpresaMatrizId |

### O que muda em cada form

**Padrao de refatoracao (simples - RotaForm, DepositoForm, CadastroGrupoForm, CondicaoPagamentoForm):**
1. Remover `import { supabase }` e `const db = supabase as any`
2. Adicionar `import { baseService } from "@/utils/baseService"` e `import { useGridFilter } from "@/hooks/useGridFilter"`
3. `loadData`: trocar query manual por `baseService.listar(tabela, empresaId, orderBy)`
4. `handleSalvar` insert: trocar `db.from(...).insert(...)` por `baseService.inserir(tabela, payload)`
5. `handleSalvar` update: trocar `db.from(...).update(...)` por `baseService.atualizar(tabela, pkField, pkValue, payload)`
6. `handleExcluir`: trocar exclusao manual por `baseService.excluirLogico(tabela, pkField, pkValue)`
7. Filtro: trocar `useMemo` manual ou filtro inline por `useGridFilter(XData, XSearchFilters)`
8. Forms com toolbar inline (DepositoForm): trocar por `FormToolbar` ou manter consistente com o padrao do form

**Formularios complexos (CadastroCompletoForm, ProdutoForm, EstoqueForm):**
- Aplicar `useGridFilter` para a aba Localizar
- Substituir queries diretas de CRUD principal por `baseService` onde aplicavel
- Manter queries especializadas (lookups, sub-dados) como estao, pois tem logica especifica (filtros compostos, joins)

### Detalhes tecnicos

**RotaForm.tsx:**
- `loadData`: `baseService.listar("rota", XEmpresaId, "rota_id")`
- Insert/Update/Delete: usar `baseService.inserir`, `baseService.atualizar`, `baseService.excluirLogico`
- Filtro: `useGridFilter(XData, XSearchFilters)`

**DepositoForm.tsx:**
- Mesma refatoracao + trocar toolbar inline por `FormToolbar`
- `loadData`: `baseService.listar("deposito", XEmpresaId, "deposito_id")`

**CadastroGrupoForm.tsx:**
- `loadData`: `baseService.listar("cadastro_grupo", XEmpresaMatrizId, "cadastro_grupo_id")`
- Insert/Update/Delete: usar baseService
- Filtro: `useGridFilter`

**CondicaoPagamentoForm.tsx:**
- `loadData`: `baseService.listar("condicao_pagamento", XEmpresaId, "condicao_id")`
- Insert/Update: usar baseService (payload complexo com prazos, manter logica de montagem)
- Delete: `baseService.excluirLogico`
- Filtro: `useGridFilter`

**EstoqueForm.tsx:**
- Manter queries de lookup (produto, deposito) como estao
- Substituir `db.from("estoque").select(...)` por `baseService.listar`
- Delete: `baseService.excluirLogico`
- Filtro: manter filtro custom pois usa `getValue`/`render` das colunas

**CadastroCompletoForm.tsx:**
- Manter loadData custom (tem filtros dinamicos st_cliente/st_fornecedor/st_transportador com OR)
- Substituir handleExcluir por `baseService.excluirLogico`
- Substituir filtro manual por `useGridFilter`
- Manter lookups como estao

**ProdutoForm.tsx:**
- `loadData`: `baseService.listar("produto", XEmpresaMatrizId, "produto_id")`
- Delete: `baseService.excluirLogico`
- Filtro: `useGridFilter`
- Manter lookups e sub-dados como estao

**FornecedorTransportadorForm.tsx:** Nenhuma alteracao - e wrapper do CadastroCompletoForm.

### Ordem de execucao

1. RotaForm, DepositoForm, CadastroGrupoForm (simples, rapido)
2. CondicaoPagamentoForm (medio - payload complexo)
3. EstoqueForm (medio - filtro custom, toolbar inline)
4. ProdutoForm (complexo - muitos lookups, sub-grids)
5. CadastroCompletoForm (complexo - filtros dinamicos, lookups)

