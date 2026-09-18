package srm.dto.precificacao;

import srm.enums.Moeda;
import srm.enums.TipoRecebivel;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PrecificacaoSimularDto(
        TipoRecebivel tipoRecebivel,
        BigDecimal valorFace,
        Moeda moedaOrigem,
        Moeda moedaPagamento,
        LocalDate dataVencimento
) {
}