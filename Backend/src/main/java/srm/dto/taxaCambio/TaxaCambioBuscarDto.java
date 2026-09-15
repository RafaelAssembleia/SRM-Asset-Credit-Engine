package srm.dto.taxaCambio;

import srm.enums.Moeda;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaxaCambioBuscarDto(
        UUID id,
        Moeda moedaOrigem,
        Moeda moedaDestino,
        BigDecimal taxa,
        LocalDateTime dataVigencia,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao
) {
}