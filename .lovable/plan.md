

## Ajustes finais — Aba Itens do Pedido + Pesquisa de Produtos

### 1. Foco inteligente após buscar por Código/EAN
No `onBlur` do campo **Código/EAN** em `PedidoItensTab.tsx`:
- Se preenchido **e** produto encontrado → foco vai direto para **Preço Unitário** (`XPrecoUnitRef.current?.focus()` + `select()`).
- Se vazio → foco vai para o **botão da lupa** (`XLupaRef.current?.focus()`).

### 2. Pesquisa de Produto — filtros, zebra, 2ª grade e cores

#### 2.1 Cabeçalho do diálogo
Dois checkboxes alinhados à direita ao lado do título:
```text
Pesquisar Produto                    [ ] Com estoque   [ ] Em promoção
```
- **Com estoque**: filtra `estoque_disponivel > 0` (somando depósitos visíveis).
- **Em promoção**: filtra produtos com `vl_promocao > 0` (ou flag equivalente — verifico em `produto`).

#### 2.2 Grade principal (produtos)
- **Zebra**: linhas alternadas `even:bg-muted/30`.
- **Promoção**: célula de **Preço Venda** com `bg-green-100` quando o produto estiver em promoção.
- **Estoque Disp.**:
  - `bg-green-100` (verde suave) → existe estoque na empresa selecionada (`XEmpresaId`).
  - `bg-yellow-100` (amarelo suave) → estoque existe **somente** em empresas-irmãs do grupo, não na empresa atual.
  - sem cor → sem estoque em lugar algum.
- **Seleção**: `onClick` apenas marca a linha (highlight); **somente `onDoubleClick` retorna o produto**.

#### 2.3 Segunda grade (estoque por depósito do produto selecionado)
- Aparece abaixo da grade principal, altura ~35% da principal, fonte `text-xs`.
- Colunas: `Cód. Dep. | Depósito | Empresa | Estoq. Físico | Reservado | Disponível`.
- Mostra **apenas depósitos onde existe registro `estoque` para o produto selecionado** (regra do usuário: produto 32 só aparece nos dep. 1 e 2, mesmo que dep. 4 seja visível para a empresa).
- Cor de fundo da quantidade `Disponível`:
  - Verde suave → depósito da empresa atual.
  - Amarelo suave → depósito de empresa-irmã visível.
- Duplo clique numa linha do estoque → retorna `{ produto, deposito_id }` para o `PedidoItensTab`, que já preenche o combo de depósito.

### 3. PedidoItensTab — ajustes de layout

#### 3.1 Toolbar do grid
Mover o botão **Exportar** para a mesma linha dos botões `Novo / Alterar / Excluir / Refresh` (atualmente fica numa linha abaixo). `FormToolbar` ganha uma prop `XExtraButtons` com o botão Exportar à direita.

#### 3.2 Alinhamento do Subtotal
No formulário de inclusão de item, o card **Subtotal** passa a alinhar conteúdo `items-end` (valor no rodapé), dando harmonia vertical com os campos vizinhos.

#### 3.3 Campos somente-leitura sem foco
Adicionar `tabIndex={-1}` em todos os inputs `readOnly` (Produto, Subtotal calculado, Estoq. Disp., etc.) para que o `Tab` não pare neles.

#### 3.4 Auto-inserção contínua
Após salvar um item com sucesso (`XSalvarItem`), em vez de só fechar o form de inclusão:
1. Resetar os campos do item.
2. Manter o form aberto em modo "inserção".
3. Focar automaticamente no campo **Código/EAN**.

Isso elimina o clique no botão "Novo Item" entre cada inserção.

### 4. Regra de visibilidade de depósitos no select de Depósito do item
Mesma regra da 2ª grade da pesquisa: o `<select>` de **Depósito** dentro do form do item passa a listar **apenas depósitos onde o produto selecionado tem registro em `estoque`** (não mais todos os depósitos visíveis da empresa). Isso resolve o caso do produto 32 / depósito 4.

### 5. Detalhes técnicos

| Arquivo | Mudanças |
|---|---|
| `src/components/forms/pedido/ProdutoSearchDialog.tsx` | Checkboxes "Com estoque" / "Em promoção" no header; zebra; cores condicionais (promoção verde claro; estoque verde/amarelo); seleção apenas no double-click; nova 2ª grade de estoque por depósito do produto selecionado, com double-click retornando `{produto, deposito_id}`; query auxiliar `buscarEstoquePorDeposito(produto_id)` |
| `src/components/forms/pedido/PedidoItensTab.tsx` | Foco condicional pós-blur do Código/EAN; `tabIndex={-1}` em campos read-only; subtotal `items-end`; após salvar item, manter form aberto em modo inserção e focar Código/EAN; combo de Depósito filtrado pelos depósitos onde o produto tem estoque; tratar retorno do dialog quando vier `deposito_id` |
| `src/components/shared/FormToolbar.tsx` | Nova prop opcional `XExtraButtons?: ReactNode` renderizada à direita da toolbar (usada para o botão Exportar) |

Sem migrações de banco. Sem alterações em edge functions.

### 6. Pontos a verificar durante a implementação
- Confirmar nome real do campo de promoção em `produto` (provavelmente `vl_promocao` / `dt_promocao_ini` / `dt_promocao_fim`); se inexistente, o checkbox "Em promoção" será preparado mas marcado como `disabled` com tooltip — e aviso ao usuário.
- A 2ª grade só carrega quando há produto selecionado; enquanto não houver, exibe placeholder "Selecione um produto para ver o estoque por depósito".

