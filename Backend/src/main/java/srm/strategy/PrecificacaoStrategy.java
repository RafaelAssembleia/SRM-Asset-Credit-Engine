package srm.strategy;

import srm.enums.TipoRecebivel;

import java.math.BigDecimal;

public interface PrecificacaoStrategy {

    TipoRecebivel getTipoRecebivel();

    BigDecimal getSpread();
}