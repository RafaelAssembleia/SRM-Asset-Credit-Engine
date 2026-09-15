package srm.dto.taxaCambio;

import srm.enums.Moeda;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TaxaCambioCriarDto(
        Moeda moedaOrigem,
        Moeda moedaDestino,
        BigDecimal taxa,
        LocalDateTime dataVigencia
) {
}