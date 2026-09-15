package srm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm.dto.precificacao.PrecificacaoResultadoDto;
import srm.dto.precificacao.PrecificacaoSimularDto;
import srm.dto.taxaCambio.TaxaCambioBuscarDto;
import srm.entity.Recebivel;
import srm.enums.Moeda;
import srm.exception.RegraNegocioException;
import srm.exception.RecursoNaoEncontradoException;
import srm.repository.RecebivelRepository;
import srm.strategy.PrecificacaoStrategy;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PrecificacaoService {

    private static final BigDecimal TAXA_BASE = new BigDecimal("0.01");

    private static final int CASAS_MONETARIAS = 2;

    private static final RoundingMode ARREDONDAMENTO = RoundingMode.HALF_EVEN;

    private final RecebivelRepository recebivelRepository;
    private final TaxaCambioService taxaCambioService;
    private final List<PrecificacaoStrategy> strategies;

    public PrecificacaoService(
            RecebivelRepository recebivelRepository,
            TaxaCambioService taxaCambioService,
            List<PrecificacaoStrategy> strategies
    ) {
        this.recebivelRepository = recebivelRepository;
        this.taxaCambioService = taxaCambioService;
        this.strategies = strategies;
    }

    @Transactional(readOnly = true)
    public PrecificacaoResultadoDto simular(
            PrecificacaoSimularDto dto
    ) {

        if (dto == null)
            throw new RegraNegocioException(
                    "Os dados da precificação são obrigatórios."
            );

        if (dto.recebivelId() == null)
            throw new RegraNegocioException(
                    "O recebível é obrigatório."
            );

        if (dto.moedaPagamento() == null)
            throw new RegraNegocioException(
                    "A moeda de pagamento é obrigatória."
            );

        Recebivel recebivel = recebivelRepository
                .findById(dto.recebivelId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Recebível não encontrado."
                        )
                );

        return calcular(
                recebivel,
                dto.moedaPagamento(),
                LocalDateTime.now()
        );
    }

    public PrecificacaoResultadoDto calcular(
            Recebivel recebivel,
            Moeda moedaPagamento,
            LocalDateTime dataReferencia
    ) {

        int prazoMeses = calcularPrazoMeses(
                recebivel,
                dataReferencia
        );

        PrecificacaoStrategy strategy = buscarStrategy(recebivel);

        BigDecimal spread = strategy.getSpread();

        BigDecimal fator = BigDecimal.ONE
                .add(TAXA_BASE)
                .add(spread)
                .pow(prazoMeses);

        BigDecimal valorPresente = recebivel
                .getValorFace()
                .divide(
                        fator,
                        MathContext.DECIMAL128
                )
                .setScale(
                        CASAS_MONETARIAS,
                        ARREDONDAMENTO
                );

        BigDecimal valorDesagio = recebivel
                .getValorFace()
                .subtract(valorPresente)
                .setScale(
                        CASAS_MONETARIAS,
                        ARREDONDAMENTO
                );

        BigDecimal taxaCambio = null;
        BigDecimal valorPagamento = valorPresente;

        if (recebivel.getMoeda() != moedaPagamento) {

            if (recebivel.getMoeda() == Moeda.BRL
                    && moedaPagamento == Moeda.USD) {

                TaxaCambioBuscarDto taxaVigente =
                        taxaCambioService.buscarTaxaVigente(
                                Moeda.USD,
                                Moeda.BRL,
                                dataReferencia
                        );

                taxaCambio = taxaVigente.taxa();

                valorPagamento = valorPresente
                        .divide(
                                taxaCambio,
                                MathContext.DECIMAL128
                        )
                        .setScale(
                                CASAS_MONETARIAS,
                                ARREDONDAMENTO
                        );

            } else {
                throw new RegraNegocioException(
                        "Conversão entre as moedas informadas não suportada."
                );
            }
        }

        return new PrecificacaoResultadoDto(
                recebivel.getValorFace(),
                TAXA_BASE,
                spread,
                prazoMeses,
                valorPresente,
                valorDesagio,
                moedaPagamento,
                taxaCambio,
                valorPagamento
        );
    }

    private PrecificacaoStrategy buscarStrategy(
            Recebivel recebivel
    ) {

        return strategies.stream()
                .filter(strategy ->
                        strategy.getTipoRecebivel() == recebivel.getTipo()
                )
                .findFirst()
                .orElseThrow(() ->
                        new RegraNegocioException(
                                "Estratégia de precificação não encontrada para o tipo do recebível."
                        )
                );
    }

    private int calcularPrazoMeses(
            Recebivel recebivel,
            LocalDateTime dataReferencia
    ) {

        long prazoMeses = ChronoUnit.MONTHS.between(
                dataReferencia.toLocalDate(),
                recebivel.getDataVencimento()
        );

        if (prazoMeses < 0)
            throw new RegraNegocioException(
                    "Não é possível precificar um recebível vencido."
            );

        return Math.toIntExact(prazoMeses);
    }
}