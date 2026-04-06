

## Plan: RBuilder - Report Builder Module (sem ReportBro)

### Abordagem

Usar apenas tecnologias compatíveis com Lovable: React, shadcn/ui, TanStack Table, jsPDF, xlsx, e Monaco Editor (via `@monaco-editor/react`). O designer visual será construído com componentes React nativos -- um editor de colunas/layout simples, não um designer WYSIWYG completo.

---

### Fase 1: Banco de Dados (1 migration)

4 tabelas com RLS (authenticated ALL):

- **RB_CONEXAO**: `rb_conexao_id` (PK serial), `empresa_id`, `nome`, `url`, `api_key`, `descricao`, `excluido`, `dt_cadastro`, `dt_alteracao`
- **RB_TEMPLATEPESQUISA**: `rb_templatepesquisa_id` (PK serial), `empresa_id`, `nome`, `label`, `tipo` (text/integer/date/boolean/select/query_select), `obrigatorio`, `valor_padrao`, `opcoes_fixas`, `query`, `rb_conexao_id`, `excluido`, `dt_cadastro`, `dt_alteracao`
- **RB_RELATORIO**: `rb_relatorio_id` (PK serial), `empresa_id`, `nome`, `rb_conexao_id`, `menu`, `submenu`, `ordem`, `query_sql`, `report_json` (jsonb - layout de colunas, header, footer, agrupamentos, totais), `excluido`, `dt_cadastro`, `dt_alteracao`
- **RB_RELATORIO_VARIAVEL**: `rb_relatorio_variavel_id` (PK serial), `rb_relatorio_id`, `rb_templatepesquisa_id`, `operador` (=, <, >, <=, >=, IN, LIKE), `excluido`

---

### Fase 2: Módulo rbuilder (arquivos isolados em `src/rbuilder/`)

```
src/rbuilder/
  models/rb_types.ts
  services/rb_connectionService.ts
  services/rb_templateService.ts
  services/rb_reportService.ts
  services/rb_queryService.ts
  services/rb_exportService.ts      -- jsPDF + xlsx + CSV
  hooks/rb_useConnections.ts
  hooks/rb_useTemplates.ts
  hooks/rb_useReports.ts
  utils/rb_sqlParser.ts             -- {{variavel}} substituição
  components/rb_ConexaoForm.tsx      -- CRUD padrão (FormToolbar + DataGrid)
  components/rb_TemplatePesquisaForm.tsx
  components/rb_RelatorioForm.tsx    -- Abas: Dados, Query (Monaco), Variáveis, Layout, Execução
  components/rb_LayoutEditor.tsx     -- Editor de colunas React (largura, alinhamento, formato, header/footer, agrupamentos, totais)
  components/rb_ReportExecutor.tsx   -- Formulário de filtros dinâmico + grid de resultados + botões exportação
  components/rb_ReportPreview.tsx    -- Preview tabular do relatório com layout aplicado
```

### Designer Visual (rb_LayoutEditor)

Em vez de ReportBro, um editor React nativo com:
- Lista de colunas detectadas da query (arrastar para reordenar)
- Para cada coluna: label, largura, alinhamento, formato (texto/número/data/moeda)
- Configuração de header (título, subtítulo)
- Configuração de footer (totais por coluna: soma, média, contagem)
- Agrupamento por campo (group by visual)
- Tudo salvo como JSON em `report_json`

### Exportações (rb_exportService)

- **PDF**: jsPDF + jspdf-autotable (tabela formatada conforme layout)
- **Excel**: xlsx
- **CSV**: geração nativa
- **Impressão**: window.print() com CSS

---

### Fase 3: Integração com menu e Index.tsx

**menuConfig.ts** - Adicionar:
- Em "5. Configurações": `rb-conexoes`, `rb-templates`, `rb-relatorios`
- Em "4. Relatórios": `rbuilder` (submenu dinâmico)

**Index.tsx** - Adicionar cases no `renderTabContent`:
- `rb-conexoes` → `<RbConexaoForm />`
- `rb-templates` → `<RbTemplatePesquisaForm />`
- `rb-relatorios` → `<RbRelatorioForm />`
- `rb-exec-*` → `<RbReportExecutor reportId={...} />`

**SidebarMenu.tsx** - Carregar relatórios do banco agrupados por menu/submenu e renderizar dinamicamente sob "4. Relatórios → Rbuilder"

---

### Dependências a instalar

- `@monaco-editor/react` (editor SQL)
- `jspdf` + `jspdf-autotable` (PDF)
- `xlsx` (Excel)

### Regras de isolamento

- Prefixo `rb_` em todos os arquivos
- Zero imports de `src/components/forms/` -- só usa shadcn/ui, FormToolbar, DataGrid
- Comunicação via AppContext (XEmpresaMatrizId, XEmpresas)
- Pasta copiável para outro projeto

