

# Plano: Duplicar Formulário de Cadastro — Clientes vs Fornecedores/Transportadores

## Resumo
Refatorar o `CadastroCompletoForm` em dois formulários distintos reutilizando o mesmo código-base via props, e criar o formulário de Fornecedores/Transportadores com aba extra de Veículos.

## Abordagem
Transformar `CadastroCompletoForm` em um componente parametrizável que recebe props para controlar comportamento. Criar dois wrappers finos.

## Arquivos a criar/editar

| Arquivo | Ação |
|---|---|
| `src/components/forms/CadastroCompletoForm.tsx` | Refatorar para aceitar props de configuração |
| `src/components/forms/ClienteForm.tsx` | Criar: wrapper que renderiza CadastroCompletoForm no modo "cliente" |
| `src/components/forms/FornecedorTransportadorForm.tsx` | Criar: wrapper que renderiza CadastroCompletoForm no modo "fornecedor" com aba Veículos |
| `src/pages/Index.tsx` | Registrar os novos componentes no switch |
| `src/config/menuConfig.ts` | Ajustar menu: "Cadastro" vira "Clientes", adicionar "Fornecedores/Transportadores" |

## Detalhes técnicos

### 1. Props do CadastroCompletoForm

```typescript
interface ICadastroFormConfig {
  formTitle: string;
  // Filtro no loadData
  dataFilter?: { st_cliente?: string; st_fornecedor?: string; st_transportador?: string };
  filterMode: "or" | "and"; // "or" para fornecedor/transportador
  // Defaults ao incluir
  defaultValues?: Partial<Record<string, string>>;
  // Campos travados (não editáveis)
  lockedFields?: string[];
  // Validação extra ao salvar
  extraValidation?: (form: Record<string, string>) => string | null;
  // Mostrar aba Veículos
  showVeiculoTab?: boolean;
}
```

### 2. ClienteForm (wrapper)
- `dataFilter`: `{ st_cliente: "S" }` — só mostra clientes
- `defaultValues`: `{ st_cliente: "S", st_fornecedor: "N", st_transportador: "N" }`
- `lockedFields`: `["st_cliente"]` — campo Cliente sempre "S", não editável
- Título: "Clientes"

### 3. FornecedorTransportadorForm (wrapper)
- `dataFilter`: `{ st_fornecedor: "S", st_transportador: "S" }` com `filterMode: "or"`
- `defaultValues`: `{ st_cliente: "N", st_fornecedor: "S", st_transportador: "N" }`
- `extraValidation`: verifica se `st_fornecedor === "S"` ou `st_transportador === "S"`, senão erro
- `showVeiculoTab`: `true`
- Título: "Fornecedores/Transportadores"

### 4. Aba Veículos (dentro do CadastroCompletoForm quando `showVeiculoTab=true`)
- Nova inner tab "veiculos" ao lado de geral/endereço/complemento/geo
- Grid de veículos vinculados ao `cadastro_id` atual (tabela `veiculo`)
- Campos: `placa`, `descricao`, `marca`, `modelo`, `ativo` (checkbox)
- CRUD inline na grid com botões adicionar/remover
- Tabela `veiculo` já existe com: `veiculo_id`, `placa`, `descricao`, `marca`, `modelo`, `ativo`, `cadastro_id`, `empresa_id`

### 5. Filtro no loadData
```typescript
// Cliente: .eq("st_cliente", "S")
// Fornecedor/Transportador: .or("st_fornecedor.eq.S,st_transportador.eq.S")
```

### 6. Menu
- `cadastro-completo` → título permanece "Cadastro" (id: `cadastro-completo`) — renderiza `ClienteForm`
- Adicionar `fornecedores-transportadores` dentro de "Clientes/Fornecedores" (ou renomear submenu)
- Mover item do submenu "Transportadores" para dentro de "Clientes/Fornecedores" como "Fornecedores/Transportadores"

