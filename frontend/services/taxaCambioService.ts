import { api } from "@/lib/api";
import type { RespostaDto } from "@/types/resposta";
import type { TaxaCambioBuscarDto, TaxaCambioCriarDto } from "@/types/taxaCambio";
import type { Moeda } from "@/types/enums";

const BASE = "/api/taxas-cambio";

export const taxaCambioService = {
  criar: (dto: TaxaCambioCriarDto) =>
    api.post<RespostaDto<string>>(BASE, dto),

  buscarPorId: (id: string) => api.get<TaxaCambioBuscarDto>(`${BASE}/${id}`),

  listar: () => api.get<TaxaCambioBuscarDto[]>(BASE),

  buscarTaxaVigente: (
    moedaOrigem: Moeda,
    moedaDestino: Moeda,
    dataReferencia: string
  ) => {
    const params = new URLSearchParams({
      moedaOrigem,
      moedaDestino,
      dataReferencia,
    });
    return api.get<TaxaCambioBuscarDto>(`${BASE}/vigente?${params.toString()}`);
  },
};
