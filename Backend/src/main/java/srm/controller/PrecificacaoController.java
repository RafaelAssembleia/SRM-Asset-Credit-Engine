package srm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import srm.dto.precificacao.PrecificacaoResultadoDto;
import srm.dto.precificacao.PrecificacaoSimularDto;
import srm.service.PrecificacaoService;

@RestController
@RequestMapping("/api/precificacoes")
public class PrecificacaoController {

    private final PrecificacaoService precificacaoService;

    public PrecificacaoController(
            PrecificacaoService precificacaoService
    ) {
        this.precificacaoService = precificacaoService;
    }

    @PostMapping("/simular")
    public ResponseEntity<PrecificacaoResultadoDto> simular(
            @RequestBody PrecificacaoSimularDto dto
    ) {
        PrecificacaoResultadoDto resultado = precificacaoService.simular(dto);

        return ResponseEntity.ok(resultado);
    }
}