## Novo formulário "PDV - Caixa" (recebimento de vendas)

Cria fluxo completo: **seleção de Caixa → abertura de caixa → tela PDV → finalização de pagamento**, usando `caixa_movimento` (cabeçalho) + `caixa_movimento_item` (formas de pagamento).

---

### 1. Menu — `src/config/menuConfig.ts`
Adicionar em `2. Movimentações > Saídas`:
- `{ id: "pdv-caixa", title: "PDV - Caixa", icon: BadgeDollarSign }`

### 2. Roteamento — `src/pages/Index.tsx`
Adicionar `case "pdv-caixa": return <PdvCaixaForm />;`

### 3. Novos arquivos
```
src/components/forms/pdv/
  PdvCaixaForm.tsx              ← orquestrador (etapas)
  SelecionarCaixaDialog.tsx     ← Etapa 1: combo financeiro (caixa='S') + data
  PdvTela.tsx                   ← Etapa 2: layout PDV (baseado no PDV.tsx enviado)
  PagamentoDialog.tsx           ← Etapa 3: tela de pagamento (layout da imagem)
  types.ts
```

---

### Fluxo de telas

#### Etapa 1 — Seleção de Caixa (`SelecionarCaixaDialog`)
- Combo **Caixa**: `SELECT financeiro_id, nm_financeiro FROM financeiro WHERE caixa='S' AND empresa_id=? AND excluido=false`.  
  *(verificar nome real da coluna; usar `descricao`/`nome` conforme schema)*
- Campo **Data movimento** (default = hoje).
- Botões **Prosseguir** / **Cancelar**.

#### Lógica do "Prosseguir"
1. Resolver `funcionario_id`: `SELECT funcionario_id FROM funcionario WHERE usr_id = <auth.uid mapped> AND empresa_id=? AND caixa='S'`.  
   Se não achar → toast "Usuário sem perfil de caixa".
2. `SELECT * FROM caixa_abertura WHERE funcionario_id=? AND empresa_id=? AND status='A'`.
   - **Não encontrado** → `confirm("Caixa fechado. Deseja abrir?")` → INSERT `caixa_abertura (empresa_id, funcionario_id, dt_abertura=data, vl_abertura=0, status='A')` → segue PDV.
   - **Encontrado, dt_abertura ≠ data** → toast "Existe caixa aberto com data dd/mm/aaaa" → permanece na seleção.
   - **Encontrado, dt_abertura = data** → segue PDV.

#### Etapa 2 — Tela PDV (`PdvTela`)
Layout aproveitado do `user-uploads://PDV.tsx`, adaptado ao stack do projeto (DataGrid próprio, supabase client local, cores via tokens semânticos do tailwind, sem componentes shadcn novos):

- **Painel esquerdo — Pedidos a receber**: lista `movimento WHERE empresa_id=? AND st_pedido='F' AND excluido=false`, mostra nº, cliente, valor. Duplo clique adiciona ao "carrinho de fechamento".
- **Painel central — Venda direta**:
  - Busca produto (input) + bipagem por código de barras → INSERT em `movimento` novo (st_pedido='F', tp_origem='PDV', deposito_id = `empresa.deposito_estoque_caixa`, funcionario_id, tp_operacao_id = `empresa.tp_operacao_caixa`) + `movimento_item`.
  - Reusa `ProdutoSearchDialog` existente para busca avançada.
  - Reusa `ClienteSearchDialog` existente.
- **Painel direito — Resumo**: cliente, totais, botão **Receber** (abre `PagamentoDialog`).

#### Etapa 3 — Pagamento (`PagamentoDialog`)
Layout idêntico à imagem `tela_pagamento.jpg`:
- Cards à direita: **Total Pedido / Valor Pago / Valor a Pagar / Troco**.
- Formulário esquerdo: **Condição** (combo `condicao_pagamento`), **Bandeira** (combo `bandeira`), **Operadora** (combo `operadora`), **Nº Autorização**, **Vlr a Pagar**, **Vezes**, **Vlr Parcela** (calculado).
- Botão **Confirmar** → adiciona linha no grid inferior (estado local).
- Grid inferior: condição, valor, parcelas, valor parcela. Toolbar: incluir / alterar / excluir / refresh.
- Validação: soma `vl_recebido` dos itens não pode exceder Total Pedido. Troco = Pago − Total quando condição é DINHEIRO.
- Botão **Finalizar Recebimento**:
  1. INSERT `caixa_movimento`:
     ```
     empresa_id, caixa_movimento_id (seq), funcionario_id, colaborador_id=funcionario_id,
     dt_movimento, tp_movimento='E', tp_operacao = empresa.tp_operacao_caixa,
     conta_gerencial_id = empresa.conta_gerencial_caixa,
     centro_custo_id = empresa.centro_custo_caixa,
     historico='Recebimento Pedido '||nr_movimento, documento=nr_movimento::text,
     vlr_movimento = total, movimento_id, excluido=false
     ```
  2. INSERT N × `caixa_movimento_item` com `condicao_id`, `bandeira_id`, `operadora_id`, `numero_autoriza`, `qt_parcela`, `vl_parcela`, `vl_recebido`.
  3. UPDATE `movimento SET st_pedido='R', dt_pagamento=now() WHERE movimento_id=?`.
  4. Toast sucesso e volta à lista de pedidos a receber (carrinho limpo).

---

### Detalhes técnicos

- **Identificação do funcionário**: `funcionario.usr_id = auth.uid()` (precisa que esse mapeamento exista; se não houver match, exibir mensagem clara para o usuário ajustar o cadastro).
- **Sequência de IDs**: usar mesmo padrão do projeto (max+1 por empresa, como em `PedidoForm`).
- **Empresa params**: leitura única de `empresa` no mount: `tp_operacao_caixa, conta_gerencial_caixa, centro_custo_caixa, deposito_estoque_caixa, empresa_deposito_caixa`.
- **Estado preservado entre etapas** via `useState` no `PdvCaixaForm`. Cancelar/sair em qualquer etapa volta para a Etapa 1.
- **Padrões visuais**: usar `DataGrid`, `GridActionToolbar`, `border-border`, `bg-card`, `text-muted-foreground` etc., seguindo memória `mem://design/grid-action-toolbar.md`.
- **Sem alteração de schema**: todas as tabelas necessárias já existem.
- **Uploaded `PDV.tsx` / `Pedidos.tsx`**: usados apenas como referência de layout/UX — não copiados para o projeto.

### Arquivos editados
- `src/config/menuConfig.ts` (1 linha)
- `src/pages/Index.tsx` (import + case)
- 5 novos arquivos em `src/components/forms/pdv/`