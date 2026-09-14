package srm.dto.empresa;

import java.time.LocalDateTime;
import java.util.UUID;

public record EmpresaBuscarDto(
        UUID id,
        String razaoSocial,
        String cnpj,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao
) {
}