package srm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import srm.dto.RespostaDto;
import srm.dto.taxaCambio.TaxaCambioBuscarDto;
import srm.dto.taxaCambio.TaxaCambioCriarDto;
import srm.enums.Moeda;
import srm.service.TaxaCambioService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/taxas-cambio")
public class TaxaCambioController {

    private final TaxaCambioService taxaCambioService;

    public TaxaCambioController(TaxaCambioService taxaCambioService) {
        this.taxaCambioService = taxaCambioService;
    }

    @PostMapping
    public ResponseEntity<RespostaDto<UUID>> criar(
            @RequestBody TaxaCambioCriarDto dto
    ) {
        RespostaDto<UUID> resposta = taxaCambioService.criar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaxaCambioBuscarDto> buscarPorId(
            @PathVariable UUID id
    ) {
        TaxaCambioBuscarDto taxaCambio = taxaCambioService.buscarPorId(id);

        return ResponseEntity.ok(taxaCambio);
    }

    @GetMapping
    public ResponseEntity<List<TaxaCambioBuscarDto>> listar() {
        List<TaxaCambioBuscarDto> taxas = taxaCambioService.listar();

        return ResponseEntity.ok(taxas);
    }

    @GetMapping("/vigente")
    public ResponseEntity<TaxaCambioBuscarDto> buscarTaxaVigente(
            @RequestParam Moeda moedaOrigem,
            @RequestParam Moeda moedaDestino,
            @RequestParam LocalDateTime dataReferencia
    ) {
        TaxaCambioBuscarDto taxaCambio = taxaCambioService.buscarTaxaVigente(
                moedaOrigem,
                moedaDestino,
                dataReferencia
        );

        return ResponseEntity.ok(taxaCambio);
    }
}