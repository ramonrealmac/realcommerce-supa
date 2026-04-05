import { useEffect, useRef } from "react";
import TopBar from "@/components/layout/TopBar";
import TabBar from "@/components/layout/TabBar";
import SidebarMenu from "@/components/layout/SidebarMenu";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import GrupoProdutosForm from "@/components/forms/GrupoProdutosForm";
import ClienteForm from "@/components/forms/ClienteForm";
import FornecedorTransportadorForm from "@/components/forms/FornecedorTransportadorForm";
import CadastroGrupoForm from "@/components/forms/CadastroGrupoForm";
import CondicaoPagamentoForm from "@/components/forms/CondicaoPagamentoForm";
import PerfilForm from "@/components/forms/PerfilForm";
import ControleAcessoForm from "@/components/forms/ControleAcessoForm";
import UsuarioForm from "@/components/forms/UsuarioForm";
import TrocaSenhaForm from "@/components/forms/TrocaSenhaForm";
import EmpresaForm from "@/components/forms/EmpresaForm";
import CidadeForm from "@/components/forms/CidadeForm";
import RotaForm from "@/components/forms/RotaForm";
import LinhaProdutoForm from "@/components/forms/LinhaProdutoForm";
import UnidadeForm from "@/components/forms/UnidadeForm";
import DepositoForm from "@/components/forms/DepositoForm";
import EstoqueForm from "@/components/forms/EstoqueForm";
import ProdutoForm from "@/components/forms/ProdutoForm";
import AuthGate from "@/components/auth/AuthGate";

const AppContent = () => {
  const { XTabs, XActiveTabId, openTab } = useAppContext();
  const XInitRef = useRef(false);

  const renderTabContent = (component: string) => {
    switch (component) {
      case "GrupoProdutosForm":
      case "grupo-produtos":
        return <GrupoProdutosForm />;
      case "cadastro-completo":
        return <ClienteForm />;
      case "fornecedores-transportadores":
        return <FornecedorTransportadorForm />;
      case "grupo-cadastros":
        return <CadastroGrupoForm />;
      case "cond-pagamento":
        return <CondicaoPagamentoForm />;
      case "PerfilForm":
        return <PerfilForm />;
      case "ControleAcessoForm":
        return <ControleAcessoForm />;
      case "UsuarioForm":
        return <UsuarioForm />;
      case "TrocaSenhaForm":
        return <TrocaSenhaForm />;
      case "empresas":
        return <EmpresaForm />;
      case "cidades":
        return <CidadeForm />;
      case "rotas":
        return <RotaForm />;
      case "linhas-produtos":
        return <LinhaProdutoForm />;
      case "unidades":
        return <UnidadeForm />;
      case "depositos":
        return <DepositoForm />;
      case "estoque":
        return <EstoqueForm />;
      case "produtos":
        return <ProdutoForm />;
      default:
        return <div className="p-4 text-muted-foreground">Componente não encontrado.</div>;
    }
  };

  useEffect(() => {
    if (!XInitRef.current) {
      XInitRef.current = true;
      openTab({ title: "Grupos de Produtos", component: "GrupoProdutosForm" });
    }
  }, [openTab]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <TabBar />
      <SidebarMenu />
      <div className="flex-1 overflow-hidden">
        {XTabs.map(tab => (
          <div
            key={tab.id}
            className={`h-full ${tab.id === XActiveTabId ? "block" : "hidden"}`}
          >
            {renderTabContent(tab.component)}
          </div>
        ))}
        {XTabs.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Use o menu para abrir um formulário.
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <AuthGateWrapper />
    </AppProvider>
  );
};

const AuthGateWrapper = () => {
  const { setXEmpresaId, setXEmpresas } = useAppContext();

  return (
    <AuthGate
      onEmpresaSelected={(empresa, allEmpresas) => {
        setXEmpresaId(empresa.empresa_id);
        setXEmpresas(allEmpresas);
      }}
    >
      <AppContent />
    </AuthGate>
  );
};

export default Index;
