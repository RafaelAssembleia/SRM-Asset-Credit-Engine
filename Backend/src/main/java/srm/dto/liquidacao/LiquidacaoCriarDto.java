package srm.dto.liquidacao;

import srm.enums.Moeda;

import java.util.UUID;

public record LiquidacaoCriarDto(
        UUID recebivelId,
        Moeda moedaPagamento,
        String chaveIdempotencia
) {
}