## PDV - Caixa: Refinamentos de UX e Fluxo de Pagamento

### 1. Migrações (schema)

Adicionar colunas:
- `funcionario.tamanho_fonte_pedidos` (smallint, default 12)
- `funcionario.tamanho_fonte_produtos` (smallint, default 12)
- `funcionario.tempo_refresh_pdv` (integer, default 30)
- `empresa.imagem_caixa` (text — URL/base64 da imagem de fundo)

### 2. Reorganização de Layout (`PdvTela.tsx`)

Novo grid (3 colunas):

```text
+----------------------------------+----------------------+
|                                  | Pedidos a Receber    |
|     Venda Direta /               |  [busca cliente/vend/nº] |
|     Itens do Pedido              |  Nº | Cliente            |
|     (col-span-8)                 |  Vendedor | Total       |
|                                  |  ...                    |
|                                  +----------------------+
|                                  | Resumo (totais)      |
+----------------------------------+----------------------+
```

- **Lista de Pedidos** move para coluna direita superior (acima do Resumo).
- Adiciona barra de pesquisa que filtra por **cliente**, **vendedor** ou **número do pedido**.
- Adiciona **nome do vendedor** (via join com `cadastro` usando `movimento.funcionario_id`).
- Tamanho da fonte da lista vinculado a `funcionario.tamanho_fonte_pedidos`.
- Tamanho da fonte da área de produtos vinculado a `funcionario.tamanho_fonte_produtos`.

### 3. Botão "Configurar" (header, ao lado de Sair)

Ao clicar, exibe overlay/painel inline com:
- Botões **A−** / **A+** sobre a lista de pedidos (range 10-24px).
- Botões **A−** / **A+** sobre a lista de produtos (range 10-24px).
- Campo numérico inteiro **Tempo de Refresh** (5–99999 segundos).
- Botões **Salvar** e **Cancelar**.

Salva os valores em `funcionario` do usuário logado (mapeado via `funcionario.usr_id`).

Refresh automático: `setInterval(carregarPedidos, tempo_refresh_pdv * 1000)` na `PdvTela`.

### 4. Imagem de Fundo Vazio

Quando `XCart.length === 0` e nenhum pedido selecionado:
- Renderiza `<img src={empresa.imagem_caixa}>` centralizada como background da área de produtos (com opacidade reduzida).
- Se o campo estiver vazio, mantém o placeholder textual atual.

### 5. Tela "Pós-Finalização" (nova)

Substituir o atual fluxo "Finalizar Venda → PagamentoDialog" por:

1. Clica **Finalizar Venda** → fecha tela atual e abre `OpcoesPagamentoDialog` com 4 cards:
   - **Bobina** (impressão térmica 80mm)
   - **A4** (folha grande)
   - **NFe** (placeholder — "Em desenvolvimento")
   - **NFCe** (placeholder — "Em desenvolvimento")

2. Cada opção (Bobina/A4) abre uma janela de impressão (`window.print()` em template HTML específico) com os itens, totais, cliente, caixa, data.

3. Botão **"Continuar para Pagamento"** abre o `PagamentoDialog` (fluxo original).

> Observação: A ordem solicitada é `Finalizar venda → tela de opções (impressão / NFe / NFCe) → meios de pagamento`. Vamos manter essa sequência.

### 6. Pré-preenchimento do `PagamentoDialog`

Ao abrir:
- Buscar `movimento_pagamento` do `movimento_id` do pedido selecionado (apenas para pedidos do grid, não venda direta).
- Para cada registro encontrado: preenche **Condição** + **Vlr a Pagar** automaticamente no formulário.
- Ao clicar **Confirmar**, adiciona linha e:
  - Se há outra forma de pagamento pendente em `movimento_pagamento`, traz a próxima.
  - Repete até esgotar formas cadastradas OU `totalPago === totalPedido`.

### 7. Regras de campos no `PagamentoDialog`

- Buscar `condicao.tp_documento` da condição selecionada.
- Campos **Bandeira**, **Operadora**, **Nº Autorização**:
  - **Editáveis e recebem foco** apenas se `tp_documento ∈ {3, 4}`.
  - Caso contrário: `disabled`, fundo cinza, sem foco.
- Campos **Condição** e **Vlr a Pagar**: sempre fundo branco (`bg-white`).
- Bandeira/Operadora/Nº Autorização: fundo branco apenas quando editáveis; cinza quando bloqueados.

### Arquivos afetados

**Criados:**
- `src/components/forms/pdv/ConfigurarDialog.tsx` — painel de configuração (fontes + refresh).
- `src/components/forms/pdv/OpcoesPagamentoDialog.tsx` — tela com Bobina/A4/NFe/NFCe.
- `src/components/forms/pdv/ImpressaoBobina.tsx` — template térmico 80mm.
- `src/components/forms/pdv/ImpressaoA4.tsx` — template A4.
- Migration: adicionar colunas em `funcionario` e `empresa`.

**Editados:**
- `src/components/forms/pdv/PdvTela.tsx` — novo layout 3 colunas, busca, vendedor, fontes dinâmicas, refresh, fundo de imagem, botão Configurar, fluxo finalizar.
- `src/components/forms/pdv/PagamentoDialog.tsx` — pré-preenchimento via `movimento_pagamento`, regras de tp_documento, cores brancas.
- `src/components/forms/pdv/types.ts` — novos tipos (`IPdvConfigUsuario`, `IMovimentoPagamento`).
- `src/components/forms/EmpresaForm.tsx` — campo `imagem_caixa` (upload/URL).
