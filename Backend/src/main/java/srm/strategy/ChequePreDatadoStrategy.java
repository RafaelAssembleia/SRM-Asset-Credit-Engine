package srm.strategy;

import org.springframework.stereotype.Component;
import srm.enums.TipoRecebivel;

import java.math.BigDecimal;

@Component
public class ChequePreDatadoStrategy implements PrecificacaoStrategy {

    private static final BigDecimal SPREAD = new BigDecimal("0.025");

    @Override
    public TipoRecebivel getTipoRecebivel() {
        return TipoRecebivel.CHEQUE_PRE_DATADO;
    }

    @Override
    public BigDecimal getSpread() {
        return SPREAD;
    }
}