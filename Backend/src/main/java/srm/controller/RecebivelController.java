package srm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import srm.dto.RespostaDto;
import srm.dto.recebivel.RecebivelBuscarDto;
import srm.dto.recebivel.RecebivelCriarDto;
import srm.service.RecebivelService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recebiveis")
public class RecebivelController {

    private final RecebivelService recebivelService;

    public RecebivelController(RecebivelService recebivelService) {
        this.recebivelService = recebivelService;
    }

    @PostMapping
    public ResponseEntity<RespostaDto<UUID>> criar(@RequestBody RecebivelCriarDto dto) {
        RespostaDto<UUID> resposta = recebivelService.criar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecebivelBuscarDto> buscarPorId(@PathVariable UUID id) {
        RecebivelBuscarDto recebivel = recebivelService.buscarPorId(id);

        return ResponseEntity.ok(recebivel);
    }

    @GetMapping
    public ResponseEntity<List<RecebivelBuscarDto>> listar() {
        List<RecebivelBuscarDto> recebiveis = recebivelService.listar();

        return ResponseEntity.ok(recebiveis);
    }
}