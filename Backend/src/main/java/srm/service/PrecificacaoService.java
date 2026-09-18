package srm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srm.dto.precificacao.PrecificacaoResultadoDto;
import srm.dto.precificacao.PrecificacaoSimularDto;
import srm.dto.taxaCambio.TaxaCambioBuscarDto;
import srm.entity.Recebivel;
import srm.enums.Moeda;
import srm.enums.TipoRecebivel;
import srm.exception.RegraNegocioException;
import srm.exception.RecursoNaoEncontradoException;
import srm.repository.RecebivelRepository;
import srm.strategy.PrecificacaoStrategy;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class PrecificacaoService {

    private static final BigDecimal TAXA_BASE = new BigDecimal("0.01");

    private static final int CASAS_MONETARIAS = 2;

    private static final RoundingMode ARREDONDAMENTO = RoundingMode.HALF_EVEN;

    private final TaxaCambioService taxaCambioService;
    private final List<PrecificacaoStrategy> strategies;

    public PrecificacaoService(
            TaxaCambioService taxaCambioService,
            List<PrecificacaoStrategy> strategies
    ) {
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

        if (dto.moedaPagamento() == null)
            throw new RegraNegocioException(
                    "A moeda de pagamento é obrigatória."
            );

        return calcular(
                buscarStrategy(dto.tipoRecebivel()),
                dto.valorFace(),
                dto.moedaOrigem(),
                dto.moedaPagamento(),
                LocalDateTime.now(),
                dto.dataVencimento()
        );
    }

    public PrecificacaoResultadoDto calcular(
            PrecificacaoStrategy strategy,
            BigDecimal valorFace,
            Moeda moedaOrigem,
            Moeda moedaPagamento,
            LocalDateTime dataReferencia,
            LocalDate dataVencimento
    ) {

        int prazoMeses = calcularPrazoMeses(
                dataVencimento,
                dataReferencia
        );

        BigDecimal spread = strategy.getSpread();

        BigDecimal fator = BigDecimal.ONE
                .add(TAXA_BASE)
                .add(spread)
                .pow(prazoMeses);

        BigDecimal valorPresente = valorFace
                .divide(
                        fator,
                        MathContext.DECIMAL128
                )
                .setScale(
                        CASAS_MONETARIAS,
                        ARREDONDAMENTO
                );

        BigDecimal valorDesagio = valorFace
                .subtract(valorPresente)
                .setScale(
                        CASAS_MONETARIAS,
                        ARREDONDAMENTO
                );

        UUID idTaxaCambio = null;
        BigDecimal taxaCambio = null;
        BigDecimal valorPagamento = valorPresente;

        if (moedaOrigem != moedaPagamento) {

            if (moedaOrigem == Moeda.BRL
                    && moedaPagamento == Moeda.USD) {

                TaxaCambioBuscarDto taxaVigente = taxaCambioService.buscarTaxaVigente(
                        Moeda.USD,
                        Moeda.BRL,
                        dataReferencia
                );

                idTaxaCambio = taxaVigente.id();
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
                valorFace,
                TAXA_BASE,
                spread,
                prazoMeses,
                valorPresente,
                valorDesagio,
                moedaPagamento,
                idTaxaCambio,
                taxaCambio,
                valorPagamento
        );
    }

    public PrecificacaoStrategy buscarStrategy(
            TipoRecebivel tipoRecebivel
    ) {

        return strategies.stream()
                .filter(strategy ->
                        strategy.getTipoRecebivel() == tipoRecebivel
                )
                .findFirst()
                .orElseThrow(() ->
                        new RegraNegocioException(
                                "Estratégia de precificação não encontrada para o tipo do recebível."
                        )
                );
    }

    private int calcularPrazoMeses(
            LocalDate dataVencimento,
            LocalDateTime dataReferencia
    ) {

        long prazoMeses = ChronoUnit.MONTHS.between(
                dataReferencia.toLocalDate(),
                dataVencimento
        );

        if (prazoMeses < 0)
            throw new RegraNegocioException(
                    "Não é possível precificar um recebível vencido."
            );

        return Math.toIntExact(prazoMeses);
    }
}