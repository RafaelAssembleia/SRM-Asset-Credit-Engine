import { api } from "@/lib/api";
import type { RespostaDto } from "@/types/resposta";
import type { LiquidacaoBuscarDto, LiquidacaoCriarDto } from "@/types/liquidacao";

const BASE = "/api/liquidacoes";

export const liquidacaoService = {
  criar: (dto: LiquidacaoCriarDto) =>
    api.post<RespostaDto<string>>(BASE, dto),

  buscarPorId: (id: string) => api.get<LiquidacaoBuscarDto>(`${BASE}/${id}`),

  listar: () => api.get<LiquidacaoBuscarDto[]>(BASE),
};
