package srm.strategy;

import org.springframework.stereotype.Component;
import srm.enums.TipoRecebivel;

import java.math.BigDecimal;

@Component
public class DuplicataMercantilStrategy implements PrecificacaoStrategy {

    private static final BigDecimal SPREAD = new BigDecimal("0.015");

    @Override
    public TipoRecebivel getTipoRecebivel() {
        return TipoRecebivel.DUPLICATA_MERCANTIL;
    }

    @Override
    public BigDecimal getSpread() {
        return SPREAD;
    }
}