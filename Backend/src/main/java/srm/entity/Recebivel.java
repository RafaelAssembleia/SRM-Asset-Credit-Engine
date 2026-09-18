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
import srm.enums.SituacaoRecebivel;
import srm.enums.TipoRecebivel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recebiveis")
public class Recebivel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_cedente_id", nullable = false)
    private Empresa empresaCedente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_devedora_id", nullable = false)
    private Empresa empresaDevedora;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoRecebivel tipo;

    @Column(name = "valor_face", nullable = false, precision = 19, scale = 2)
    private BigDecimal valorFace;

    @Enumerated(EnumType.STRING)
    @Column(name = "moeda", nullable = false)
    private Moeda moeda;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao", nullable = false)
    private SituacaoRecebivel situacao;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    public Recebivel(
            Empresa empresaCedente,
            Empresa empresaDevedora,
            TipoRecebivel tipo,
            BigDecimal valorFace,
            Moeda moeda,
            LocalDate dataVencimento
    ) {
        this.empresaCedente = empresaCedente;
        this.empresaDevedora = empresaDevedora;
        this.tipo = tipo;
        this.valorFace = valorFace;
        this.moeda = moeda;
        this.dataVencimento = dataVencimento;
        this.situacao = SituacaoRecebivel.PENDENTE;
    }

    protected Recebivel() {}

    @PrePersist
    protected void prePersist() {
        LocalDateTime agora = LocalDateTime.now();

        this.situacao = SituacaoRecebivel.PENDENTE;
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

    public Empresa getEmpresaCedente() {
        return empresaCedente;
    }

    public Empresa getEmpresaDevedora() {
        return empresaDevedora;
    }

    public TipoRecebivel getTipo() {
        return tipo;
    }

    public BigDecimal getValorFace() {
        return valorFace;
    }

    public Moeda getMoeda() {
        return moeda;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public SituacaoRecebivel getSituacao() {
        return situacao;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void liquidar() {
        this.situacao = SituacaoRecebivel.LIQUIDADO;
    }
}