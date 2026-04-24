

## Mudanças no Pedido — Aba Cadastro e Aba Forma de Pagamento

### 1. Aba Forma de Pagamento (`PedidoPagamentoTab.tsx`)
- **Remover spinners** dos campos numéricos (Valor, Parcelas) aplicando a classe utilitária `NO_SPIN` (`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`), igual ao usado em `PedidoItensTab`.
- **Confirmação ao mudar status**: ao clicar em "→ Caixa (Pedido)" pedir `confirm("Confirma envio deste pedido para o Caixa?")`. O botão Cancelar Pedido já tem confirm; manter.

### 2. Aba Cadastro (`PedidoForm.tsx` — bloco `renderCadastro`)
Reorganizar a linha de "Tipo de Desconto" e o rodapé:

- **Mover botões "→ Caixa (Pedido)" e "Cancelar Pedido"** para a MESMA linha de "Tipo de Desconto", alinhados à direita (usar `ml-auto` dentro do grid/flex).
- **Adicionar confirmação** ao clicar em "→ Caixa (Pedido)": `confirm("Confirma envio deste pedido para o Caixa?")`. O Cancelar já confirma.
- **Remover o "Vlr. Total"** que aparece no rodapé (linha `Vlr. Total: ...`).
- **Remover o bloco antigo de botões no rodapé** (a div `flex gap-2 pt-3 border-t`), pois eles passam para junto do Tipo de Desconto.
- **Adicionar grid de produtos somente leitura** abaixo do bloco anterior:
  - Reusar o componente `DataGrid` com as mesmas colunas usadas em `PedidoItensTab` (Código, Produto, Qtd, Vlr. Unit, Subtotal, Desc%, Desc R$, Despesa, Frete, Seguro, Outros, Total).
  - Sem `toolbarLeft`, sem `onRowDoubleClick` de edição — apenas visualização.
  - Carregar de `movimento_item` filtrado por `movimento_id` e `excluido=false`.
- **Adicionar painel de totalizadores** idêntico ao da aba Itens (Subtotal, Desc., Frete, Despesa, Seguro, Outros, Total) — 7 cards.
- **Sincronização em tempo real**: 
  - Criar um novo state `XPedidoItensCtx` em `PedidoForm` que guarda `{ movimentoId, itens: IMovimentoItem[] }`.
  - Estender o callback `onTotalsChanged` de `PedidoItensTab` para também enviar a lista de itens (ou criar um segundo callback `onItensChanged`).
  - `PedidoItensTab` já possui `XItens` e o `useEffect` em `[T.vl_movimento]` — basta passar `XItens` no callback.
  - `PedidoForm` consome `XPedidoItensCtx.itens` (quando `movimentoId` bate) para alimentar o grid de visualização e calcular os totais. Fallback inicial: ao abrir um pedido existente sem ter ido na aba Itens ainda, fazer um fetch inicial em um `useEffect` que dispara quando `currentRecord.movimento_id` muda.

### Detalhes técnicos

**PedidoForm.tsx**:
```tsx
const [XPedidoItensCtx, setXPedidoItensCtx] = useState<{ movimentoId, itens: IMovimentoItem[] }>({ movimentoId: null, itens: [] });

// useEffect: ao trocar currentRecord.movimento_id sem itens em cache, busca de movimento_item
// onTotalsChanged em PedidoItensTab → setXPedidoItensCtx({ movimentoId, itens })
// renderCadastro recebe XPedidoItensCtx.itens (filtrado pelo movimento_id atual)
```

**Linha do Tipo de Desconto** (refator):
```tsx
<div className="grid grid-cols-12 gap-3 items-end">
  <div className="col-span-3">Tipo de Desconto ...</div>
  {tp_desconto === "P" && (<>Desc. % ... Desc. R$ ...</>)}
  <div className="col-span-... ml-auto flex gap-2 justify-end">
    {stAtual === "O" && <button onClick={() => confirm("Enviar para o Caixa?") && mudarStatus(...,"P")}>→ Caixa (Pedido)</button>}
    {(stAtual === "O" || "P") && <button onClick={() => confirm("Cancelar?") && mudarStatus(...,"C")}>Cancelar Pedido</button>}
  </div>
</div>
```

**Grid visual + totais** (após linha acima, ainda dentro do renderCadastro), usando os mesmos cards de `PedidoItensTab` linhas 470-491.

### Arquivos a editar
- `src/components/forms/pedido/PedidoPagamentoTab.tsx`
- `src/components/forms/pedido/PedidoItensTab.tsx` (estender callback para enviar itens)
- `src/components/forms/PedidoForm.tsx` (refator do cadastro + grid + totais + sincronização)

