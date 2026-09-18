// Espelha srm.dto.RespostaDto<T>
export interface RespostaDto<T> {
  mensagem: string;
  id: T;
  sucesso: boolean;
}
