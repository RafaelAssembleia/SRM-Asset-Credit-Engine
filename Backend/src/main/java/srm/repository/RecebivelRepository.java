package srm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import srm.entity.Recebivel;

import java.util.UUID;

public interface RecebivelRepository extends JpaRepository<Recebivel, UUID> {
}