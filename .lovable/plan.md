

# Plano: Migrar cores/parâmetros para tabela Empresa

## Resumo

Transferir todos os campos da tabela `parametro` para a tabela `empresa` (removendo o prefixo "x"), renomear `parametro_horario` para `empresa_hs_lojavirtual`, adicionar campo `logomarca` com upload, e fazer o esquema de cores ser carregado dinamicamente por empresa selecionada.

---

## 1. Migração SQL (banco de dados)

**1.1 Adicionar colunas na tabela `empresa`** (vindas de `parametro`, sem o prefixo "x"):
- `cor_primaria`, `cor_secundaria`, `cor_destaque`, `cor_fundo`, `cor_fundo_card`, `cor_texto_principal`, `cor_texto_secundario`, `cor_botao`, `cor_botao_negativo`, `cor_header`, `cor_link`, `cor_menu`
- `nm_escola`, `url_logo`, `url_favicon`, `url_banner_vendas`, `url_link_vendas`
- `msg_pos_pagamento`, `lg_valida_estoque_link`, `lg_valida_estoque_pdv`
- `email_remetente`, `abacatepay_api_key`, `abacatepay_webhook_url`, `abacatepay_webhook_secret`
- `css_customizado`
- `logomarca` (TEXT, URL da imagem para fundo do formulário principal)

**1.2 Renomear tabela `parametro_horario` para `empresa_hs_lojavirtual`**:
- Renomear campo `xparametro_id` para `empresa_id`
- Adicionar FK referenciando `empresa(empresa_id)`
- Atualizar RLS policies

**1.3 Copiar dados existentes** de `parametro` para `empresa` (via UPDATE com subselect da primeira linha de parametro)

---

## 2. Ajustar `EmpresaForm.tsx`

- Remover dependência de `parametro` — cores, link de vendas, horários passam a ser campos diretos da empresa editada
- Na aba "Cadastro": mover `empresamatriz_id` para entre o campo Código e Razão Social, como select mostrando `empresa_id - razao_social`
- Na aba "Horário Loja Virtual": carregar de `empresa_hs_lojavirtual` filtrado por `empresa_id` da empresa atual
- Na aba "Tema": ler/salvar cores diretamente nos campos da empresa
- Adicionar campo **Logomarca** com botão de upload (usando bucket `avatars` ou novo bucket) na aba Cadastro ou Tema
- Remover chamadas a `parametro` e `parametro_horario`

---

## 3. Ajustar `useThemeColors.ts`

- Passar a receber `empresa_id` como parâmetro
- Carregar cores da tabela `empresa` (campos `cor_primaria`, etc.) em vez de `parametro`
- Re-executar quando `empresa_id` mudar (troca de empresa no TopBar ou login)

---

## 4. Ajustar `AppContext` e `Index.tsx`

- O `useThemeColors` precisa ser chamado dentro do `AppContent` (onde `XEmpresaId` está disponível), ou receber o `empresa_id` do contexto
- Quando `XEmpresaId` mudar (seletor no TopBar), recarregar cores e logomarca
- Exibir `logomarca` como imagem de fundo no container principal (quando disponível)

---

## 5. Ajustar `AuthGate.tsx`

- Ao confirmar empresa, disparar carregamento de cores da empresa selecionada

---

## 6. Ajustar `TopBar.tsx`

- Ao trocar empresa no seletor "Emp.", disparar recarga do tema (cores + logomarca)

---

## Detalhes Técnicos

- **COLOR_FIELDS** no form passam a usar nomes sem "x": `cor_primaria` em vez de `xcor_primaria`
- **COLOR_MAP** no hook passa a mapear `cor_primaria -> --primary`, etc.
- O campo `empresamatriz_id` já existe na tabela `empresa` — apenas reposicionar no form entre Código e Razão Social, mostrando como lista `{empresa_id} - {razao_social}`
- Upload de logomarca: usar Supabase Storage (bucket existente `avatars` ou criar bucket `logos`), salvar URL no campo `logomarca`
- A tabela `parametro` permanece no banco mas deixa de ser usada pelo sistema principal

---

## Arquivos Afetados

| Arquivo | Alteração |
|---|---|
| Migration SQL | Adicionar colunas em `empresa`, renomear `parametro_horario` |
| `src/components/forms/EmpresaForm.tsx` | Refatorar completamente para usar campos da empresa |
| `src/hooks/useThemeColors.ts` | Carregar de `empresa` por `empresa_id` |
| `src/App.tsx` | Mover `useThemeColors` para dentro do contexto com acesso ao `empresa_id` |
| `src/pages/Index.tsx` | Integrar tema com empresa selecionada, exibir logomarca |
| `src/contexts/AppContext.tsx` | Adicionar estado para logomarca da empresa |
| `src/components/layout/TopBar.tsx` | Disparar recarga de tema ao trocar empresa |
| `src/integrations/supabase/types.ts` | Será regenerado automaticamente |

