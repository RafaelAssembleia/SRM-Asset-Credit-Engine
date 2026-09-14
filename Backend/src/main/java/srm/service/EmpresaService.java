package srm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm.dto.empresa.EmpresaCriarDto;
import srm.dto.empresa.EmpresaBuscarDto;
import srm.entity.Empresa;
import srm.exception.RegraNegocioException;
import srm.exception.RecursoNaoEncontradoException;
import srm.repository.EmpresaRepository;

import java.util.List;
import java.util.UUID;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Transactional
    public UUID criar(EmpresaCriarDto dto) {

        if (dto == null)
            throw new RegraNegocioException(
                    "Os dados da empresa são obrigatórios."
            );

        if (dto.razaoSocial() == null || dto.razaoSocial().isBlank())
            throw new RegraNegocioException(
                    "A razão social é obrigatória."
            );

        if (dto.cnpj() == null || dto.cnpj().isBlank())
            throw new RegraNegocioException(
                    "O CNPJ é obrigatório."
            );

        String cnpj = normalizarCnpj(dto.cnpj());

        if (cnpj.length() != 14)
            throw new RegraNegocioException(
                    "O CNPJ deve possuir 14 dígitos."
            );

        if (empresaRepository.existsByCnpj(cnpj)) {
            throw new RegraNegocioException(
                    "Já existe uma empresa cadastrada com este CNPJ."
            );
        }

        Empresa empresa = new Empresa(
                dto.razaoSocial().trim(),
                cnpj
        );

        Empresa empresaSalva = empresaRepository.save(empresa);

        return empresaSalva.getId();
    }

    private String normalizarCnpj(String cnpj) {
        return cnpj.replaceAll("\\D", "");
    }

    @Transactional(readOnly = true)
    public EmpresaBuscarDto buscarPorId(UUID id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Empresa não encontrada."
                        )
                );

        return converterParaDto(empresa);
    }

    @Transactional(readOnly = true)
    public List<EmpresaBuscarDto> listar() {
        return empresaRepository.findAll()
                .stream()
                .map(this::converterParaDto)
                .toList();
    }

    private EmpresaBuscarDto converterParaDto(Empresa empresa) {
        return new EmpresaBuscarDto(
                empresa.getId(),
                empresa.getRazaoSocial(),
                empresa.getCnpj(),
                empresa.getDataCadastro(),
                empresa.getDataAtualizacao()
        );
    }
}