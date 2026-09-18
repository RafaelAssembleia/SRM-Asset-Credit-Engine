import { api } from "@/lib/api";
import type { RespostaDto } from "@/types/resposta";
import type { EmpresaBuscarDto, EmpresaCriarDto } from "@/types/empresa";

const BASE = "/api/empresas";

export const empresaService = {
  criar: (dto: EmpresaCriarDto) =>
    api.post<RespostaDto<string>>(BASE, dto),

  buscarPorId: (id: string) => api.get<EmpresaBuscarDto>(`${BASE}/${id}`),

  listar: () => api.get<EmpresaBuscarDto[]>(BASE),
};
