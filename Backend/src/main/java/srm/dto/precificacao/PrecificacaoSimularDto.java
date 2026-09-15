package srm.dto.precificacao;

import srm.enums.Moeda;

import java.util.UUID;

public record PrecificacaoSimularDto(
        UUID recebivelId,
        Moeda moedaPagamento
) {
}