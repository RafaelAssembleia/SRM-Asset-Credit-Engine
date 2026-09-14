package srm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm.dto.RespostaDto;
import srm.dto.recebivel.RecebivelBuscarDto;
import srm.dto.recebivel.RecebivelCriarDto;
import srm.entity.Empresa;
import srm.entity.Recebivel;
import srm.exception.RegraNegocioException;
import srm.exception.RecursoNaoEncontradoException;
import srm.repository.EmpresaRepository;
import srm.repository.RecebivelRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class RecebivelService {

    private final RecebivelRepository recebivelRepository;
    private final EmpresaRepository empresaRepository;

    public RecebivelService(
            RecebivelRepository recebivelRepository,
            EmpresaRepository empresaRepository
    ) {
        this.recebivelRepository = recebivelRepository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional
    public RespostaDto<UUID> criar(RecebivelCriarDto dto) {

        if (dto == null)
            throw new RegraNegocioException(
                    "Os dados do recebível são obrigatórios."
            );

        if (dto.empresaCedenteId() == null)
            throw new RegraNegocioException(
                    "A empresa cedente é obrigatória."
            );

        if (dto.empresaDevedoraId() == null)
            throw new RegraNegocioException(
                    "A empresa devedora é obrigatória."
            );

        if (dto.tipo() == null)
            throw new RegraNegocioException(
                    "O tipo do recebível é obrigatório."
            );

        if (dto.valorFace() == null)
            throw new RegraNegocioException(
                    "O valor de face é obrigatório."
            );

        if (dto.valorFace().compareTo(BigDecimal.ZERO) <= 0)
            throw new RegraNegocioException(
                    "O valor de face deve ser maior que zero."
            );

        if (dto.moeda() == null)
            throw new RegraNegocioException(
                    "A moeda é obrigatória."
            );

        if (dto.dataVencimento() == null)
            throw new RegraNegocioException(
                    "A data de vencimento é obrigatória."
            );

        Empresa empresaCedente = empresaRepository
                .findById(dto.empresaCedenteId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Empresa cedente não encontrada."
                        )
                );

        Empresa empresaDevedora = empresaRepository
                .findById(dto.empresaDevedoraId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Empresa devedora não encontrada."
                        )
                );

        Recebivel recebivel = new Recebivel(
                empresaCedente,
                empresaDevedora,
                dto.tipo(),
                dto.valorFace(),
                dto.moeda(),
                dto.dataVencimento()
        );

        Recebivel recebivelSalvo = recebivelRepository.save(recebivel);

        return new RespostaDto<>(
                "Recebível criado com sucesso.",
                recebivelSalvo.getId(),
                true
        );
    }

    @Transactional(readOnly = true)
    public RecebivelBuscarDto buscarPorId(UUID id) {
        Recebivel recebivel = recebivelRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Recebível não encontrado."
                        )
                );

        return converterParaDto(recebivel);
    }

    @Transactional(readOnly = true)
    public List<RecebivelBuscarDto> listar() {
        return recebivelRepository.findAll()
                .stream()
                .map(this::converterParaDto)
                .toList();
    }

    private RecebivelBuscarDto converterParaDto(Recebivel recebivel) {
        return new RecebivelBuscarDto(
                recebivel.getId(),
                recebivel.getEmpresaCedente().getId(),
                recebivel.getEmpresaDevedora().getId(),
                recebivel.getTipo(),
                recebivel.getValorFace(),
                recebivel.getMoeda(),
                recebivel.getDataVencimento(),
                recebivel.getSituacao(),
                recebivel.getDataCadastro(),
                recebivel.getDataAtualizacao()
        );
    }
}