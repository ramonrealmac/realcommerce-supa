

## Ajustes na aba "Itens do Pedido"

### 1. Foco automático após salvar cabeçalho
Garantir que após `insert` do cabeçalho o `PedidoForm` mude para a aba **Itens** e dispare `novo()` na primeira renderização (revisar `XAfterInsertTab` + `autoNovoTrigger`).

### 2. Linha superior do formulário de inclusão (nova ordem)

```text
[Código/EAN] [🔎] [Produto (read-only)] [Und] [Preço Unit] [Qtd] [Subtotal]
```

| Campo | col-span (12) | Observação |
|---|---|---|
| **Código/EAN** | 2 | input editável; ao **blur** busca em `produto.produto_id`, `referencia` ou `gtin` (regra do grupo de empresas). Se achar → preenche tudo. Se não → toast "Produto não encontrado" |
| 🔎 lupa | botão | abre `ProdutoSearchDialog` |
| **Produto** | 4 | nome read-only |
| **Und.** | 1 | mantém |
| **Preço Unit.** | 1 | reduzido ~30%; 2 decimais; sem spin |
| **Qtd.** | 2 | aumentado ~25%; 4 decimais; sem spin |
| **Subtotal** | 1 | reduzido ~50% |

Segunda linha: Desc.(%), Desc.(R$), P/Entrega, **Estoq. Disp.**, **Depósito** (FC removido).

Terceira linha (custos): Vlr.Desp, Vlr.Frete, Vlr.Seg, Vlr.Outros, Total, [Inserir/Cancelar].

**Sem spin** nos number inputs: `[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`.

### 3. Combo de Depósito
Mantém filtro por empresas do grupo + `st_privado=false` para irmãs. **Adiciona** ao lado do nome o estoque disponível **do produto selecionado** naquele depósito (ex.: `1 - Matriz (12,00)`). Para isso, ao selecionar produto, faço uma query `estoque` por `produto_id` nos depósitos visíveis e monto `XDepEstoque: Record<deposito_id, number>`.

### 4. Validação de estoque
Ler `empresa.valida_estoque` (campo recém-criado pelo usuário). Quando indicar "S"/`true`:
- Ao salvar item, comparar `qt_movimento` com `estoque_disponivel` do produto no depósito escolhido. Se ultrapassar → bloquear com toast `"Quantidade (X) excede o estoque disponível (Y) no depósito Z."`.
- Buscar valor uma vez ao montar a aba (cache local).

### 5. Toolbar do grid (botões padrão do projeto)
Substituir os botões soltos por `FormToolbar` com **Novo / Alterar / Excluir / Refresh**, atuando sobre a linha selecionada do grid (selectable). Remover coluna "Ações".

### 6. Colunas do grid (nova ordem e nomes)

| Coluna | Origem | Observação |
|---|---|---|
| **Código** | `cd_produto` ou `produto_id` | NOVO, antes do nome |
| Produto | `nm_produto` | — |
| Qtd. | `qt_movimento` | 4 decimais |
| Vlr. Unit | `vl_und_produto` | 2 decimais |
| **Subtotal** | `vl_produto` | renomeado (era "Vlr. Produto") |
| Desc.(%) | `pc_desconto` | — |
| **Desc.(R$)** | `vl_desconto` | logo após Desc.(%) |
| Vlr. Desp. | `vl_despesa` | NOVO |
| Vlr. Frete | `vl_frete` | NOVO |
| Vlr. Seg. | `vl_seguro` | NOVO |
| Vlr. Outros | `vl_outro` | — |
| **Total** | `vl_movimento` | última coluna |
| ~~Ações~~ | — | removida |

### 7. Painel de Totais — 7 cards horizontais

```text
┌────────┬──────┬─────┬─────┬─────┬───────┬──────┐
│Subtotal│Desc. │Frete│Desp.│Seg. │Outros │Total │
│ R$ X   │ R$ X │R$ X │R$ X │R$ X │ R$ X  │ R$ X │
└────────┴──────┴─────┴─────┴─────┴───────┴──────┘
```

- "Vlr. dos Itens" → **Subtotal**.
- `grid-cols-2 sm:grid-cols-4 lg:grid-cols-7`.
- Label `text-xs uppercase text-muted-foreground`; valor `text-base font-semibold`; **Total** `text-lg font-bold text-primary`.

### Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/components/forms/pedido/PedidoItensTab.tsx` | campo Código/EAN, novo layout, toolbar padrão, colunas reordenadas, totais horizontais, validação de estoque, estoque por depósito no select |
| `src/components/forms/pedido/ProdutoSearchDialog.tsx` | exportar helper `buscarProdutoPorCodigo(termo, ...ctx)` reusado pelo input "Código" |
| `src/components/forms/PedidoForm.tsx` | confirmar disparo do `autoNovoTrigger` após `insert` |

Sem migrações de banco — `empresa.valida_estoque` já foi criado pelo usuário.

