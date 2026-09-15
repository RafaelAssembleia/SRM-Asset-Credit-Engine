package srm.dto.precificacao;

import srm.enums.Moeda;

import java.math.BigDecimal;

public record PrecificacaoResultadoDto(
        BigDecimal valorFace,
        BigDecimal taxaBase,
        BigDecimal spread,
        Integer prazoMeses,
        BigDecimal valorPresente,
        BigDecimal valorDesagio,
        Moeda moedaPagamento,
        BigDecimal taxaCambio,
        BigDecimal valorPagamento
) {
}