CREATE TABLE taxas_cambio (
    id UUID PRIMARY KEY,
    moeda_origem VARCHAR(3) NOT NULL,
    moeda_destino VARCHAR(3) NOT NULL,
    taxa NUMERIC(19, 8) NOT NULL,
    data_vigencia TIMESTAMP NOT NULL,
    data_cadastro TIMESTAMP NOT NULL,
    data_atualizacao TIMESTAMP NOT NULL
);

CREATE INDEX idx_taxas_cambio_vigencia
    ON taxas_cambio (
        moeda_origem,
        moeda_destino,
        data_vigencia DESC
    );