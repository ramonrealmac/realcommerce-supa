

## Formulário de Pedidos (`PedidoForm`) — `2. Movimentações → Novo Pedido`

Reaproveita o `StandardCrudForm`. O cabeçalho (tabela `movimento`) fica na aba "Cadastro" com sub-abas internas; itens (`movimento_item`) e pagamentos (`movimento_pagamento`) entram como `XExtraTabs`.

### Estrutura visual

```
[Toolbar StandardCrudForm: + ✏ « ‹ › » 🗑 ↻ ➜]
[Cadastro][Itens do Pedido][Forma de Pagamento][Dados de Entrega][Dados Adicionais][Localizar]
```

A aba "Cadastro" exibe o bloco "Dados Principais" + ações de status (Salvar / Orçamento / Caixa / Cancelar).

### Aba 1 — Dados Principais (`movimento`)

| Campo PDF | Coluna BD | Componente |
|---|---|---|
| Pedido | `nr_movimento` | input readonly |
| Cliente * | `cadastro_id` | combobox → `cadastro WHERE st_cliente='S'` (mostra `cadastro_id - cnpj - razao_social`) |
| Vendedor * | `funcionario_id` | combobox → `funcionario` |
| Status * | `st_pedido` | select fixo: `O` Orçamento, `P` Pedido, `V` Venda, `C` Cancelado (readonly fora do modo Orçamento) |
| Faturado | `faturado` | switch S/N (readonly) |
| Dt. Emissão * | `dt_emissao` | date |
| Dt. Entrega * | `dt_entrega` | date |
| Tipo de Operação | `tp_operacao_id` | combobox → `tp_operacao` (tabela já criada pelo usuário) |
| Tipo de Movimento * | `tp_movimento` | select fixo: `PD` Pedido / `SV` Saída por Venda / `OR` Orçamento |
| NF | `numero_nfe` | input readonly |
| Tipo de Desconto * | `tp_desconto` | select: `N` Sem Desconto, `I` Desconto Item, `P` Desconto Pedido |

**Botões de status** (ao lado de Salvar):
- **Orçamento** → grava `st_pedido='O'` (editável)
- **Caixa** → grava `st_pedido='P'` (vira pedido, bloqueia edição)
- Status `V` (Venda) e `C` (Cancelado) só são exibidos como readonly — alteração para esses estados é feita por outras telas.

Regra: enquanto `st_pedido !== 'O'`, todos os campos ficam desabilitados (apenas navegação/visualização).

### Aba 2 — Itens do Pedido (`movimento_item`)

Painel superior (formulário de inclusão/edição de item):
- Produto (combobox `produto`, traz `vl_und_produto`, `unidade_id`, `cd_produto`, `nm_produto`)
- Und. (`unidade_id`, readonly do produto)
- Preço Unit. R$ (`vl_und_produto`)
- Qtd. (`qt_movimento`)
- Subtotal R$ (`vl_produto` = qt × vl_und, calculado)
- Desconto % (`pc_desconto`) — recalcula `vl_desconto`
- Desconto R$ (`vl_desconto`) — recalcula `pc_desconto`
- P/Entrega? (`entrega` S/N)
- FC (texto livre, mapeado para `infad_produto`)
- Estoq. Disp. (consulta `estoque.estoque_disponivel`, readonly)
- Depósito (combobox `deposito` filtrado pela mesma regra de visibilidade matriz/sister; `deposito_id`)
- Valor Desp./Frete/Seg./Outros (`vl_despesa`, `vl_frete`, `vl_seguro`, `vl_outro`)
- Total R$ (`vl_movimento` calculado)
- Botão **Inserir Produto**

Toolbar do grid: ✏ 🗑 ↻ +. Grid abaixo lista os itens já incluídos com colunas: Produto, Qtd, Vlr Unit, Vlr Produto, Desc(%), Vlr Outros, Total, Desc(R$).

Rodapé "Totais do Pedido": Vlr Itens, Vlr Desconto, Vlr Frete, Vlr Desp., Vlr Seg., Vlr Outros, **Vlr Total** — todos recalculados ao alterar a grade. Após salvar/excluir item, chama `fu_recalcular_pedido(_movimento_id)`.

**Regra de Tipo de Desconto:**
- `N`: zera `pc_desconto`/`vl_desconto` em todos os itens.
- `I`: usuário edita desconto por item.
- `P`: desconto digitado no cabeçalho (`pc_desconto`/`vl_desc_rs` em `movimento`) é distribuído proporcionalmente nos itens.

Edição: % ↔ R$ se recalculam mutuamente conforme última edição.

### Aba 3 — Forma de Pagamento (`movimento_pagamento`)

- Header: **Valor a Pagar** = `vl_movimento` − Σ `vl_pagamento` já lançado.
- Toolbar grid: + ✏ 🗑 ↻
- Grid: Condição (`condicao_id` → `condicao_pagamento.descricao`), Valor (`vl_pagamento`), Parcelas (`n_parcelas`), Valor Parcela (`vl_parcelas`).
- Rodapé com somatórios.
- Modal de inclusão pede: Condição, Valor, Parcelas (auto a partir de `condicao_pagamento.qtd_parcelas`), Valor Parcela (auto = valor / parcelas).

### Aba 4 — Dados de Entrega

Mapeada para campos já existentes em `movimento`:
- Rota (`rota_id` → `rota`)
- CEP (`cep_entrega`) com lookup `consulta-cep`
- Cidade (`cidade_id` → `cidade`)
- Logradouro (`logradouro_entrega`)
- Bairro (`bairro_entrega`)
- Nº (`numero_entrega`)
- E-mail (`email_entrega`)

### Aba 5 — Dados Adicionais

- Observação do Pedido → `obs_pedido`
- Observação NF → `observacao_nf`

### Aba 6 — Localizar

`DataGrid` padrão sobre `movimento` (filtrado por `empresa_id` e `tp_movimento IN ('PD','SV','OR')`), colunas: nº pedido, dt_emissão, cliente (lookup), vendedor, st_pedido, vl_movimento, faturado. Duplo clique abre na aba Cadastro.

### Integração técnica

1. **Novo arquivo** `src/components/forms/PedidoForm.tsx` usando `StandardCrudForm<Movimento>` com `XExtraTabs` para Itens, Pagamento, Entrega, Adicionais.
2. **Hook auxiliar** `usePedidoItens(movimento_id)` e `usePedidoPagamentos(movimento_id)` com CRUD direto no Supabase + recálculo.
3. **Sub-componentes** `PedidoItemPanel.tsx`, `PedidoPagamentoPanel.tsx`.
4. **`useCrudController`** ganha `XOnAfterSave?: (rec, mode)` para disparar `fu_recalcular_pedido` quando necessário (extensão pequena, retrocompatível).
5. **Roteamento**: registrar `case "pdv": return <PedidoForm />;` em `src/pages/Index.tsx`.
6. **Validações de status**: helper `XPodeEditar = st_pedido === 'O'`. Tudo (campos, toolbar Editar/Excluir/Itens/Pagamento) respeita esse flag.
7. **Filtro de Depósito** no item: reutiliza a regra sister (`empresa_id = own OR (empresa_id IN sisters AND st_privado=false)`) já implementada em `DepositoForm`.
8. **RLS**: `movimento`, `movimento_item`, `movimento_pagamento` já possuem políticas para `authenticated` — nenhuma migration necessária.
9. **Tabelas lookup confirmadas**: `funcionario`, `tp_operacao` (criadas pelo usuário). O `PedidoForm` selecionará via `select('id, nome')` — se os nomes das colunas forem diferentes, ajusto após primeira execução.

### Arquivos a criar/editar

- `src/components/forms/PedidoForm.tsx` (novo)
- `src/components/forms/pedido/PedidoItensTab.tsx` (novo)
- `src/components/forms/pedido/PedidoPagamentoTab.tsx` (novo)
- `src/components/forms/pedido/PedidoEntregaTab.tsx` (novo)
- `src/components/forms/pedido/PedidoAdicionaisTab.tsx` (novo)
- `src/hooks/useCrudController.ts` (adicionar `XOnAfterSave`)
- `src/pages/Index.tsx` (registrar `case "pdv"`)

### Pendências para confirmar antes de começar

Por favor confirme as colunas reais das tabelas que você criou para que o lookup funcione no primeiro deploy:

1. **`funcionario`** — nome da PK e do campo "nome" (ex.: `funcionario_id`, `nm_funcionario`)?
2. **`tp_operacao`** — nome da PK e do campo descrição (ex.: `tp_operacao_id`, `descricao`)?
3. Confirmar se o status **inicial** ao incluir é `O` (Orçamento) e se o botão **Caixa** apenas muda para `P` (sem chamar `fu_transition_pedido_status`, já que aquela função usa `A→F→T`).

