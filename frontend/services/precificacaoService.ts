import { api } from "@/lib/api";
import type {
  PrecificacaoResultadoDto,
  PrecificacaoSimularDto,
  PrecificacaoSimularRascunhoDto,
} from "@/types/precificacao";

const BASE = "/api/precificacoes";

export const precificacaoService = {
  // simular: (dto: PrecificacaoSimularDto) =>
  //   api.post<PrecificacaoResultadoDto>(`${BASE}/simular`, dto),

  simularRascunho: (dto: PrecificacaoSimularRascunhoDto) =>
    api.post<PrecificacaoResultadoDto>(`${BASE}/simular`, dto),
};