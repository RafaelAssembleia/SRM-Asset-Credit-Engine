package srm.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import srm.dto.precificacao.PrecificacaoResultadoDto;
import srm.dto.taxaCambio.TaxaCambioBuscarDto;
import srm.enums.Moeda;
import srm.strategy.ChequePreDatadoStrategy;
import srm.strategy.DuplicataMercantilStrategy;
import srm.strategy.PrecificacaoStrategy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

class PrecificacaoServiceTest {

    private PrecificacaoService precificacaoService;
    private TaxaCambioService taxaCambioService;

    private PrecificacaoStrategy duplicataStrategy;
    private PrecificacaoStrategy chequeStrategy;

    @BeforeEach
    void setUp() {

        taxaCambioService = mock(TaxaCambioService.class);

        duplicataStrategy = new DuplicataMercantilStrategy();

        chequeStrategy = new ChequePreDatadoStrategy();

        List<PrecificacaoStrategy> strategies = List.of(
                duplicataStrategy,
                chequeStrategy
        );

        precificacaoService = new PrecificacaoService(
                taxaCambioService,
                strategies
        );
    }

    @Test
    void deveCalcularDuplicataMercantilEmBrl() {

        LocalDateTime dataReferencia = LocalDateTime.of(
                2026,
                9,
                15,
                10,
                0
        );

        LocalDate dataVencimento = LocalDate.of(
                2026,
                12,
                15
        );

        PrecificacaoResultadoDto resultado = precificacaoService.calcular(
                duplicataStrategy,
                new BigDecimal("100000.00"),
                Moeda.BRL,
                Moeda.BRL,
                dataReferencia,
                dataVencimento
        );

        assertEquals(
                3,
                resultado.prazoMeses()
        );

        assertEquals(
                new BigDecimal("0.015"),
                resultado.spread()
        );

        assertEquals(
                new BigDecimal("92859.94"),
                resultado.valorPresente()
        );

        assertEquals(
                new BigDecimal("7140.06"),
                resultado.valorDesagio()
        );

        assertEquals(
                new BigDecimal("92859.94"),
                resultado.valorPagamento()
        );

        assertNull(resultado.idTaxaCambio());
        assertNull(resultado.taxaCambio());
    }

    @Test
    void deveCalcularChequePreDatadoEmBrl() {

        LocalDateTime dataReferencia = LocalDateTime.of(
                2026,
                9,
                15,
                10,
                0
        );

        LocalDate dataVencimento = LocalDate.of(
                2026,
                11,
                15
        );

        PrecificacaoResultadoDto resultado = precificacaoService.calcular(
                chequeStrategy,
                new BigDecimal("25000.00"),
                Moeda.BRL,
                Moeda.BRL,
                dataReferencia,
                dataVencimento
        );

        assertEquals(
                2,
                resultado.prazoMeses()
        );

        assertEquals(
                new BigDecimal("0.025"),
                resultado.spread()
        );

        assertEquals(
                new BigDecimal("23337.77"),
                resultado.valorPresente()
        );

        assertEquals(
                new BigDecimal("1662.23"),
                resultado.valorDesagio()
        );

        assertEquals(
                new BigDecimal("23337.77"),
                resultado.valorPagamento()
        );

        assertNull(resultado.idTaxaCambio());
        assertNull(resultado.taxaCambio());
    }

    @Test
    void deveCalcularDuplicataMercantilEmUsd() {

        LocalDateTime dataReferencia = LocalDateTime.of(
                2026,
                9,
                15,
                10,
                0
        );

        LocalDate dataVencimento = LocalDate.of(
                2026,
                12,
                15
        );

        UUID idTaxaCambio = UUID.randomUUID();

        TaxaCambioBuscarDto taxaVigente = mock(TaxaCambioBuscarDto.class);

        when(taxaVigente.id())
                .thenReturn(idTaxaCambio);

        when(taxaVigente.taxa())
                .thenReturn(
                        new BigDecimal("5.4321")
                );

        when(taxaCambioService.buscarTaxaVigente(
                Moeda.USD,
                Moeda.BRL,
                dataReferencia
        )).thenReturn(taxaVigente);

        PrecificacaoResultadoDto resultado = precificacaoService.calcular(
                duplicataStrategy,
                new BigDecimal("100000.00"),
                Moeda.BRL,
                Moeda.USD,
                dataReferencia,
                dataVencimento
        );

        assertEquals(
                3,
                resultado.prazoMeses()
        );

        assertEquals(
                new BigDecimal("92859.94"),
                resultado.valorPresente()
        );

        assertEquals(
                new BigDecimal("7140.06"),
                resultado.valorDesagio()
        );

        assertEquals(
                idTaxaCambio,
                resultado.idTaxaCambio()
        );

        assertEquals(
                new BigDecimal("5.4321"),
                resultado.taxaCambio()
        );

        assertEquals(
                new BigDecimal("17094.67"),
                resultado.valorPagamento()
        );

        assertEquals(
                Moeda.USD,
                resultado.moedaPagamento()
        );

        verify(taxaCambioService)
                .buscarTaxaVigente(
                        Moeda.USD,
                        Moeda.BRL,
                        dataReferencia
                );
    }
}