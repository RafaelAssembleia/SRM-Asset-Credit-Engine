package srm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm.dto.RespostaDto;
import srm.dto.taxaCambio.TaxaCambioBuscarDto;
import srm.dto.taxaCambio.TaxaCambioCriarDto;
import srm.entity.TaxaCambio;
import srm.enums.Moeda;
import srm.exception.RegraNegocioException;
import srm.exception.RecursoNaoEncontradoException;
import srm.repository.TaxaCambioRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaxaCambioService {

    private final TaxaCambioRepository taxaCambioRepository;

    public TaxaCambioService(TaxaCambioRepository taxaCambioRepository) {
        this.taxaCambioRepository = taxaCambioRepository;
    }

    @Transactional
    public RespostaDto<UUID> criar(TaxaCambioCriarDto dto) {

        if (dto == null)
            throw new RegraNegocioException(
                    "Os dados da taxa de câmbio são obrigatórios."
            );

        if (dto.moedaOrigem() == null)
            throw new RegraNegocioException(
                    "A moeda de origem é obrigatória."
            );

        if (dto.moedaDestino() == null)
            throw new RegraNegocioException(
                    "A moeda de destino é obrigatória."
            );

        if (dto.taxa() == null)
            throw new RegraNegocioException(
                    "A taxa de câmbio é obrigatória."
            );

        if (dto.taxa().compareTo(BigDecimal.ZERO) <= 0)
            throw new RegraNegocioException(
                    "A taxa de câmbio deve ser maior que zero."
            );

        if (dto.dataVigencia() == null)
            throw new RegraNegocioException(
                    "A data de vigência é obrigatória."
            );

        TaxaCambio taxaCambio = new TaxaCambio(
                dto.moedaOrigem(),
                dto.moedaDestino(),
                dto.taxa(),
                dto.dataVigencia()
        );

        TaxaCambio taxaCambioSalva = taxaCambioRepository.save(taxaCambio);

        return new RespostaDto<>(
                "Taxa de câmbio criada com sucesso.",
                taxaCambioSalva.getId(),
                true
        );
    }

    @Transactional(readOnly = true)
    public TaxaCambioBuscarDto buscarPorId(UUID id) {

        TaxaCambio taxaCambio = taxaCambioRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Taxa de câmbio não encontrada."
                        )
                );

        return converterParaDto(taxaCambio);
    }

    @Transactional(readOnly = true)
    public List<TaxaCambioBuscarDto> listar() {
        return taxaCambioRepository.findAll()
                .stream()
                .map(this::converterParaDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaxaCambioBuscarDto buscarTaxaVigente(
            Moeda moedaOrigem,
            Moeda moedaDestino,
            LocalDateTime dataReferencia
    ) {

        if (moedaOrigem == null)
            throw new RegraNegocioException(
                    "A moeda de origem é obrigatória."
            );

        if (moedaDestino == null)
            throw new RegraNegocioException(
                    "A moeda de destino é obrigatória."
            );

        if (dataReferencia == null)
            throw new RegraNegocioException(
                    "A data de referência é obrigatória."
            );

        TaxaCambio taxaCambio = taxaCambioRepository
                .findTopByMoedaOrigemAndMoedaDestinoAndDataVigenciaLessThanEqualOrderByDataVigenciaDesc(
                        moedaOrigem,
                        moedaDestino,
                        dataReferencia
                )
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Taxa de câmbio vigente não encontrada."
                        )
                );

        return converterParaDto(taxaCambio);
    }

    private TaxaCambioBuscarDto converterParaDto(TaxaCambio taxaCambio) {
        return new TaxaCambioBuscarDto(
                taxaCambio.getId(),
                taxaCambio.getMoedaOrigem(),
                taxaCambio.getMoedaDestino(),
                taxaCambio.getTaxa(),
                taxaCambio.getDataVigencia(),
                taxaCambio.getDataCadastro(),
                taxaCambio.getDataAtualizacao()
        );
    }
}