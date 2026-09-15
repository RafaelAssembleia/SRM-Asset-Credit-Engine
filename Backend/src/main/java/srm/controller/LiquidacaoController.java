package srm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import srm.dto.RespostaDto;
import srm.dto.liquidacao.LiquidacaoBuscarDto;
import srm.dto.liquidacao.LiquidacaoCriarDto;
import srm.service.LiquidacaoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/liquidacoes")
public class LiquidacaoController {

    private final LiquidacaoService liquidacaoService;

    public LiquidacaoController(LiquidacaoService liquidacaoService) {
        this.liquidacaoService = liquidacaoService;
    }

    @PostMapping
    public ResponseEntity<RespostaDto<UUID>> criar(
            @RequestBody LiquidacaoCriarDto dto
    ) {
        RespostaDto<UUID> resposta = liquidacaoService.criar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LiquidacaoBuscarDto> buscarPorId(
            @PathVariable UUID id
    ) {
        LiquidacaoBuscarDto liquidacao =
                liquidacaoService.buscarPorId(id);

        return ResponseEntity.ok(liquidacao);
    }

    @GetMapping
    public ResponseEntity<List<LiquidacaoBuscarDto>> listar() {
        List<LiquidacaoBuscarDto> liquidacoes =
                liquidacaoService.listar();

        return ResponseEntity.ok(liquidacoes);
    }
}