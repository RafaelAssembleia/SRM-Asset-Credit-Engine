package srm.dto.recebivel;

import srm.enums.Moeda;
import srm.enums.SituacaoRecebivel;
import srm.enums.TipoRecebivel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record RecebivelBuscarDto(
        UUID id,
        UUID empresaCedenteId,
        UUID empresaDevedoraId,
        TipoRecebivel tipo,
        BigDecimal valorFace,
        Moeda moeda,
        LocalDate dataVencimento,
        SituacaoRecebivel situacao,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao
) {
}