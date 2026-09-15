package srm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import srm.enums.Moeda;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "taxas_cambio")
public class TaxaCambio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "moeda_origem", nullable = false)
    private Moeda moedaOrigem;

    @Enumerated(EnumType.STRING)
    @Column(name = "moeda_destino", nullable = false)
    private Moeda moedaDestino;

    @Column(name = "taxa", nullable = false, precision = 19, scale = 8)
    private BigDecimal taxa;

    @Column(name = "data_vigencia", nullable = false)
    private LocalDateTime dataVigencia;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    public TaxaCambio(
            Moeda moedaOrigem,
            Moeda moedaDestino,
            BigDecimal taxa,
            LocalDateTime dataVigencia
    ) {
        this.moedaOrigem = moedaOrigem;
        this.moedaDestino = moedaDestino;
        this.taxa = taxa;
        this.dataVigencia = dataVigencia;
    }

    protected TaxaCambio() {
    }

    @PrePersist
    protected void prePersist() {
        LocalDateTime agora = LocalDateTime.now();

        this.dataCadastro = agora;
        this.dataAtualizacao = agora;
    }

    @PreUpdate
    protected void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public Moeda getMoedaOrigem() {
        return moedaOrigem;
    }

    public Moeda getMoedaDestino() {
        return moedaDestino;
    }

    public BigDecimal getTaxa() {
        return taxa;
    }

    public LocalDateTime getDataVigencia() {
        return dataVigencia;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }
}