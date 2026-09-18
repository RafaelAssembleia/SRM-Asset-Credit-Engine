package srm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm.dto.RespostaDto;
import srm.dto.liquidacao.LiquidacaoBuscarDto;
import srm.dto.liquidacao.LiquidacaoCriarDto;
import srm.dto.precificacao.PrecificacaoResultadoDto;
import srm.entity.Liquidacao;
import srm.entity.Recebivel;
import srm.enums.SituacaoRecebivel;
import srm.exception.RegraNegocioException;
import srm.exception.RecursoNaoEncontradoException;
import srm.repository.LiquidacaoRepository;
import srm.repository.RecebivelRepository;
import srm.strategy.PrecificacaoStrategy;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LiquidacaoService {

    private final LiquidacaoRepository liquidacaoRepository;
    private final RecebivelRepository recebivelRepository;
    private final PrecificacaoService precificacaoService;

    public LiquidacaoService(
            LiquidacaoRepository liquidacaoRepository,
            RecebivelRepository recebivelRepository,
            PrecificacaoService precificacaoService
    ) {
        this.liquidacaoRepository = liquidacaoRepository;
        this.recebivelRepository = recebivelRepository;
        this.precificacaoService = precificacaoService;
    }

    @Transactional
    public RespostaDto<UUID> criar(LiquidacaoCriarDto dto) {

        if (dto == null)
            throw new RegraNegocioException(
                    "Os dados da liquidação são obrigatórios."
            );

        if (dto.recebivelId() == null)
            throw new RegraNegocioException(
                    "O recebível é obrigatório."
            );

        if (dto.moedaPagamento() == null)
            throw new RegraNegocioException(
                    "A moeda de pagamento é obrigatória."
            );

        if (dto.chaveIdempotencia() == null
                || dto.chaveIdempotencia().isBlank())
            throw new RegraNegocioException(
                    "A chave de idempotência é obrigatória."
            );

        if (dto.chaveIdempotencia().length() > 100)
            throw new RegraNegocioException(
                    "A chave de idempotência deve possuir no máximo 100 caracteres."
            );

        Optional<Liquidacao> liquidacaoExistente = liquidacaoRepository.findByChaveIdempotencia(
                dto.chaveIdempotencia()
        );

        if (liquidacaoExistente.isPresent()) {

            Liquidacao liquidacao = liquidacaoExistente.get();

            boolean mesmoRecebivel = liquidacao.getRecebivel()
                    .getId()
                    .equals(dto.recebivelId());

            boolean mesmaMoeda = liquidacao.getMoedaPagamento() == dto.moedaPagamento();

            if (!mesmoRecebivel || !mesmaMoeda)
                throw new RegraNegocioException(
                        "A chave de idempotência já foi utilizada em outra operação."
                );

            return new RespostaDto<>(
                    "Liquidação já processada.",
                    liquidacao.getId(),
                    true
            );
        }

        Recebivel recebivel = recebivelRepository
                .findById(dto.recebivelId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Recebível não encontrado."
                        )
                );

        if (recebivel.getSituacao() != SituacaoRecebivel.PENDENTE)
            throw new RegraNegocioException(
                    "O recebível já foi liquidado."
            );

        LocalDateTime dataLiquidacao = LocalDateTime.now();

        PrecificacaoStrategy strategy = precificacaoService.buscarStrategy(recebivel.getTipo());

        PrecificacaoResultadoDto precificacao = precificacaoService.calcular(
                strategy,
                recebivel.getValorFace(),
                recebivel.getMoeda(),
                dto.moedaPagamento(),
                dataLiquidacao,
                recebivel.getDataVencimento()
        );

        Liquidacao liquidacao = new Liquidacao(
                recebivel,
                precificacao.idTaxaCambio(),
                dto.chaveIdempotencia().trim(),
                precificacao.valorFace(),
                precificacao.taxaBase(),
                precificacao.spread(),
                precificacao.prazoMeses(),
                precificacao.valorPresente(),
                precificacao.valorDesagio(),
                precificacao.moedaPagamento(),
                precificacao.taxaCambio(),
                precificacao.valorPagamento(),
                dataLiquidacao
        );

        Liquidacao liquidacaoSalva = liquidacaoRepository.save(liquidacao);

        recebivel.liquidar();

        recebivelRepository.save(recebivel);

        return new RespostaDto<>(
                "Liquidação realizada com sucesso.",
                liquidacaoSalva.getId(),
                true
        );
    }

    @Transactional(readOnly = true)
    public LiquidacaoBuscarDto buscarPorId(UUID id) {

        Liquidacao liquidacao = liquidacaoRepository
                .findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Liquidação não encontrada."
                        )
                );

        return converterParaDto(liquidacao);
    }

    @Transactional(readOnly = true)
    public List<LiquidacaoBuscarDto> listar() {

        return liquidacaoRepository
                .findAll()
                .stream()
                .map(this::converterParaDto)
                .toList();
    }

    private LiquidacaoBuscarDto converterParaDto(
            Liquidacao liquidacao
    ) {

        return new LiquidacaoBuscarDto(
                liquidacao.getId(),
                liquidacao.getRecebivel().getId(),
                liquidacao.getIdTaxaCambio(),
                liquidacao.getChaveIdempotencia(),
                liquidacao.getValorFace(),
                liquidacao.getTaxaBase(),
                liquidacao.getSpread(),
                liquidacao.getPrazoMeses(),
                liquidacao.getValorPresente(),
                liquidacao.getValorDesagio(),
                liquidacao.getMoedaPagamento(),
                liquidacao.getTaxaCambio(),
                liquidacao.getValorPagamento(),
                liquidacao.getDataLiquidacao(),
                liquidacao.getDataCadastro(),
                liquidacao.getDataAtualizacao()
        );
    }
}