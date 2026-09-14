package srm.dto.recebivel;

import srm.enums.Moeda;
import srm.enums.TipoRecebivel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record RecebivelCriarDto(
        UUID empresaCedenteId,
        UUID empresaDevedoraId,
        TipoRecebivel tipo,
        BigDecimal valorFace,
        Moeda moeda,
        LocalDate dataVencimento
) {
}