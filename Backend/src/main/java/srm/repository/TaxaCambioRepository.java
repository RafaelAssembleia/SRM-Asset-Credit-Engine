package srm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import srm.entity.TaxaCambio;
import srm.enums.Moeda;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface TaxaCambioRepository extends JpaRepository<TaxaCambio, UUID> {

    Optional<TaxaCambio> findTopByMoedaOrigemAndMoedaDestinoAndDataVigenciaLessThanEqualOrderByDataVigenciaDesc(
            Moeda moedaOrigem,
            Moeda moedaDestino,
            LocalDateTime dataVigencia
    );
}