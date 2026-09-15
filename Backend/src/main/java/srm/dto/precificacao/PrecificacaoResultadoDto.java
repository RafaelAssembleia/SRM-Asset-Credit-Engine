package srm.dto.precificacao;

import srm.enums.Moeda;

import java.math.BigDecimal;
import java.util.UUID;

public record PrecificacaoResultadoDto(
        BigDecimal valorFace,
        BigDecimal taxaBase,
        BigDecimal spread,
        Integer prazoMeses,
        BigDecimal valorPresente,
        BigDecimal valorDesagio,
        Moeda moedaPagamento,
        UUID idTaxaCambio,
        BigDecimal taxaCambio,
        BigDecimal valorPagamento
) {
}