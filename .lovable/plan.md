

## Correções no Formulário de Pedidos

### 1. Carregamento de produtos no item do pedido

**Problema**: `PedidoItensTab` consulta `produto.cd_produto` e `produto.vl_venda` — colunas que **não existem**. As corretas são `nome` e `preco_venda`. Por isso o `<select>` vem vazio.

**Correção**:
- Trocar o `select` da query por: `produto_id, nome, preco_venda, unidade_id`.
- Usar a mesma regra de filtragem do formulário **Meus Estoques (`EstoqueForm`)**:
  - Considerar todas as empresas do grupo (`empresa_matriz_id === XEmpresaMatrizId` ou `empresa_id === XEmpresaMatrizId`) → `XGroupEmpresaIds`.
  - Produtos: `.in("empresa_id", XGroupEmpresaIds)` (hoje filtra só pela matriz).
  - Depósitos: já filtrados — manter, mas reaproveitar os ids para somar estoque do grupo.
- Ajustar mapeamento de campos no `setProduto`: usar `p.nome` em `nm_produto` e `p.preco_venda` em `vl_und_produto`. Manter `cd_produto = String(p.produto_id)` (banco não tem código separado).

### 2. Pesquisa de produto (substituir `<select>`)

Criar `src/components/forms/pedido/ProdutoSearchDialog.tsx`, espelhando `ClienteSearchDialog`:

- Campo de busca com debounce 300ms (filtra por `produto_id`, `nome`, `referencia`, `gtin`).
- Resultados (limite 100) carregados via duas queries paralelas:
  1. `produto`: `produto_id, nome, unidade_id, preco_venda` filtrado por grupo de empresas e `excluido=false`.
  2. `estoque`: `produto_id, estoque_disponivel, estoque_reservado` para os mesmos `produto_id`s, restrito aos depósitos visíveis (mesma regra do `EstoqueForm`: depósito da própria empresa **ou** depósito não privado de empresa irmã). Soma por `produto_id`.
- Grade com colunas: **Código** (`produto_id`), **Nome**, **Unidade**, **Preço Venda** (R$), **Estoque Disponível**, **Estoque Reservado**.
- Clique/duplo-clique seleciona e fecha — retorna objeto com produto + somatórios.

No `PedidoItensTab`:
- Substituir o `<select>` de produto por: input read-only com nome + botão lupa (🔎) e botão limpar (×), padrão idêntico ao do cliente.
- Ao selecionar, popular `produto_id`, `nm_produto`, `unidade_id`, `vl_und_produto = preco_venda`, e mostrar os estoques retornados no campo "Estoq. Disp." (atualmente vazio).

### 3. Após salvar o cabeçalho → ir para "Itens do Pedido" em modo de inclusão

**Mudanças em `StandardCrudForm.tsx`**:
- Aceitar nova prop opcional `XOnAfterSave?: (record, mode) => void` que dispara após `ctrl.handleSalvar` concluir com sucesso (envolver em wrapper local).

**Mudanças em `PedidoForm.tsx`**:
- Passar `XOnAfterSave={(rec, mode) => { if (mode === "insert") { setXInnerTab("itens"); setXAutoNovoItem(true); } }}`.
- Como `setXInnerTab` é interno do `StandardCrudForm`, expor também via callback que recebe um objeto `{ setInnerTab }` (o handler retorna a aba alvo). Implementação simples: adicionar prop `XInitialTabAfterInsert` + bandeira `XTriggerNovoItemAfterInsert` no `XExtraTabs` da aba "itens".

**Mudanças em `PedidoItensTab.tsx`**:
- Aceitar prop opcional `autoNovo?: boolean`. Quando `true` e o pedido tem `movimento_id`, chamar `novo()` automaticamente uma vez (efeito com guarda).

### 4. Ajustes técnicos resumidos

| Arquivo | Mudança |
|---|---|
| `src/components/forms/pedido/ProdutoSearchDialog.tsx` | **Novo** — diálogo de busca de produto com estoque agregado |
| `src/components/forms/pedido/PedidoItensTab.tsx` | Corrigir colunas da query, usar grupo de empresas, trocar `<select>` por lupa, exibir estoque, suportar `autoNovo` |
| `src/components/shared/StandardCrudForm.tsx` | Adicionar `XOnAfterSave` + `XInitialTabAfterInsert` |
| `src/components/forms/PedidoForm.tsx` | Após salvar (insert) navegar para aba "Itens do Pedido" e disparar `autoNovo` |

Sem necessidade de alterações no banco — colunas e RLS já existem.

