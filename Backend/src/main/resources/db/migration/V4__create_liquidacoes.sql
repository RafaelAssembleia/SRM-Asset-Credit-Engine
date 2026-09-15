CREATE TABLE liquidacoes (
    id UUID PRIMARY KEY,
    id_recebivel UUID NOT NULL,
    id_taxa_cambio UUID,
    chave_idempotencia VARCHAR(100) NOT NULL,
    valor_face NUMERIC(19, 2) NOT NULL,
    taxa_base NUMERIC(10, 6) NOT NULL,
    spread NUMERIC(10, 6) NOT NULL,
    prazo_meses INTEGER NOT NULL,
    valor_presente NUMERIC(19, 2) NOT NULL,
    valor_desagio NUMERIC(19, 2) NOT NULL,
    moeda_pagamento VARCHAR(3) NOT NULL,
    taxa_cambio NUMERIC(19, 6),
    valor_pagamento NUMERIC(19, 2) NOT NULL,
    data_liquidacao TIMESTAMP NOT NULL,
    data_cadastro TIMESTAMP NOT NULL,
    data_atualizacao TIMESTAMP NOT NULL,

    CONSTRAINT uk_liquidacoes_chave_idempotencia
        UNIQUE (chave_idempotencia),

    CONSTRAINT fk_liquidacoes_recebivel
        FOREIGN KEY (id_recebivel)
            REFERENCES recebiveis(id),

    CONSTRAINT fk_liquidacoes_taxa_cambio
        FOREIGN KEY (id_taxa_cambio)
            REFERENCES taxas_cambio(id)
);