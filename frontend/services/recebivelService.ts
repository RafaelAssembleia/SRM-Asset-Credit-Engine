import { api } from "@/lib/api";
import type { RespostaDto } from "@/types/resposta";
import type { RecebivelBuscarDto, RecebivelCriarDto } from "@/types/recebivel";

const BASE = "/api/recebiveis";

export const recebivelService = {
  criar: (dto: RecebivelCriarDto) =>
    api.post<RespostaDto<string>>(BASE, dto),

  buscarPorId: (id: string) => api.get<RecebivelBuscarDto>(`${BASE}/${id}`),

  listar: () => api.get<RecebivelBuscarDto[]>(BASE),
};
