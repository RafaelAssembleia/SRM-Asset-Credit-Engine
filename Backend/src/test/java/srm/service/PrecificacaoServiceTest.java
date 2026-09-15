package srm.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import srm.dto.precificacao.PrecificacaoResultadoDto;
import srm.dto.taxaCambio.TaxaCambioBuscarDto;
import srm.entity.Empresa;
import srm.entity.Recebivel;
import srm.enums.Moeda;
import srm.enums.TipoRecebivel;
import srm.repository.RecebivelRepository;
import srm.strategy.ChequePreDatadoStrategy;
import srm.strategy.DuplicataMercantilStrategy;
import srm.strategy.PrecificacaoStrategy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PrecificacaoServiceTest {

    private PrecificacaoService precificacaoService;
    private TaxaCambioService taxaCambioService;

    private Empresa empresaCedente;
    private Empresa empresaDevedora;

    @BeforeEach
    void setUp() {

        RecebivelRepository recebivelRepository = mock(RecebivelRepository.class);

        taxaCambioService = mock(TaxaCambioService.class);

        List<PrecificacaoStrategy> strategies = List.of(
                new DuplicataMercantilStrategy(),
                new ChequePreDatadoStrategy()
        );

        precificacaoService = new PrecificacaoService(
                recebivelRepository,
                taxaCambioService,
                strategies
        );

        empresaCedente = new Empresa(
                "Empresa Cedente",
                "12345678000190"
        );

        empresaDevedora = new Empresa(
                "Empresa Devedora",
                "98765432000110"
        );
    }

    @Test
    void deveCalcularDuplicataMercantilEmBrl() {

        LocalDateTime dataReferencia = LocalDateTime.of(2026, 9, 14, 10, 0);

        Recebivel recebivel = new Recebivel(
                empresaCedente,
                empresaDevedora,
                TipoRecebivel.DUPLICATA_MERCANTIL,
                new BigDecimal("100000.00"),
                Moeda.BRL,
                LocalDate.of(2026, 12, 14)
        );

        PrecificacaoResultadoDto resultado = precificacaoService.calcular(
                recebivel,
                Moeda.BRL,
                dataReferencia
        );

        assertEquals(
                new BigDecimal("0.015"),
                resultado.spread()
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
                new BigDecimal("92859.94"),
                resultado.valorPagamento()
        );

        assertNull(resultado.taxaCambio());
    }

    @Test
    void deveCalcularChequePreDatadoEmBrl() {

        LocalDateTime dataReferencia = LocalDateTime.of(2026, 9, 14, 10, 0);

        Recebivel recebivel = new Recebivel(
                empresaCedente,
                empresaDevedora,
                TipoRecebivel.CHEQUE_PRE_DATADO,
                new BigDecimal("25000.00"),
                Moeda.BRL,
                LocalDate.of(2026, 11, 14)
        );

        PrecificacaoResultadoDto resultado = precificacaoService.calcular(
                recebivel,
                Moeda.BRL,
                dataReferencia
        );

        assertEquals(
                new BigDecimal("0.025"),
                resultado.spread()
        );

        assertEquals(
                2,
                resultado.prazoMeses()
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

        assertNull(resultado.taxaCambio());
    }

    @Test
    void deveCalcularDuplicataMercantilEmUsd() {

        LocalDateTime dataReferencia = LocalDateTime.of(2026, 9, 14, 10, 0);

        Recebivel recebivel = new Recebivel(
                empresaCedente,
                empresaDevedora,
                TipoRecebivel.DUPLICATA_MERCANTIL,
                new BigDecimal("100000.00"),
                Moeda.BRL,
                LocalDate.of(2026, 12, 14)
        );

        TaxaCambioBuscarDto taxaCambio = mock(TaxaCambioBuscarDto.class);

        when(taxaCambio.taxa())
                .thenReturn(new BigDecimal("5.4321"));

        when(taxaCambioService.buscarTaxaVigente(
                Moeda.USD,
                Moeda.BRL,
                dataReferencia
        )).thenReturn(taxaCambio);

        PrecificacaoResultadoDto resultado = precificacaoService.calcular(
                recebivel,
                Moeda.USD,
                dataReferencia
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