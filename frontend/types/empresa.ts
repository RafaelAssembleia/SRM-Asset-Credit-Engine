// Espelha srm.dto.empresa.*

export interface EmpresaCriarDto {
  razaoSocial: string;
  cnpj: string;
}

export interface EmpresaBuscarDto {
  id: string;
  razaoSocial: string;
  cnpj: string;
  dataCadastro: string;
  dataAtualizacao: string;
}
