package srm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import srm.entity.Liquidacao;

import java.util.Optional;
import java.util.UUID;

public interface LiquidacaoRepository extends JpaRepository<Liquidacao, UUID> {

    Optional<Liquidacao> findByChaveIdempotencia(String chaveIdempotencia);
}