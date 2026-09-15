package srm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import srm.enums.Moeda;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "liquidacoes")
public class Liquidacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_recebivel", nullable = false)
    private Recebivel recebivel;

    @Column(name = "id_taxa_cambio")
    private UUID idTaxaCambio;

    @Column(name = "chave_idempotencia", nullable = false, unique = true, length = 100)
    private String chaveIdempotencia;

    @Column(name = "valor_face", nullable = false, precision = 19, scale = 2)
    private BigDecimal valorFace;

    @Column(name = "taxa_base", nullable = false, precision = 10, scale = 6)
    private BigDecimal taxaBase;

    @Column(name = "spread", nullable = false, precision = 10, scale = 6)
    private BigDecimal spread;

    @Column(name = "prazo_meses", nullable = false)
    private Integer prazoMeses;

    @Column(name = "valor_presente", nullable = false, precision = 19, scale = 2)
    private BigDecimal valorPresente;

    @Column(name = "valor_desagio", nullable = false, precision = 19, scale = 2)
    private BigDecimal valorDesagio;

    @Enumerated(EnumType.STRING)
    @Column(name = "moeda_pagamento", nullable = false, length = 3)
    private Moeda moedaPagamento;

    @Column(name = "taxa_cambio", precision = 19, scale = 6)
    private BigDecimal taxaCambio;

    @Column(name = "valor_pagamento", nullable = false, precision = 19, scale = 2)
    private BigDecimal valorPagamento;

    @Column(name = "data_liquidacao", nullable = false, updatable = false)
    private LocalDateTime dataLiquidacao;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    protected Liquidacao() {
    }

    public Liquidacao(
            Recebivel recebivel,
            UUID idTaxaCambio,
            String chaveIdempotencia,
            BigDecimal valorFace,
            BigDecimal taxaBase,
            BigDecimal spread,
            Integer prazoMeses,
            BigDecimal valorPresente,
            BigDecimal valorDesagio,
            Moeda moedaPagamento,
            BigDecimal taxaCambio,
            BigDecimal valorPagamento,
            LocalDateTime dataLiquidacao
    ) {
        this.recebivel = recebivel;
        this.idTaxaCambio = idTaxaCambio;
        this.chaveIdempotencia = chaveIdempotencia;
        this.valorFace = valorFace;
        this.taxaBase = taxaBase;
        this.spread = spread;
        this.prazoMeses = prazoMeses;
        this.valorPresente = valorPresente;
        this.valorDesagio = valorDesagio;
        this.moedaPagamento = moedaPagamento;
        this.taxaCambio = taxaCambio;
        this.valorPagamento = valorPagamento;
        this.dataLiquidacao = dataLiquidacao;
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

    public Recebivel getRecebivel() {
        return recebivel;
    }

    public UUID getIdTaxaCambio() {
        return idTaxaCambio;
    }

    public String getChaveIdempotencia() {
        return chaveIdempotencia;
    }

    public BigDecimal getValorFace() {
        return valorFace;
    }

    public BigDecimal getTaxaBase() {
        return taxaBase;
    }

    public BigDecimal getSpread() {
        return spread;
    }

    public Integer getPrazoMeses() {
        return prazoMeses;
    }

    public BigDecimal getValorPresente() {
        return valorPresente;
    }

    public BigDecimal getValorDesagio() {
        return valorDesagio;
    }

    public Moeda getMoedaPagamento() {
        return moedaPagamento;
    }

    public BigDecimal getTaxaCambio() {
        return taxaCambio;
    }

    public BigDecimal getValorPagamento() {
        return valorPagamento;
    }

    public LocalDateTime getDataLiquidacao() {
        return dataLiquidacao;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }
}