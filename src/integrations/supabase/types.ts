export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      auditoria: {
        Row: {
          id: number
          xacao: string
          xdados_anteriores: Json | null
          xdados_novos: Json | null
          xdt_auditoria: string | null
          xip: string
          xobs: string
          xregistro_id: string
          xtabela: string
          xusuario_id: string | null
        }
        Insert: {
          id?: never
          xacao: string
          xdados_anteriores?: Json | null
          xdados_novos?: Json | null
          xdt_auditoria?: string | null
          xip?: string
          xobs?: string
          xregistro_id: string
          xtabela: string
          xusuario_id?: string | null
        }
        Update: {
          id?: never
          xacao?: string
          xdados_anteriores?: Json | null
          xdados_novos?: Json | null
          xdt_auditoria?: string | null
          xip?: string
          xobs?: string
          xregistro_id?: string
          xtabela?: string
          xusuario_id?: string | null
        }
        Relationships: []
      }
      banco: {
        Row: {
          banco_id: number
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
          razao_social: string
        }
        Insert: {
          banco_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
          razao_social?: string
        }
        Update: {
          banco_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
          razao_social?: string
        }
        Relationships: [
          {
            foreignKeyName: "banco_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      cadastro: {
        Row: {
          cadastro_id: number
          cnpj: string
          condicao_id: number | null
          conj_cpf: string
          conj_dt_nasc: string | null
          conj_nome: string
          conj_telefone: string
          dep_cpf1: string
          dep_cpf2: string
          dep_cpf3: string
          dep_dt_nasc1: string | null
          dep_dt_nasc2: string | null
          dep_dt_nasc3: string | null
          dep_email1: string
          dep_email2: string
          dep_email3: string
          dep_grau_parent1: string
          dep_grau_parent2: string
          dep_nome1: string
          dep_nome2: string
          dep_nome3: string
          dep_st1: string | null
          dep_st2: string | null
          dep_st3: string | null
          dep_telefone1: string
          dep_telefone2: string
          dep_telefone3: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          dt_nasc: string | null
          email: string
          empresa_id: number
          endereco_bairro: string
          endereco_cep: string
          endereco_cidade_id: number | null
          endereco_compl: string
          endereco_logradouro: string
          endereco_numero: string
          endereco_ptoref: string
          estado_civil: string
          excluido_visivel: boolean | null
          fone_comercial: string
          fone_faturamento: string
          fone_financeiro: string
          fone_geral: string
          funcionario_id: number | null
          grupo_cadastro_id: number | null
          identificacao: string
          inscricao_estadual: string
          inscricao_municipal: string
          latitude: number | null
          longitude: number | null
          nacionalidade: string | null
          nome_curto: string
          nome_fantasia: string
          portador_id: number | null
          razao_social: string
          rg: string
          rota_id: number | null
          rota_seq: number
          st_cadastro: string | null
          st_cliente: string | null
          st_fornecedor: string | null
          st_transportador: string | null
          st_vendedor: string | null
          tabela_preco_id: number | null
          tipo_cadastro: string | null
          tp_cadastro_id: number | null
          tp_contribuinte: string | null
          tp_pessoa: string | null
        }
        Insert: {
          cadastro_id?: number
          cnpj?: string
          condicao_id?: number | null
          conj_cpf?: string
          conj_dt_nasc?: string | null
          conj_nome?: string
          conj_telefone?: string
          dep_cpf1?: string
          dep_cpf2?: string
          dep_cpf3?: string
          dep_dt_nasc1?: string | null
          dep_dt_nasc2?: string | null
          dep_dt_nasc3?: string | null
          dep_email1?: string
          dep_email2?: string
          dep_email3?: string
          dep_grau_parent1?: string
          dep_grau_parent2?: string
          dep_nome1?: string
          dep_nome2?: string
          dep_nome3?: string
          dep_st1?: string | null
          dep_st2?: string | null
          dep_st3?: string | null
          dep_telefone1?: string
          dep_telefone2?: string
          dep_telefone3?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          dt_nasc?: string | null
          email?: string
          empresa_id?: number
          endereco_bairro?: string
          endereco_cep?: string
          endereco_cidade_id?: number | null
          endereco_compl?: string
          endereco_logradouro?: string
          endereco_numero?: string
          endereco_ptoref?: string
          estado_civil?: string
          excluido_visivel?: boolean | null
          fone_comercial?: string
          fone_faturamento?: string
          fone_financeiro?: string
          fone_geral?: string
          funcionario_id?: number | null
          grupo_cadastro_id?: number | null
          identificacao?: string
          inscricao_estadual?: string
          inscricao_municipal?: string
          latitude?: number | null
          longitude?: number | null
          nacionalidade?: string | null
          nome_curto?: string
          nome_fantasia?: string
          portador_id?: number | null
          razao_social: string
          rg?: string
          rota_id?: number | null
          rota_seq?: number
          st_cadastro?: string | null
          st_cliente?: string | null
          st_fornecedor?: string | null
          st_transportador?: string | null
          st_vendedor?: string | null
          tabela_preco_id?: number | null
          tipo_cadastro?: string | null
          tp_cadastro_id?: number | null
          tp_contribuinte?: string | null
          tp_pessoa?: string | null
        }
        Update: {
          cadastro_id?: number
          cnpj?: string
          condicao_id?: number | null
          conj_cpf?: string
          conj_dt_nasc?: string | null
          conj_nome?: string
          conj_telefone?: string
          dep_cpf1?: string
          dep_cpf2?: string
          dep_cpf3?: string
          dep_dt_nasc1?: string | null
          dep_dt_nasc2?: string | null
          dep_dt_nasc3?: string | null
          dep_email1?: string
          dep_email2?: string
          dep_email3?: string
          dep_grau_parent1?: string
          dep_grau_parent2?: string
          dep_nome1?: string
          dep_nome2?: string
          dep_nome3?: string
          dep_st1?: string | null
          dep_st2?: string | null
          dep_st3?: string | null
          dep_telefone1?: string
          dep_telefone2?: string
          dep_telefone3?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          dt_nasc?: string | null
          email?: string
          empresa_id?: number
          endereco_bairro?: string
          endereco_cep?: string
          endereco_cidade_id?: number | null
          endereco_compl?: string
          endereco_logradouro?: string
          endereco_numero?: string
          endereco_ptoref?: string
          estado_civil?: string
          excluido_visivel?: boolean | null
          fone_comercial?: string
          fone_faturamento?: string
          fone_financeiro?: string
          fone_geral?: string
          funcionario_id?: number | null
          grupo_cadastro_id?: number | null
          identificacao?: string
          inscricao_estadual?: string
          inscricao_municipal?: string
          latitude?: number | null
          longitude?: number | null
          nacionalidade?: string | null
          nome_curto?: string
          nome_fantasia?: string
          portador_id?: number | null
          razao_social?: string
          rg?: string
          rota_id?: number | null
          rota_seq?: number
          st_cadastro?: string | null
          st_cliente?: string | null
          st_fornecedor?: string | null
          st_transportador?: string | null
          st_vendedor?: string | null
          tabela_preco_id?: number | null
          tipo_cadastro?: string | null
          tp_cadastro_id?: number | null
          tp_contribuinte?: string | null
          tp_pessoa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cadastro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      cadastro_grupo: {
        Row: {
          cadastro_grupo_id: number
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
        }
        Insert: {
          cadastro_grupo_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
        }
        Update: {
          cadastro_grupo_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "cadastro_grupo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      cfop: {
        Row: {
          cfop_id: number
          codigo: string
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
        }
        Insert: {
          cfop_id?: number
          codigo: string
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
        }
        Update: {
          cfop_id?: number
          codigo?: string
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cfop_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      cidade: {
        Row: {
          cd_ibge: string | null
          cidade_id: number
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          excluido_visivel: boolean | null
          uf: string | null
        }
        Insert: {
          cd_ibge?: string | null
          cidade_id?: number
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          excluido_visivel?: boolean | null
          uf?: string | null
        }
        Update: {
          cd_ibge?: string | null
          cidade_id?: number
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          excluido_visivel?: boolean | null
          uf?: string | null
        }
        Relationships: []
      }
      cliente_old: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xcd_cliente: string
          xdt_alteracao: string | null
          xdt_cadastro: string | null
          xnm_crianca: string
          xnm_fantasia_social: string
          xnm_razao_social: string
          xnr_cpf_cnpj: string
          xnr_telefone: string
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xcd_cliente: string
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xnm_crianca?: string
          xnm_fantasia_social?: string
          xnm_razao_social: string
          xnr_cpf_cnpj?: string
          xnr_telefone?: string
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xcd_cliente?: string
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xnm_crianca?: string
          xnm_fantasia_social?: string
          xnm_razao_social?: string
          xnr_cpf_cnpj?: string
          xnr_telefone?: string
        }
        Relationships: []
      }
      comissao: {
        Row: {
          cadastro_id: number | null
          comissao_id: number
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          pc_comis_av: number | null
          pc_comis_pr: number | null
          tp_comissao: string | null
        }
        Insert: {
          cadastro_id?: number | null
          comissao_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          pc_comis_av?: number | null
          pc_comis_pr?: number | null
          tp_comissao?: string | null
        }
        Update: {
          cadastro_id?: number | null
          comissao_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          pc_comis_av?: number | null
          pc_comis_pr?: number | null
          tp_comissao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comissao_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["cadastro_id"]
          },
          {
            foreignKeyName: "comissao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      condicao_pagamento: {
        Row: {
          condicao_id: number
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          prazo_1: number | null
          prazo_10: number
          prazo_11: number
          prazo_12: number
          prazo_2: number
          prazo_3: number
          prazo_4: number
          prazo_5: number
          prazo_6: number
          prazo_7: number
          prazo_8: number
          prazo_9: number
          tp_doc: string
        }
        Insert: {
          condicao_id?: number
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          prazo_1?: number | null
          prazo_10?: number
          prazo_11?: number
          prazo_12?: number
          prazo_2?: number
          prazo_3?: number
          prazo_4?: number
          prazo_5?: number
          prazo_6?: number
          prazo_7?: number
          prazo_8?: number
          prazo_9?: number
          tp_doc?: string
        }
        Update: {
          condicao_id?: number
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          prazo_1?: number | null
          prazo_10?: number
          prazo_11?: number
          prazo_12?: number
          prazo_2?: number
          prazo_3?: number
          prazo_4?: number
          prazo_5?: number
          prazo_6?: number
          prazo_7?: number
          prazo_8?: number
          prazo_9?: number
          tp_doc?: string
        }
        Relationships: [
          {
            foreignKeyName: "condicao_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      corretora: {
        Row: {
          corretora_id: number
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
        }
        Insert: {
          corretora_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
        }
        Update: {
          corretora_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "corretora_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      deposito: {
        Row: {
          deposito_id: number
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          endereco: string
          excluido_visivel: boolean | null
          nome: string
        }
        Insert: {
          deposito_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          endereco?: string
          excluido_visivel?: boolean | null
          nome: string
        }
        Update: {
          deposito_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          endereco?: string
          excluido_visivel?: boolean | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposito_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      empresa: {
        Row: {
          cnpj: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          empresa_matriz_id: number | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade_id: number | null
          endereco_logradouro: string | null
          endereco_numero: string | null
          excluido_visivel: boolean | null
          fone_comercial: string | null
          fone_faturamento: string | null
          fone_financeiro: string | null
          fone_geral: string | null
          identificacao: string | null
          ie: string | null
          nome_fantasia: string
          qt_saida_qt_decimais: number | null
          qt_venda_qt_decimais: number | null
          razao_social: string
          regime_trib: string | null
          vl_saida_qt_decimais: number | null
          vl_venda_qt_decimais: number | null
        }
        Insert: {
          cnpj?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          empresa_matriz_id?: number | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade_id?: number | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          excluido_visivel?: boolean | null
          fone_comercial?: string | null
          fone_faturamento?: string | null
          fone_financeiro?: string | null
          fone_geral?: string | null
          identificacao?: string | null
          ie?: string | null
          nome_fantasia?: string
          qt_saida_qt_decimais?: number | null
          qt_venda_qt_decimais?: number | null
          razao_social?: string
          regime_trib?: string | null
          vl_saida_qt_decimais?: number | null
          vl_venda_qt_decimais?: number | null
        }
        Update: {
          cnpj?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          empresa_matriz_id?: number | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade_id?: number | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          excluido_visivel?: boolean | null
          fone_comercial?: string | null
          fone_faturamento?: string | null
          fone_financeiro?: string | null
          fone_geral?: string | null
          identificacao?: string | null
          ie?: string | null
          nome_fantasia?: string
          qt_saida_qt_decimais?: number | null
          qt_venda_qt_decimais?: number | null
          razao_social?: string
          regime_trib?: string | null
          vl_saida_qt_decimais?: number | null
          vl_venda_qt_decimais?: number | null
        }
        Relationships: []
      }
      empresa_usuario: {
        Row: {
          created_at: string
          empresa_id: number
          empresa_usuario_id: number
          fl_excluido: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          empresa_usuario_id?: never
          fl_excluido?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          empresa_usuario_id?: never
          fl_excluido?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      estoque: {
        Row: {
          deposito_id: number
          dt_alteracao: string | null
          dt_ult_entrada: string | null
          dt_ult_saida: string | null
          empresa_id: number
          endereco: string
          estoque_disponivel: number | null
          estoque_fisico: number | null
          estoque_id: number
          estoque_inventario: number | null
          estoque_minimo: number | null
          estoque_padrao: number | null
          estoque_reservado: number | null
          excluido_visivel: boolean | null
          produto_id: number
        }
        Insert: {
          deposito_id?: number
          dt_alteracao?: string | null
          dt_ult_entrada?: string | null
          dt_ult_saida?: string | null
          empresa_id?: number
          endereco?: string
          estoque_disponivel?: number | null
          estoque_fisico?: number | null
          estoque_id?: number
          estoque_inventario?: number | null
          estoque_minimo?: number | null
          estoque_padrao?: number | null
          estoque_reservado?: number | null
          excluido_visivel?: boolean | null
          produto_id: number
        }
        Update: {
          deposito_id?: number
          dt_alteracao?: string | null
          dt_ult_entrada?: string | null
          dt_ult_saida?: string | null
          empresa_id?: number
          endereco?: string
          estoque_disponivel?: number | null
          estoque_fisico?: number | null
          estoque_id?: number
          estoque_inventario?: number | null
          estoque_minimo?: number | null
          estoque_padrao?: number | null
          estoque_reservado?: number | null
          excluido_visivel?: boolean | null
          produto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_disponiveis"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      financeiro: {
        Row: {
          cadastro_id: number | null
          dt_alteracao: string | null
          dt_cadastro: string | null
          dt_cancelamento: string | null
          dt_emissao: string | null
          dt_pagamento: string | null
          dt_vencimento: string
          empresa_id: number
          excluido_visivel: boolean | null
          financeiro_id: number
          movimento_id: number | null
          nr_documento: string
          nr_parcela: number | null
          observacao: string
          plano_conta_id: number | null
          portador_id: number | null
          st_financeiro: string | null
          tp_financeiro: string
          tp_pagamento: string
          vl_desconto: number | null
          vl_documento: number
          vl_juros: number | null
          vl_multa: number | null
          vl_pago: number | null
          vl_saldo: number | null
        }
        Insert: {
          cadastro_id?: number | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          dt_cancelamento?: string | null
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_vencimento: string
          empresa_id?: number
          excluido_visivel?: boolean | null
          financeiro_id?: number
          movimento_id?: number | null
          nr_documento?: string
          nr_parcela?: number | null
          observacao?: string
          plano_conta_id?: number | null
          portador_id?: number | null
          st_financeiro?: string | null
          tp_financeiro?: string
          tp_pagamento?: string
          vl_desconto?: number | null
          vl_documento?: number
          vl_juros?: number | null
          vl_multa?: number | null
          vl_pago?: number | null
          vl_saldo?: number | null
        }
        Update: {
          cadastro_id?: number | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          dt_cancelamento?: string | null
          dt_emissao?: string | null
          dt_pagamento?: string | null
          dt_vencimento?: string
          empresa_id?: number
          excluido_visivel?: boolean | null
          financeiro_id?: number
          movimento_id?: number | null
          nr_documento?: string
          nr_parcela?: number | null
          observacao?: string
          plano_conta_id?: number | null
          portador_id?: number | null
          st_financeiro?: string | null
          tp_financeiro?: string
          tp_pagamento?: string
          vl_desconto?: number | null
          vl_documento?: number
          vl_juros?: number | null
          vl_multa?: number | null
          vl_pago?: number | null
          vl_saldo?: number | null
        }
        Relationships: []
      }
      financeiro_baixa: {
        Row: {
          dt_baixa: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          financeiro_baixa_id: number
          financeiro_id: number
          nr_autorizacao: string
          observacao: string
          tp_pagamento: string
          usuario_id: string | null
          vl_baixa: number
          vl_desconto: number | null
          vl_juros: number | null
          vl_multa: number | null
        }
        Insert: {
          dt_baixa?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          financeiro_baixa_id?: number
          financeiro_id: number
          nr_autorizacao?: string
          observacao?: string
          tp_pagamento?: string
          usuario_id?: string | null
          vl_baixa?: number
          vl_desconto?: number | null
          vl_juros?: number | null
          vl_multa?: number | null
        }
        Update: {
          dt_baixa?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          financeiro_baixa_id?: number
          financeiro_id?: number
          nr_autorizacao?: string
          observacao?: string
          tp_pagamento?: string
          usuario_id?: string | null
          vl_baixa?: number
          vl_desconto?: number | null
          vl_juros?: number | null
          vl_multa?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_baixa_financeiro_id_fkey"
            columns: ["financeiro_id"]
            isOneToOne: false
            referencedRelation: "financeiro"
            referencedColumns: ["financeiro_id"]
          },
        ]
      }
      grupo_icms: {
        Row: {
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          grupo_icms_id: number
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_icms_id?: number
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_icms_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "grupo_icms_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      grupo_ipi: {
        Row: {
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          grupo_ipi_id: number
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_ipi_id?: number
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_ipi_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "grupo_ipi_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      grupo_pis_cofins: {
        Row: {
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          grupo_pis_cofins_id: number
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_pis_cofins_id?: number
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_pis_cofins_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "grupo_pis_cofins_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      grupo_produto_old: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xcd_grupo_produto: string
          xdt_alteracao: string | null
          xdt_cadastro: string | null
          xnm_grupo_produto: string
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xcd_grupo_produto: string
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xnm_grupo_produto: string
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xcd_grupo_produto?: string
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xnm_grupo_produto?: string
        }
        Relationships: []
      }
      linha_produto: {
        Row: {
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          linha_id: number
          nome: string
        }
        Insert: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          linha_id?: number
          nome: string
        }
        Update: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          linha_id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "linha_produto_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      movimento: {
        Row: {
          cadastro_id: number | null
          dt_cancelamento: string | null
          dt_emissao: string | null
          dt_faturamento: string | null
          dt_finalizacao: string | null
          dt_pagamento: string | null
          email_responsavel: string
          empresa_id: number
          excluido_visivel: boolean | null
          faturado: string | null
          hr_movimento: string
          id_transacao_abacatepay: string
          lg_pagamento_online: boolean | null
          lg_pedido_link: boolean | null
          lg_pedido_pdv: boolean | null
          movimento_id: number
          nm_crianca: string
          nm_responsavel: string
          nr_movimento: number | null
          nr_telefone_responsavel: string
          obs_pedido: string
          observacao: string
          qr_code_pagamento: string
          st_pedido: string | null
          status: string | null
          tp_movimento: string | null
          tp_origem: string | null
          url_pagamento: string
          usuario_id: string | null
          vl_desconto: number | null
          vl_movimento: number | null
          vl_produto: number | null
        }
        Insert: {
          cadastro_id?: number | null
          dt_cancelamento?: string | null
          dt_emissao?: string | null
          dt_faturamento?: string | null
          dt_finalizacao?: string | null
          dt_pagamento?: string | null
          email_responsavel?: string
          empresa_id?: number
          excluido_visivel?: boolean | null
          faturado?: string | null
          hr_movimento?: string
          id_transacao_abacatepay?: string
          lg_pagamento_online?: boolean | null
          lg_pedido_link?: boolean | null
          lg_pedido_pdv?: boolean | null
          movimento_id?: number
          nm_crianca?: string
          nm_responsavel?: string
          nr_movimento?: number | null
          nr_telefone_responsavel?: string
          obs_pedido?: string
          observacao?: string
          qr_code_pagamento?: string
          st_pedido?: string | null
          status?: string | null
          tp_movimento?: string | null
          tp_origem?: string | null
          url_pagamento?: string
          usuario_id?: string | null
          vl_desconto?: number | null
          vl_movimento?: number | null
          vl_produto?: number | null
        }
        Update: {
          cadastro_id?: number | null
          dt_cancelamento?: string | null
          dt_emissao?: string | null
          dt_faturamento?: string | null
          dt_finalizacao?: string | null
          dt_pagamento?: string | null
          email_responsavel?: string
          empresa_id?: number
          excluido_visivel?: boolean | null
          faturado?: string | null
          hr_movimento?: string
          id_transacao_abacatepay?: string
          lg_pagamento_online?: boolean | null
          lg_pedido_link?: boolean | null
          lg_pedido_pdv?: boolean | null
          movimento_id?: number
          nm_crianca?: string
          nm_responsavel?: string
          nr_movimento?: number | null
          nr_telefone_responsavel?: string
          obs_pedido?: string
          observacao?: string
          qr_code_pagamento?: string
          st_pedido?: string | null
          status?: string | null
          tp_movimento?: string | null
          tp_origem?: string | null
          url_pagamento?: string
          usuario_id?: string | null
          vl_desconto?: number | null
          vl_movimento?: number | null
          vl_produto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimento_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["cadastro_id"]
          },
          {
            foreignKeyName: "movimento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      movimento_item: {
        Row: {
          cd_produto: string
          empresa_id: number
          excluido_visivel: boolean | null
          movimento_id: number
          movimento_item_id: number
          nm_produto: string
          produto_id: number | null
          qt_movimento: number | null
          tp_movimento: string | null
          unidade_id: string | null
          vl_desconto: number | null
          vl_movimento: number | null
          vl_produto: number | null
          vl_und_produto: number | null
        }
        Insert: {
          cd_produto?: string
          empresa_id?: number
          excluido_visivel?: boolean | null
          movimento_id: number
          movimento_item_id?: number
          nm_produto?: string
          produto_id?: number | null
          qt_movimento?: number | null
          tp_movimento?: string | null
          unidade_id?: string | null
          vl_desconto?: number | null
          vl_movimento?: number | null
          vl_produto?: number | null
          vl_und_produto?: number | null
        }
        Update: {
          cd_produto?: string
          empresa_id?: number
          excluido_visivel?: boolean | null
          movimento_id?: number
          movimento_item_id?: number
          nm_produto?: string
          produto_id?: number | null
          qt_movimento?: number | null
          tp_movimento?: string | null
          unidade_id?: string | null
          vl_desconto?: number | null
          vl_movimento?: number | null
          vl_produto?: number | null
          vl_und_produto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimento_item_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "movimento_item_movimento_id_fkey"
            columns: ["movimento_id"]
            isOneToOne: false
            referencedRelation: "movimento"
            referencedColumns: ["movimento_id"]
          },
          {
            foreignKeyName: "movimento_item_movimento_id_fkey"
            columns: ["movimento_id"]
            isOneToOne: false
            referencedRelation: "vw_pedidos_completos"
            referencedColumns: ["movimento_id"]
          },
          {
            foreignKeyName: "movimento_item_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "movimento_item_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_disponiveis"
            referencedColumns: ["produto_id"]
          },
        ]
      }
      movimento_pagamento: {
        Row: {
          dt_pagamento: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          movimento_id: number
          movimento_pagamento_id: number
          nr_autorizacao: string
          obs_pagamento: string
          tp_pagamento: string
          vl_pagamento: number | null
        }
        Insert: {
          dt_pagamento?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          movimento_id: number
          movimento_pagamento_id?: number
          nr_autorizacao?: string
          obs_pagamento?: string
          tp_pagamento: string
          vl_pagamento?: number | null
        }
        Update: {
          dt_pagamento?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          movimento_id?: number
          movimento_pagamento_id?: number
          nr_autorizacao?: string
          obs_pagamento?: string
          tp_pagamento?: string
          vl_pagamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimento_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "movimento_pagamento_movimento_id_fkey"
            columns: ["movimento_id"]
            isOneToOne: false
            referencedRelation: "movimento"
            referencedColumns: ["movimento_id"]
          },
          {
            foreignKeyName: "movimento_pagamento_movimento_id_fkey"
            columns: ["movimento_id"]
            isOneToOne: false
            referencedRelation: "vw_pedidos_completos"
            referencedColumns: ["movimento_id"]
          },
        ]
      }
      parametro: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xabacatepay_api_key: string
          xabacatepay_webhook_secret: string
          xabacatepay_webhook_url: string
          xcor_botao: string | null
          xcor_botao_negativo: string | null
          xcor_destaque: string | null
          xcor_fundo: string | null
          xcor_fundo_card: string | null
          xcor_header: string | null
          xcor_link: string | null
          xcor_menu: string | null
          xcor_primaria: string | null
          xcor_secundaria: string | null
          xcor_texto_principal: string | null
          xcor_texto_secundario: string | null
          xcss_customizado: string
          xdt_alteracao: string | null
          xdt_cadastro: string | null
          xemail_remetente: string
          xlg_valida_estoque_link: boolean | null
          xlg_valida_estoque_pdv: boolean | null
          xmsg_pos_pagamento: string | null
          xnm_escola: string | null
          xurl_banner_vendas: string
          xurl_favicon: string
          xurl_link_vendas: string
          xurl_logo: string
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xabacatepay_api_key?: string
          xabacatepay_webhook_secret?: string
          xabacatepay_webhook_url?: string
          xcor_botao?: string | null
          xcor_botao_negativo?: string | null
          xcor_destaque?: string | null
          xcor_fundo?: string | null
          xcor_fundo_card?: string | null
          xcor_header?: string | null
          xcor_link?: string | null
          xcor_menu?: string | null
          xcor_primaria?: string | null
          xcor_secundaria?: string | null
          xcor_texto_principal?: string | null
          xcor_texto_secundario?: string | null
          xcss_customizado?: string
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xemail_remetente?: string
          xlg_valida_estoque_link?: boolean | null
          xlg_valida_estoque_pdv?: boolean | null
          xmsg_pos_pagamento?: string | null
          xnm_escola?: string | null
          xurl_banner_vendas?: string
          xurl_favicon?: string
          xurl_link_vendas?: string
          xurl_logo?: string
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xabacatepay_api_key?: string
          xabacatepay_webhook_secret?: string
          xabacatepay_webhook_url?: string
          xcor_botao?: string | null
          xcor_botao_negativo?: string | null
          xcor_destaque?: string | null
          xcor_fundo?: string | null
          xcor_fundo_card?: string | null
          xcor_header?: string | null
          xcor_link?: string | null
          xcor_menu?: string | null
          xcor_primaria?: string | null
          xcor_secundaria?: string | null
          xcor_texto_principal?: string | null
          xcor_texto_secundario?: string | null
          xcss_customizado?: string
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xemail_remetente?: string
          xlg_valida_estoque_link?: boolean | null
          xlg_valida_estoque_pdv?: boolean | null
          xmsg_pos_pagamento?: string | null
          xnm_escola?: string | null
          xurl_banner_vendas?: string
          xurl_favicon?: string
          xurl_link_vendas?: string
          xurl_logo?: string
        }
        Relationships: []
      }
      parametro_horario: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xdia_semana: number
          xhr_fim_matutino: string | null
          xhr_fim_noturno: string | null
          xhr_fim_vespertino: string | null
          xhr_inicio_matutino: string | null
          xhr_inicio_noturno: string | null
          xhr_inicio_vespertino: string | null
          xlg_dia_ativo: boolean | null
          xparametro_id: number | null
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xdia_semana: number
          xhr_fim_matutino?: string | null
          xhr_fim_noturno?: string | null
          xhr_fim_vespertino?: string | null
          xhr_inicio_matutino?: string | null
          xhr_inicio_noturno?: string | null
          xhr_inicio_vespertino?: string | null
          xlg_dia_ativo?: boolean | null
          xparametro_id?: number | null
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xdia_semana?: number
          xhr_fim_matutino?: string | null
          xhr_fim_noturno?: string | null
          xhr_fim_vespertino?: string | null
          xhr_inicio_matutino?: string | null
          xhr_inicio_noturno?: string | null
          xhr_inicio_vespertino?: string | null
          xlg_dia_ativo?: boolean | null
          xparametro_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parametro_horario_xparametro_id_fkey"
            columns: ["xparametro_id"]
            isOneToOne: false
            referencedRelation: "parametro"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_item_old: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xcd_produto: string
          xnm_produto: string
          xpedido_id: number
          xproduto_id: number | null
          xqt_item: number | null
          xun_produto: string
          xvl_total_item: number | null
          xvl_unitario: number | null
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xcd_produto?: string
          xnm_produto?: string
          xpedido_id: number
          xproduto_id?: number | null
          xqt_item?: number | null
          xun_produto?: string
          xvl_total_item?: number | null
          xvl_unitario?: number | null
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xcd_produto?: string
          xnm_produto?: string
          xpedido_id?: number
          xproduto_id?: number | null
          xqt_item?: number | null
          xun_produto?: string
          xvl_total_item?: number | null
          xvl_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_item_xpedido_id_fkey"
            columns: ["xpedido_id"]
            isOneToOne: false
            referencedRelation: "pedido_old"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_item_xproduto_id_fkey"
            columns: ["xproduto_id"]
            isOneToOne: false
            referencedRelation: "produto_old"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_old: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xcliente_id: number | null
          xdt_cancelamento: string | null
          xdt_faturamento: string | null
          xdt_finalizacao: string | null
          xdt_pagamento: string | null
          xdt_pedido: string | null
          xemail_responsavel: string
          xhr_pedido: string
          xid_transacao_abacatepay: string
          xlg_pagamento_online: boolean | null
          xlg_pedido_link: boolean | null
          xlg_pedido_pdv: boolean | null
          xnm_crianca: string
          xnm_responsavel: string
          xnr_pedido: number | null
          xnr_telefone_responsavel: string
          xobs_pedido: string
          xqr_code_pagamento: string
          xst_pedido: string | null
          xtipo_origem_pedido: string | null
          xurl_pagamento: string
          xusuario_id: string | null
          xvl_total_bruto: number | null
          xvl_total_desconto: number | null
          xvl_total_liquido: number | null
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xcliente_id?: number | null
          xdt_cancelamento?: string | null
          xdt_faturamento?: string | null
          xdt_finalizacao?: string | null
          xdt_pagamento?: string | null
          xdt_pedido?: string | null
          xemail_responsavel?: string
          xhr_pedido?: string
          xid_transacao_abacatepay?: string
          xlg_pagamento_online?: boolean | null
          xlg_pedido_link?: boolean | null
          xlg_pedido_pdv?: boolean | null
          xnm_crianca?: string
          xnm_responsavel?: string
          xnr_pedido?: number | null
          xnr_telefone_responsavel?: string
          xobs_pedido?: string
          xqr_code_pagamento?: string
          xst_pedido?: string | null
          xtipo_origem_pedido?: string | null
          xurl_pagamento?: string
          xusuario_id?: string | null
          xvl_total_bruto?: number | null
          xvl_total_desconto?: number | null
          xvl_total_liquido?: number | null
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xcliente_id?: number | null
          xdt_cancelamento?: string | null
          xdt_faturamento?: string | null
          xdt_finalizacao?: string | null
          xdt_pagamento?: string | null
          xdt_pedido?: string | null
          xemail_responsavel?: string
          xhr_pedido?: string
          xid_transacao_abacatepay?: string
          xlg_pagamento_online?: boolean | null
          xlg_pedido_link?: boolean | null
          xlg_pedido_pdv?: boolean | null
          xnm_crianca?: string
          xnm_responsavel?: string
          xnr_pedido?: number | null
          xnr_telefone_responsavel?: string
          xobs_pedido?: string
          xqr_code_pagamento?: string
          xst_pedido?: string | null
          xtipo_origem_pedido?: string | null
          xurl_pagamento?: string
          xusuario_id?: string | null
          xvl_total_bruto?: number | null
          xvl_total_desconto?: number | null
          xvl_total_liquido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_xcliente_id_fkey"
            columns: ["xcliente_id"]
            isOneToOne: false
            referencedRelation: "cliente_old"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_pagamento_old: {
        Row: {
          excluido_visivel: boolean | null
          id: number
          xdt_pagamento: string | null
          xnr_autorizacao: string
          xobs_pagamento: string
          xpedido_id: number
          xtp_pagamento: string
          xvl_pagamento: number | null
        }
        Insert: {
          excluido_visivel?: boolean | null
          id?: never
          xdt_pagamento?: string | null
          xnr_autorizacao?: string
          xobs_pagamento?: string
          xpedido_id: number
          xtp_pagamento: string
          xvl_pagamento?: number | null
        }
        Update: {
          excluido_visivel?: boolean | null
          id?: never
          xdt_pagamento?: string | null
          xnr_autorizacao?: string
          xobs_pagamento?: string
          xpedido_id?: number
          xtp_pagamento?: string
          xvl_pagamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_pagamento_xpedido_id_fkey"
            columns: ["xpedido_id"]
            isOneToOne: false
            referencedRelation: "pedido_old"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil: {
        Row: {
          created_at: string
          empresa_id: number
          fl_administrador: boolean
          fl_excluido: boolean
          nm_perfil: string
          perfil_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_administrador?: boolean
          fl_excluido?: boolean
          nm_perfil: string
          perfil_id?: never
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_administrador?: boolean
          fl_excluido?: boolean
          nm_perfil?: string
          perfil_id?: never
          updated_at?: string
        }
        Relationships: []
      }
      perfil_acesso_botao: {
        Row: {
          created_at: string
          empresa_id: number
          fl_editavel: boolean
          fl_excluido: boolean
          nm_botao: string
          nm_formulario: string
          perfil_acesso_botao_id: number
          perfil_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_editavel?: boolean
          fl_excluido?: boolean
          nm_botao: string
          nm_formulario: string
          perfil_acesso_botao_id?: never
          perfil_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_editavel?: boolean
          fl_excluido?: boolean
          nm_botao?: string
          nm_formulario?: string
          perfil_acesso_botao_id?: never
          perfil_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_acesso_botao_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      perfil_acesso_campo: {
        Row: {
          created_at: string
          empresa_id: number
          fl_excluido: boolean
          nm_campo: string
          nm_formulario: string
          perfil_acesso_campo_id: number
          perfil_id: number
          tp_editavel: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_excluido?: boolean
          nm_campo: string
          nm_formulario: string
          perfil_acesso_campo_id?: never
          perfil_id: number
          tp_editavel?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_excluido?: boolean
          nm_campo?: string
          nm_formulario?: string
          perfil_acesso_campo_id?: never
          perfil_id?: number
          tp_editavel?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_acesso_campo_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      perfil_acesso_formulario: {
        Row: {
          created_at: string
          empresa_id: number
          fl_alterar: boolean
          fl_excluido: boolean
          fl_excluir_registro: boolean
          fl_incluir: boolean
          fl_visualizar: boolean
          nm_formulario: string
          perfil_acesso_formulario_id: number
          perfil_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_alterar?: boolean
          fl_excluido?: boolean
          fl_excluir_registro?: boolean
          fl_incluir?: boolean
          fl_visualizar?: boolean
          nm_formulario: string
          perfil_acesso_formulario_id?: never
          perfil_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_alterar?: boolean
          fl_excluido?: boolean
          fl_excluir_registro?: boolean
          fl_incluir?: boolean
          fl_visualizar?: boolean
          nm_formulario?: string
          perfil_acesso_formulario_id?: never
          perfil_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_acesso_formulario_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      perfil_acesso_menu: {
        Row: {
          created_at: string
          empresa_id: number
          fl_excluido: boolean
          fl_visivel: boolean
          nm_menu: string
          nm_menu_pai: string | null
          perfil_acesso_menu_id: number
          perfil_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_excluido?: boolean
          fl_visivel?: boolean
          nm_menu: string
          nm_menu_pai?: string | null
          perfil_acesso_menu_id?: never
          perfil_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_excluido?: boolean
          fl_visivel?: boolean
          nm_menu?: string
          nm_menu_pai?: string | null
          perfil_acesso_menu_id?: never
          perfil_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_acesso_menu_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      perfil_horario: {
        Row: {
          created_at: string
          empresa_id: number
          fl_excluido: boolean
          fl_matutino: boolean
          fl_noturno: boolean
          fl_vespertino: boolean
          hr_matutino_fim: string | null
          hr_matutino_inicio: string | null
          hr_noturno_fim: string | null
          hr_noturno_inicio: string | null
          hr_vespertino_fim: string | null
          hr_vespertino_inicio: string | null
          nr_dia_semana: number
          perfil_horario_id: number
          perfil_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_excluido?: boolean
          fl_matutino?: boolean
          fl_noturno?: boolean
          fl_vespertino?: boolean
          hr_matutino_fim?: string | null
          hr_matutino_inicio?: string | null
          hr_noturno_fim?: string | null
          hr_noturno_inicio?: string | null
          hr_vespertino_fim?: string | null
          hr_vespertino_inicio?: string | null
          nr_dia_semana: number
          perfil_horario_id?: never
          perfil_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_excluido?: boolean
          fl_matutino?: boolean
          fl_noturno?: boolean
          fl_vespertino?: boolean
          hr_matutino_fim?: string | null
          hr_matutino_inicio?: string | null
          hr_noturno_fim?: string | null
          hr_noturno_inicio?: string | null
          hr_vespertino_fim?: string | null
          hr_vespertino_inicio?: string | null
          nr_dia_semana?: number
          perfil_horario_id?: never
          perfil_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_perfil_horario_perfil"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      perfil_usuario: {
        Row: {
          created_at: string
          empresa_id: number
          fl_excluido: boolean
          perfil_id: number
          perfil_usuario_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: number
          fl_excluido?: boolean
          perfil_id: number
          perfil_usuario_id?: never
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_excluido?: boolean
          perfil_id?: number
          perfil_usuario_id?: never
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_usuario_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      plano_conta: {
        Row: {
          conta: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
          plano_id: number
          tp_conta: string | null
          tp_natureza: string | null
        }
        Insert: {
          conta: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
          plano_id?: number
          tp_conta?: string | null
          tp_natureza?: string | null
        }
        Update: {
          conta?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
          plano_id?: number
          tp_conta?: string | null
          tp_natureza?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plano_conta_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      portador: {
        Row: {
          banco_id: number | null
          caminho_remessa: string
          conta_id: string | null
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
          portador_id: number
        }
        Insert: {
          banco_id?: number | null
          caminho_remessa?: string
          conta_id?: string | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
          portador_id?: number
        }
        Update: {
          banco_id?: number | null
          caminho_remessa?: string
          conta_id?: string | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
          portador_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "portador_banco_id_fkey"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "banco"
            referencedColumns: ["banco_id"]
          },
          {
            foreignKeyName: "portador_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      produto: {
        Row: {
          altura: number
          area: number
          ativo: string | null
          cest: string
          comprimento: number
          controla_estoque: string | null
          descricao: string
          dias_venda_online: string | null
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          grupo_icms_id: number | null
          grupo_id: number | null
          grupo_ipi_id: number | null
          grupo_pis_cofins_id: number | null
          gtin: string
          largura: number
          linha_id: number | null
          mva: number
          ncm: string
          nome: string
          nome_reduzido: string
          pc_cofins: number
          pc_desconto: number
          pc_difal_sn: number
          pc_emb: number
          pc_fcp_st: number
          pc_frete: number
          pc_icms_cred: number
          pc_ipi: number
          pc_ipi_cred: number
          pc_markup: number | null
          pc_multiplicador: number
          pc_outras_desp: number
          pc_pis: number
          pc_seguro: number
          pc_st_trib: number
          peso_bruto: number
          peso_liquido: number
          preco_promocional: number
          preco_promocional_fat: number
          preco_sugerido: number | null
          preco_venda: number | null
          preco_venda_faturado: number
          produto_id: number
          referencia: string
          st_promo: string
          subgrupo_id: number | null
          tb_a_origem: string
          tp_produto: string | null
          unidade_id: string | null
          url_foto: string
          venda_online: boolean | null
          vl_cofins: number
          vl_compra: number | null
          vl_custo: number
          vl_custo_medio: number
          vl_desconto: number
          vl_difal_sn: number
          vl_emb: number
          vl_fcp_st: number
          vl_frete: number
          vl_icms_cred: number
          vl_ipi: number
          vl_ipi_cred: number
          vl_multiplicador: number
          vl_outras_desp: number
          vl_outro: number
          vl_pis: number
          vl_seguro: number
          vl_st: number
        }
        Insert: {
          altura?: number
          area?: number
          ativo?: string | null
          cest?: string
          comprimento?: number
          controla_estoque?: string | null
          descricao?: string
          dias_venda_online?: string | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_icms_id?: number | null
          grupo_id?: number | null
          grupo_ipi_id?: number | null
          grupo_pis_cofins_id?: number | null
          gtin?: string
          largura?: number
          linha_id?: number | null
          mva?: number
          ncm?: string
          nome: string
          nome_reduzido?: string
          pc_cofins?: number
          pc_desconto?: number
          pc_difal_sn?: number
          pc_emb?: number
          pc_fcp_st?: number
          pc_frete?: number
          pc_icms_cred?: number
          pc_ipi?: number
          pc_ipi_cred?: number
          pc_markup?: number | null
          pc_multiplicador?: number
          pc_outras_desp?: number
          pc_pis?: number
          pc_seguro?: number
          pc_st_trib?: number
          peso_bruto?: number
          peso_liquido?: number
          preco_promocional?: number
          preco_promocional_fat?: number
          preco_sugerido?: number | null
          preco_venda?: number | null
          preco_venda_faturado?: number
          produto_id?: number
          referencia?: string
          st_promo?: string
          subgrupo_id?: number | null
          tb_a_origem?: string
          tp_produto?: string | null
          unidade_id?: string | null
          url_foto?: string
          venda_online?: boolean | null
          vl_cofins?: number
          vl_compra?: number | null
          vl_custo?: number
          vl_custo_medio?: number
          vl_desconto?: number
          vl_difal_sn?: number
          vl_emb?: number
          vl_fcp_st?: number
          vl_frete?: number
          vl_icms_cred?: number
          vl_ipi?: number
          vl_ipi_cred?: number
          vl_multiplicador?: number
          vl_outras_desp?: number
          vl_outro?: number
          vl_pis?: number
          vl_seguro?: number
          vl_st?: number
        }
        Update: {
          altura?: number
          area?: number
          ativo?: string | null
          cest?: string
          comprimento?: number
          controla_estoque?: string | null
          descricao?: string
          dias_venda_online?: string | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_icms_id?: number | null
          grupo_id?: number | null
          grupo_ipi_id?: number | null
          grupo_pis_cofins_id?: number | null
          gtin?: string
          largura?: number
          linha_id?: number | null
          mva?: number
          ncm?: string
          nome?: string
          nome_reduzido?: string
          pc_cofins?: number
          pc_desconto?: number
          pc_difal_sn?: number
          pc_emb?: number
          pc_fcp_st?: number
          pc_frete?: number
          pc_icms_cred?: number
          pc_ipi?: number
          pc_ipi_cred?: number
          pc_markup?: number | null
          pc_multiplicador?: number
          pc_outras_desp?: number
          pc_pis?: number
          pc_seguro?: number
          pc_st_trib?: number
          peso_bruto?: number
          peso_liquido?: number
          preco_promocional?: number
          preco_promocional_fat?: number
          preco_sugerido?: number | null
          preco_venda?: number | null
          preco_venda_faturado?: number
          produto_id?: number
          referencia?: string
          st_promo?: string
          subgrupo_id?: number | null
          tb_a_origem?: string
          tp_produto?: string | null
          unidade_id?: string | null
          url_foto?: string
          venda_online?: boolean | null
          vl_cofins?: number
          vl_compra?: number | null
          vl_custo?: number
          vl_custo_medio?: number
          vl_desconto?: number
          vl_difal_sn?: number
          vl_emb?: number
          vl_fcp_st?: number
          vl_frete?: number
          vl_icms_cred?: number
          vl_ipi?: number
          vl_ipi_cred?: number
          vl_multiplicador?: number
          vl_outras_desp?: number
          vl_outro?: number
          vl_pis?: number
          vl_seguro?: number
          vl_st?: number
        }
        Relationships: [
          {
            foreignKeyName: "produto_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produto_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "produto_grupo"
            referencedColumns: ["grupo_id"]
          },
        ]
      }
      produto_conversao: {
        Row: {
          conversao_id: number
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          fator_mult: number
          produto_id: number
          tp_movimento: string
          unidade_id: string
        }
        Insert: {
          conversao_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          fator_mult?: number
          produto_id: number
          tp_movimento?: string
          unidade_id?: string
        }
        Update: {
          conversao_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          fator_mult?: number
          produto_id?: number
          tp_movimento?: string
          unidade_id?: string
        }
        Relationships: []
      }
      produto_grupo: {
        Row: {
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          grupo_id: number
          nome: string
          ultima_sequencia: number | null
        }
        Insert: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_id?: number
          nome: string
          ultima_sequencia?: number | null
        }
        Update: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_id?: number
          nome?: string
          ultima_sequencia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_grupo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      produto_old: {
        Row: {
          empresa_id: number | null
          excluido_visivel: boolean | null
          id: number
          xcd_barra: string
          xcd_produto: string
          xdias_venda_online: string | null
          xdt_alteracao: string | null
          xdt_cadastro: string | null
          xgrupo_produto_id: number | null
          xlg_venda_online: boolean | null
          xnm_produto: string
          xpc_markup: number | null
          xqt_estoque_disponivel: number | null
          xqt_estoque_fisico: number | null
          xqt_estoque_minimo: number | null
          xqt_estoque_padrao: number | null
          xqt_estoque_reservado: number | null
          xun_produto: string | null
          xurl_foto: string
          xvl_preco_compra: number | null
          xvl_preco_sugerido: number | null
          xvl_preco_venda: number | null
        }
        Insert: {
          empresa_id?: number | null
          excluido_visivel?: boolean | null
          id?: never
          xcd_barra?: string
          xcd_produto: string
          xdias_venda_online?: string | null
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xgrupo_produto_id?: number | null
          xlg_venda_online?: boolean | null
          xnm_produto: string
          xpc_markup?: number | null
          xqt_estoque_disponivel?: number | null
          xqt_estoque_fisico?: number | null
          xqt_estoque_minimo?: number | null
          xqt_estoque_padrao?: number | null
          xqt_estoque_reservado?: number | null
          xun_produto?: string | null
          xurl_foto?: string
          xvl_preco_compra?: number | null
          xvl_preco_sugerido?: number | null
          xvl_preco_venda?: number | null
        }
        Update: {
          empresa_id?: number | null
          excluido_visivel?: boolean | null
          id?: never
          xcd_barra?: string
          xcd_produto?: string
          xdias_venda_online?: string | null
          xdt_alteracao?: string | null
          xdt_cadastro?: string | null
          xgrupo_produto_id?: number | null
          xlg_venda_online?: boolean | null
          xnm_produto?: string
          xpc_markup?: number | null
          xqt_estoque_disponivel?: number | null
          xqt_estoque_fisico?: number | null
          xqt_estoque_minimo?: number | null
          xqt_estoque_padrao?: number | null
          xqt_estoque_reservado?: number | null
          xun_produto?: string | null
          xurl_foto?: string
          xvl_preco_compra?: number | null
          xvl_preco_sugerido?: number | null
          xvl_preco_venda?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_xgrupo_produto_id_fkey"
            columns: ["xgrupo_produto_id"]
            isOneToOne: false
            referencedRelation: "grupo_produto_old"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          ds_foto: string | null
          ds_login: string | null
          email: string | null
          id: string
          nm_usuario: string | null
        }
        Insert: {
          created_at?: string
          ds_foto?: string | null
          ds_login?: string | null
          email?: string | null
          id: string
          nm_usuario?: string | null
        }
        Update: {
          created_at?: string
          ds_foto?: string | null
          ds_login?: string | null
          email?: string | null
          id?: string
          nm_usuario?: string | null
        }
        Relationships: []
      }
      rota: {
        Row: {
          cadastro_id: number | null
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
          rota_id: number
        }
        Insert: {
          cadastro_id?: number | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
          rota_id?: number
        }
        Update: {
          cadastro_id?: number | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
          rota_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "rota_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["cadastro_id"]
          },
          {
            foreignKeyName: "rota_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      subgrupo_produto: {
        Row: {
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          grupo_id: number | null
          nome: string
          subgrupo_id: number
        }
        Insert: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_id?: number | null
          nome: string
          subgrupo_id?: number
        }
        Update: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          grupo_id?: number | null
          nome?: string
          subgrupo_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "subgrupo_produto_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "subgrupo_produto_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "produto_grupo"
            referencedColumns: ["grupo_id"]
          },
        ]
      }
      tabela_preco: {
        Row: {
          ativo: boolean | null
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          tabela_id: number
        }
        Insert: {
          ativo?: boolean | null
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          tabela_id?: number
        }
        Update: {
          ativo?: boolean | null
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          tabela_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tabela_preco_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      tipo_cadastro: {
        Row: {
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          nome: string
          tp_cadastro_id: number
        }
        Insert: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome: string
          tp_cadastro_id?: number
        }
        Update: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          nome?: string
          tp_cadastro_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipo_cadastro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      tipo_operacao: {
        Row: {
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          gera_boleto: boolean | null
          gera_financeiro: boolean | null
          gera_nf: boolean | null
          modifica_estoque: boolean | null
          tipo_movimento: string | null
          tipo_operacao_id: number
          valida_preco: boolean | null
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          gera_boleto?: boolean | null
          gera_financeiro?: boolean | null
          gera_nf?: boolean | null
          modifica_estoque?: boolean | null
          tipo_movimento?: string | null
          tipo_operacao_id?: number
          valida_preco?: boolean | null
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          gera_boleto?: boolean | null
          gera_financeiro?: boolean | null
          gera_nf?: boolean | null
          modifica_estoque?: boolean | null
          tipo_movimento?: string | null
          tipo_operacao_id?: number
          valida_preco?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tipo_operacao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      tipo_pag_rec: {
        Row: {
          ativo: boolean | null
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          tipo: string | null
          tipo_pag_rec_id: number
        }
        Insert: {
          ativo?: boolean | null
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          tipo?: string | null
          tipo_pag_rec_id?: number
        }
        Update: {
          ativo?: boolean | null
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          tipo?: string | null
          tipo_pag_rec_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipo_pag_rec_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      unidade: {
        Row: {
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          unidade_id: string
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          unidade_id: string
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          unidade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidade_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      veiculo: {
        Row: {
          ativo: boolean | null
          cadastro_id: number | null
          descricao: string
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido_visivel: boolean | null
          marca: string
          modelo: string
          placa: string
          veiculo_id: number
        }
        Insert: {
          ativo?: boolean | null
          cadastro_id?: number | null
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          marca?: string
          modelo?: string
          placa?: string
          veiculo_id?: number
        }
        Update: {
          ativo?: boolean | null
          cadastro_id?: number | null
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido_visivel?: boolean | null
          marca?: string
          modelo?: string
          placa?: string
          veiculo_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "veiculo_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["cadastro_id"]
          },
          {
            foreignKeyName: "veiculo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
    }
    Views: {
      vw_pedidos_completos: {
        Row: {
          cadastro_id: number | null
          dt_cancelamento: string | null
          dt_emissao: string | null
          dt_faturamento: string | null
          dt_finalizacao: string | null
          dt_pagamento: string | null
          email_responsavel: string | null
          empresa_id: number | null
          excluido_visivel: boolean | null
          faturado: string | null
          hr_movimento: string | null
          id_transacao_abacatepay: string | null
          lg_pagamento_online: boolean | null
          lg_pedido_link: boolean | null
          lg_pedido_pdv: boolean | null
          movimento_id: number | null
          nm_cliente: string | null
          nm_crianca: string | null
          nm_responsavel: string | null
          nr_movimento: number | null
          nr_telefone_responsavel: string | null
          obs_pedido: string | null
          observacao: string | null
          qr_code_pagamento: string | null
          st_pedido: string | null
          status: string | null
          tp_movimento: string | null
          tp_origem: string | null
          url_pagamento: string | null
          usuario_id: string | null
          vl_desconto: number | null
          vl_movimento: number | null
          vl_produto: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimento_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["cadastro_id"]
          },
          {
            foreignKeyName: "movimento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      vw_produtos_disponiveis: {
        Row: {
          ativo: string | null
          controla_estoque: string | null
          descricao: string | null
          dias_venda_online: string | null
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number | null
          estoque_disponivel: number | null
          estoque_fisico: number | null
          estoque_minimo: number | null
          estoque_padrao: number | null
          estoque_reservado: number | null
          excluido_visivel: boolean | null
          grupo_id: number | null
          gtin: string | null
          nm_grupo_produto: string | null
          nome: string | null
          nome_reduzido: string | null
          pc_markup: number | null
          preco_promocional: number | null
          preco_sugerido: number | null
          preco_venda: number | null
          produto_id: number | null
          referencia: string | null
          tp_produto: string | null
          unidade_id: string | null
          url_foto: string | null
          venda_online: boolean | null
          vl_compra: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produto_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "produto_grupo"
            referencedColumns: ["grupo_id"]
          },
        ]
      }
    }
    Functions: {
      fu_form_permissao: {
        Args: { _empresa_id: number; _nm_formulario: string; _user_id: string }
        Returns: {
          fl_alterar: boolean
          fl_excluir_registro: boolean
          fl_incluir: boolean
          fl_visualizar: boolean
        }[]
      }
      fu_get_cliente_public: {
        Args: { _cpf: string }
        Returns: {
          dep_nome1: string
          fone_geral: string
          id: number
          razao_social: string
        }[]
      }
      fu_get_parametro_publico: {
        Args: never
        Returns: {
          id: number
          xcor_botao: string
          xcor_botao_negativo: string
          xcor_destaque: string
          xcor_fundo: string
          xcor_fundo_card: string
          xcor_header: string
          xcor_link: string
          xcor_menu: string
          xcor_primaria: string
          xcor_secundaria: string
          xcor_texto_principal: string
          xcor_texto_secundario: string
          xcss_customizado: string
          xlg_valida_estoque_link: boolean
          xlg_valida_estoque_pdv: boolean
          xmsg_pos_pagamento: string
          xnm_escola: string
          xurl_banner_vendas: string
          xurl_favicon: string
          xurl_link_vendas: string
          xurl_logo: string
        }[]
      }
      fu_get_pedido_status_public: {
        Args: { _cpf: string; _movimento_id: number }
        Returns: {
          dt_emissao: string
          id: number
          nr_movimento: number
          st_pedido: string
          url_pagamento: string
          vl_movimento: number
        }[]
      }
      fu_is_admin: {
        Args: { _empresa_id: number; _user_id: string }
        Returns: boolean
      }
      fu_list_pedidos_public: {
        Args: { _cpf: string }
        Returns: {
          dt_emissao: string
          id: number
          items: Json
          nr_movimento: number
          st_pedido: string
          vl_movimento: number
        }[]
      }
      fu_menu_visivel: {
        Args: { _empresa_id: number; _nm_menu: string; _user_id: string }
        Returns: boolean
      }
      fu_recalcular_pedido: {
        Args: { _movimento_id: number }
        Returns: undefined
      }
      fu_transition_pedido_status: {
        Args: {
          _movimento_id: number
          _novo_status: string
          _usuario_id?: string
        }
        Returns: Json
      }
      fu_upsert_cliente_public: {
        Args: {
          _cpf: string
          _filhos: string
          _nome: string
          _telefone: string
        }
        Returns: number
      }
      fu_user_in_empresa: {
        Args: { _empresa_id: number; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
