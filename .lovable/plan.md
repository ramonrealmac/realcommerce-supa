

## Módulo padrão de formulários CRUD (`StandardCrudForm`)

### Objetivo
Criar um componente reutilizável que encapsule o padrão repetido em ~15 formulários (Cliente, Produto, Empresa, Cidade, Rota, Linha, Unidade, Depósito, etc.), eliminando repetição e garantindo consistência.

### Padrão identificado nos forms existentes
Analisando `ProdutoForm`, `EstoqueForm`, `EmpresaForm`, `CidadeForm`, `DepositoForm`:

```text
┌─────────────────────────────────────────────┐
│ FormToolbar (Incluir/Editar/Salvar/Nav...)  │
├─────────────────────────────────────────────┤
│ Tabs: [Cadastro] [Localizar]                │
│ ┌─ Cadastro ──────────────────────────────┐ │
│ │  campos do formulário (custom)          │ │
│ │  + abas extras opcionais (estoque, etc) │ │
│ └─────────────────────────────────────────┘ │
│ ┌─ Localizar ─────────────────────────────┐ │
│ │  DataGrid + filtros por coluna          │ │
│ │  + botão Exportar (CSV)                 │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Arquitetura proposta

**1. `src/components/shared/StandardCrudForm.tsx`** — componente genérico
   - Gerencia: modo (view/edit/insert), registro atual, índice, lista, filtros, loading
   - Renderiza: `FormToolbar` + `Tabs` (Cadastro/Localizar) + `DataGrid` com filtros + botão Exportar
   - Recebe via props: configuração da entidade + slot do formulário customizado

**2. `src/hooks/useCrudController.ts`** — lógica de CRUD desacoplada
   - `loadData`, `handleSave`, `handleDelete`, navegação (first/prev/next/last), refresh
   - Validação via Zod schema opcional
   - Callbacks `beforeSave`, `afterLoad` para casos especiais

**3. `src/components/shared/ExportButton.tsx`** — exportação CSV/XLSX da grade filtrada

**4. Tipo de configuração:**
```ts
interface ICrudConfig<T> {
  XTableName: string;          // tabela Supabase
  XPrimaryKey: keyof T;        // ex: "produto_id"
  XTitle: string;              // título do form
  XGridCols: IGridCol<T>[];    // colunas + filtros automáticos
  XDefaultRecord: Partial<T>;  // valores iniciais para insert
  XOrderBy?: string;
  XExtraFilter?: (q) => q;     // ex: filtro por empresa_id
  XExtraTabs?: ITabConfig[];   // abas adicionais (ex: Estoque no Produto)
  XValidator?: ZodSchema;
  XOnBeforeSave?: (rec) => rec;
  XOnAfterLoad?: (data) => void;
}
```

**5. Uso simplificado (exemplo CidadeForm refatorado):**
```tsx
<StandardCrudForm
  config={XCidadeConfig}
  renderCadastro={(rec, setRec, mode) => (
    <CidadeFields record={rec} onChange={setRec} mode={mode} />
  )}
/>
```

### Estratégia de migração
- **Fase 1 (este loop)**: criar `StandardCrudForm` + `useCrudController` + `ExportButton`. Migrar **2 forms simples como prova de conceito**: `CidadeForm` e `LinhaProdutoForm`.
- **Fase 2 (próximos loops, sob demanda)**: migrar os demais. Forms complexos (`ProdutoForm`, `EmpresaForm` com abas extras) usam `XExtraTabs` para preservar comportamento específico.
- Forms já existentes continuam funcionando — migração incremental, sem breaking changes.

### Benefícios
- Toolbar, abas, grid, filtros e exportação garantidos por padrão (não esqueço mais)
- Código de cada form reduz ~70%
- Mudanças no padrão (ex: novo botão na toolbar) aplicadas em um único lugar
- Você só descreve **exceções** específicas

### Arquivos a criar/editar
- `src/components/shared/StandardCrudForm.tsx` (novo)
- `src/hooks/useCrudController.ts` (novo)
- `src/components/shared/ExportButton.tsx` (novo)
- `src/components/forms/CidadeForm.tsx` (refatorar como prova)
- `src/components/forms/LinhaProdutoForm.tsx` (refatorar como prova)

### Pergunta antes de começar
Confirme o formato de exportação preferido: **CSV apenas** (leve, sem libs novas) ou **CSV + XLSX** (precisa instalar `xlsx`)?

