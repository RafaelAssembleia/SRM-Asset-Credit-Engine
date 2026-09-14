CREATE TABLE recebiveis (
    id UUID PRIMARY KEY,
    empresa_cedente_id UUID NOT NULL,
    empresa_devedora_id UUID NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor_face NUMERIC(19, 2) NOT NULL,
    moeda VARCHAR(3) NOT NULL,
    data_vencimento DATE NOT NULL,
    situacao VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL,
    data_atualizacao TIMESTAMP NOT NULL,

    CONSTRAINT fk_recebiveis_empresa_cedente
        FOREIGN KEY (empresa_cedente_id)
            REFERENCES empresas(id),

    CONSTRAINT fk_recebiveis_empresa_devedora
        FOREIGN KEY (empresa_devedora_id)
            REFERENCES empresas(id)
);