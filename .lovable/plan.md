

## Plan: Fix Emp. display and empresamatriz_id handling

### Summary
1. TopBar dropdown shows `empresa_id - identificacao` instead of `razao_social`
2. All 3 forms show `empresa_id - identificacao` in "Emp. Matriz" field (wider by 20%)
3. `identificacao` added to data model and fetched from DB
4. On update in CadastroGrupoForm, also set `empresa_id: XEmpresaMatrizId`
5. CadastroCompletoForm update already includes `empresa_id: XEmpresaMatrizId` in the payload

### File Changes

**1. `src/contexts/AppContext.tsx`** (line 13)
- Add `identificacao: string` to `IEmpresaOption`

**2. `src/components/auth/AuthGate.tsx`**
- Line 15-20: Add `identificacao: string` to `IEmpresaVinculada`
- Line 93: Add `identificacao` to select query: `"empresa_id, razao_social, nome_fantasia, empresa_matriz_id, identificacao"`

**3. `src/components/layout/TopBar.tsx`**
- Line 75: Change dropdown option text from `{e.razao_social}` to `{e.empresa_id} - {e.identificacao || e.razao_social}`

**4. `src/components/forms/CadastroCompletoForm.tsx`**
- Line 720-728: Increase "Emp. Matriz" width from `md:w-28` to `md:w-[13.5rem]`
- Line 724: Display `XEmpresaMatrizId + ' - ' + identificacao` using `XEmpresas` lookup:
  ```typescript
  const XEmpMatriz = XEmpresas.find(e => e.empresa_id === XEmpresaMatrizId);
  const XEmpMatrizLabel = XEmpMatriz ? `${XEmpMatriz.empresa_id} - ${XEmpMatriz.identificacao}` : String(XEmpresaMatrizId);
  ```
- Need to add `XEmpresas` to the destructured context
- Insert already sets `empresa_id: XEmpresaMatrizId` (line 446) -- OK
- Update also already includes it in XPayload (line 446+502) -- OK

**5. `src/components/forms/CadastroGrupoForm.tsx`**
- Line 27: Add `XEmpresas` to destructured context
- Line 137-139: Increase width from `md:w-28` to `md:w-[13.5rem]`, display label with identificacao
- Line 71: Add `empresa_id: XEmpresaMatrizId` to the update payload (currently missing)
- Compute `XEmpMatrizLabel` same as above

### No DB migration needed
Both `empresa_matriz_id` and `identificacao` already exist in the empresa table.

