package srm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import srm.dto.RespostaDto;
import srm.dto.empresa.EmpresaBuscarDto;
import srm.dto.empresa.EmpresaCriarDto;
import srm.service.EmpresaService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping
    public ResponseEntity<RespostaDto<UUID>> criar(@RequestBody EmpresaCriarDto dto) {
        RespostaDto<UUID> resposta = empresaService.criar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaBuscarDto> buscarPorId(@PathVariable UUID id) {
        EmpresaBuscarDto empresa = empresaService.buscarPorId(id);

        return ResponseEntity.ok(empresa);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaBuscarDto>> listar() {
        List<EmpresaBuscarDto> empresas = empresaService.listar();

        return ResponseEntity.ok(empresas);
    }
}