package srm.dto;

public record RespostaDto<T>(
        String mensagem,
        T id,
        boolean sucesso
) {
}