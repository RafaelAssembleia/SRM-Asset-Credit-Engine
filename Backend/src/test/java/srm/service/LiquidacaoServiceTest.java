package srm.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import srm.dto.RespostaDto;
import srm.dto.liquidacao.LiquidacaoCriarDto;
import srm.entity.Liquidacao;
import srm.entity.Recebivel;
import srm.enums.Moeda;
import srm.repository.LiquidacaoRepository;
import srm.repository.RecebivelRepository;
import srm.strategy.PrecificacaoStrategy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LiquidacaoServiceTest {

    private LiquidacaoRepository liquidacaoRepository;
    private RecebivelRepository recebivelRepository;
    private PrecificacaoService precificacaoService;
    private LiquidacaoService liquidacaoService;

    @BeforeEach
    void setUp() {
        liquidacaoRepository = mock(LiquidacaoRepository.class);
        recebivelRepository = mock(RecebivelRepository.class);
        precificacaoService = mock(PrecificacaoService.class);

        liquidacaoService = new LiquidacaoService(
                liquidacaoRepository,
                recebivelRepository,
                precificacaoService
        );
    }

    @Test
    void deveRetornarLiquidacaoExistenteQuandoChaveIdempotenciaForRepetida() {

        UUID recebivelId = UUID.randomUUID();
        UUID liquidacaoId = UUID.randomUUID();

        LiquidacaoCriarDto dto = new LiquidacaoCriarDto(
                recebivelId,
                Moeda.BRL,
                "liq-001"
        );

        Recebivel recebivel = mock(Recebivel.class);
        Liquidacao liquidacaoExistente = mock(Liquidacao.class);

        when(recebivel.getId())
                .thenReturn(recebivelId);

        when(liquidacaoExistente.getId())
                .thenReturn(liquidacaoId);

        when(liquidacaoExistente.getRecebivel())
                .thenReturn(recebivel);

        when(liquidacaoExistente.getMoedaPagamento())
                .thenReturn(Moeda.BRL);

        when(liquidacaoRepository.findByChaveIdempotencia("liq-001"))
                .thenReturn(Optional.of(liquidacaoExistente));

        RespostaDto<UUID> resposta = liquidacaoService.criar(dto);

        assertEquals(
                "Liquidação já processada.",
                resposta.mensagem()
        );

        assertEquals(
                liquidacaoId,
                resposta.id()
        );

        assertTrue(resposta.sucesso());

        verify(liquidacaoRepository, never())
                .save(any(Liquidacao.class));

        verify(recebivelRepository, never())
                .findById(any(UUID.class));

        verify(precificacaoService, never())
                .calcular(
                        any(PrecificacaoStrategy.class),
                        any(BigDecimal.class),
                        any(Moeda.class),
                        any(Moeda.class),
                        any(LocalDateTime.class),
                        any(LocalDate.class)
                );
    }
}