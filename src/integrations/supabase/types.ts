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
    PostgrestVersion: "14.5"
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
          id?: number
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
          id?: number
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
          excluido: boolean | null
          nome: string
          razao_social: string
        }
        Insert: {
          banco_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          nome: string
          razao_social?: string
        }
        Update: {
          banco_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
          nome: string
        }
        Insert: {
          cadastro_grupo_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          nome: string
        }
        Update: {
          cadastro_grupo_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
        }
        Insert: {
          cfop_id?: number
          codigo: string
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
        }
        Update: {
          cfop_id?: number
          codigo?: string
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
          uf: string | null
        }
        Insert: {
          cd_ibge?: string | null
          cidade_id?: number
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          excluido?: boolean | null
          uf?: string | null
        }
        Update: {
          cd_ibge?: string | null
          cidade_id?: number
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          excluido?: boolean | null
          uf?: string | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
          pc_comis_av?: number | null
          pc_comis_pr?: number | null
          tp_comissao?: string | null
        }
        Relationships: [
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
          nome: string
        }
        Insert: {
          corretora_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          nome: string
        }
        Update: {
          corretora_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
          nome: string
        }
        Insert: {
          deposito_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          endereco?: string
          excluido?: boolean | null
          nome: string
        }
        Update: {
          deposito_id?: number
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          endereco?: string
          excluido?: boolean | null
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
          abacatepay_api_key: string | null
          abacatepay_webhook_secret: string | null
          abacatepay_webhook_url: string | null
          cnpj: string
          cor_botao: string | null
          cor_botao_negativo: string | null
          cor_destaque: string | null
          cor_fundo: string | null
          cor_fundo_card: string | null
          cor_header: string | null
          cor_link: string | null
          cor_menu: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          cor_texto_principal: string | null
          cor_texto_secundario: string | null
          css_customizado: string | null
          dt_alteracao: string | null
          dt_cadastro: string | null
          email_remetente: string | null
          empresa_id: number
          empresa_matriz_id: number | null
          empresamatriz_id: number | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade_id: number | null
          endereco_logradouro: string | null
          endereco_numero: string | null
          excluido: boolean | null
          fone_comercial: string | null
          fone_faturamento: string | null
          fone_financeiro: string | null
          fone_geral: string | null
          identificacao: string | null
          ie: string | null
          lg_valida_estoque_link: boolean | null
          lg_valida_estoque_pdv: boolean | null
          logomarca: string | null
          msg_pos_pagamento: string | null
          nm_escola: string | null
          nome_fantasia: string
          qt_saida_qt_decimais: number | null
          qt_venda_qt_decimais: number | null
          razao_social: string
          regime_trib: string | null
          url_banner_vendas: string | null
          url_favicon: string | null
          url_link_vendas: string | null
          url_logo: string | null
          vl_saida_qt_decimais: number | null
          vl_venda_qt_decimais: number | null
        }
        Insert: {
          abacatepay_api_key?: string | null
          abacatepay_webhook_secret?: string | null
          abacatepay_webhook_url?: string | null
          cnpj?: string
          cor_botao?: string | null
          cor_botao_negativo?: string | null
          cor_destaque?: string | null
          cor_fundo?: string | null
          cor_fundo_card?: string | null
          cor_header?: string | null
          cor_link?: string | null
          cor_menu?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          cor_texto_principal?: string | null
          cor_texto_secundario?: string | null
          css_customizado?: string | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          email_remetente?: string | null
          empresa_id?: number
          empresa_matriz_id?: number | null
          empresamatriz_id?: number | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade_id?: number | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          excluido?: boolean | null
          fone_comercial?: string | null
          fone_faturamento?: string | null
          fone_financeiro?: string | null
          fone_geral?: string | null
          identificacao?: string | null
          ie?: string | null
          lg_valida_estoque_link?: boolean | null
          lg_valida_estoque_pdv?: boolean | null
          logomarca?: string | null
          msg_pos_pagamento?: string | null
          nm_escola?: string | null
          nome_fantasia?: string
          qt_saida_qt_decimais?: number | null
          qt_venda_qt_decimais?: number | null
          razao_social?: string
          regime_trib?: string | null
          url_banner_vendas?: string | null
          url_favicon?: string | null
          url_link_vendas?: string | null
          url_logo?: string | null
          vl_saida_qt_decimais?: number | null
          vl_venda_qt_decimais?: number | null
        }
        Update: {
          abacatepay_api_key?: string | null
          abacatepay_webhook_secret?: string | null
          abacatepay_webhook_url?: string | null
          cnpj?: string
          cor_botao?: string | null
          cor_botao_negativo?: string | null
          cor_destaque?: string | null
          cor_fundo?: string | null
          cor_fundo_card?: string | null
          cor_header?: string | null
          cor_link?: string | null
          cor_menu?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          cor_texto_principal?: string | null
          cor_texto_secundario?: string | null
          css_customizado?: string | null
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          email_remetente?: string | null
          empresa_id?: number
          empresa_matriz_id?: number | null
          empresamatriz_id?: number | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade_id?: number | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          excluido?: boolean | null
          fone_comercial?: string | null
          fone_faturamento?: string | null
          fone_financeiro?: string | null
          fone_geral?: string | null
          identificacao?: string | null
          ie?: string | null
          lg_valida_estoque_link?: boolean | null
          lg_valida_estoque_pdv?: boolean | null
          logomarca?: string | null
          msg_pos_pagamento?: string | null
          nm_escola?: string | null
          nome_fantasia?: string
          qt_saida_qt_decimais?: number | null
          qt_venda_qt_decimais?: number | null
          razao_social?: string
          regime_trib?: string | null
          url_banner_vendas?: string | null
          url_favicon?: string | null
          url_link_vendas?: string | null
          url_logo?: string | null
          vl_saida_qt_decimais?: number | null
          vl_venda_qt_decimais?: number | null
        }
        Relationships: []
      }
      empresa_hs_lojavirtual: {
        Row: {
          dia_semana: number
          empresa_id: number | null
          excluido: boolean | null
          hr_fim_matutino: string | null
          hr_fim_noturno: string | null
          hr_fim_vespertino: string | null
          hr_inicio_matutino: string | null
          hr_inicio_noturno: string | null
          hr_inicio_vespertino: string | null
          id: number
          lg_dia_ativo: boolean | null
        }
        Insert: {
          dia_semana: number
          empresa_id?: number | null
          excluido?: boolean | null
          hr_fim_matutino?: string | null
          hr_fim_noturno?: string | null
          hr_fim_vespertino?: string | null
          hr_inicio_matutino?: string | null
          hr_inicio_noturno?: string | null
          hr_inicio_vespertino?: string | null
          id?: number
          lg_dia_ativo?: boolean | null
        }
        Update: {
          dia_semana?: number
          empresa_id?: number | null
          excluido?: boolean | null
          hr_fim_matutino?: string | null
          hr_fim_noturno?: string | null
          hr_fim_vespertino?: string | null
          hr_inicio_matutino?: string | null
          hr_inicio_noturno?: string | null
          hr_inicio_vespertino?: string | null
          id?: number
          lg_dia_ativo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresa_hs_lojavirtual_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "parametro_horario_xparametro_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "parametro"
            referencedColumns: ["id"]
          },
        ]
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
          empresa_usuario_id?: number
          fl_excluido?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          empresa_usuario_id?: number
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
          grupo_icms_id: number
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          grupo_icms_id?: number
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
          grupo_ipi_id: number
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          grupo_ipi_id?: number
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
          grupo_pis_cofins_id: number
        }
        Insert: {
          descricao: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          grupo_pis_cofins_id?: number
        }
        Update: {
          descricao?: string
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
      linha_produto: {
        Row: {
          dt_alteracao: string | null
          dt_cadastro: string | null
          empresa_id: number
          excluido: boolean | null
          linha_id: number
          nome: string
        }
        Insert: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
          linha_id?: number
          nome: string
        }
        Update: {
          dt_alteracao?: string | null
          dt_cadastro?: string | null
          empresa_id?: number
          excluido?: boolean | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
        ]
      }
      movimento_pagamento: {
        Row: {
          dt_pagamento: string | null
          empresa_id: number
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
        ]
      }
      parametro: {
        Row: {
          excluido: boolean | null
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
          excluido?: boolean | null
          id?: number
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
          excluido?: boolean | null
          id?: number
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
          perfil_id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_administrador?: boolean
          fl_excluido?: boolean
          nm_perfil?: string
          perfil_id?: number
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
          perfil_acesso_botao_id?: number
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
          perfil_acesso_botao_id?: number
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
          perfil_acesso_campo_id?: number
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
          perfil_acesso_campo_id?: number
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
          perfil_acesso_formulario_id?: number
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
          perfil_acesso_formulario_id?: number
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
          perfil_acesso_menu_id?: number
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
          perfil_acesso_menu_id?: number
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
          perfil_horario_id?: number
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
          perfil_horario_id?: number
          perfil_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_horario_perfil_id_fkey"
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
          perfil_usuario_id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: number
          fl_excluido?: boolean
          perfil_id?: number
          perfil_usuario_id?: number
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
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
          excluido: boolean | null
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
          excluido?: boolean | null
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
          excluido?: boolean | null
          nome?: string
          portador_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "portador_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["empresa_id"]
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
          updated_at: string
        }
        Insert: {
          created_at?: string
          ds_foto?: string | null
          ds_login?: string | null
          email?: string | null
          id: string
          nm_usuario?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ds_foto?: string | null
          ds_login?: string | null
          email?: string | null
          id?: string
          nm_usuario?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      unidade: {
        Row: {
          descricao: string | null
          empresa_id: number
          excluido: boolean | null
          unidade_id: string
        }
        Insert: {
          descricao?: string | null
          empresa_id?: number
          excluido?: boolean | null
          unidade_id?: string
        }
        Update: {
          descricao?: string | null
          empresa_id?: number
          excluido?: boolean | null
          unidade_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
