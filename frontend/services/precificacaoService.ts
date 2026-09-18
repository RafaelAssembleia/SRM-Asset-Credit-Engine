import { api } from "@/lib/api";
import type {
  PrecificacaoResultadoDto,
  PrecificacaoSimularDto,
} from "@/types/precificacao";

const BASE = "/api/precificacoes";

export const precificacaoService = {
  simular: (dto: PrecificacaoSimularDto) =>
    api.post<PrecificacaoResultadoDto>(`${BASE}/simular`, dto),
};