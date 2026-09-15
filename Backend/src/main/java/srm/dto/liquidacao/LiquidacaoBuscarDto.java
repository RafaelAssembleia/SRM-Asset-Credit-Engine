package srm.dto.liquidacao;

import srm.enums.Moeda;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record LiquidacaoBuscarDto(
        UUID id,
        UUID recebivelId,
        UUID idTaxaCambio,
        String chaveIdempotencia,
        BigDecimal valorFace,
        BigDecimal taxaBase,
        BigDecimal spread,
        Integer prazoMeses,
        BigDecimal valorPresente,
        BigDecimal valorDesagio,
        Moeda moedaPagamento,
        BigDecimal taxaCambio,
        BigDecimal valorPagamento,
        LocalDateTime dataLiquidacao,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao
) {
}