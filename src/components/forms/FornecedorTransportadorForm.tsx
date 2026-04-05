import React from "react";
import CadastroCompletoForm from "./CadastroCompletoForm";

const FornecedorTransportadorForm: React.FC = () => (
  <CadastroCompletoForm
    formTitle="Fornecedores/Transportadores"
    dataFilter={{ st_fornecedor: "S", st_transportador: "S" }}
    filterMode="or"
    defaultValues={{ st_cliente: "N", st_fornecedor: "S", st_transportador: "N" }}
    extraValidation={(form) => {
      if (form.st_fornecedor !== "S" && form.st_transportador !== "S") {
        return "O cadastro deve ser Fornecedor e/ou Transportador. Pelo menos um deve ser 'Sim'.";
      }
      return null;
    }}
    showVeiculoTab
  />
);

export default FornecedorTransportadorForm;
