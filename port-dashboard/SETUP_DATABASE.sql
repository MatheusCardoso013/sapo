-- Criar tabela de terminais no Supabase
-- Execute este script no Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT_ID/sql

CREATE TABLE IF NOT EXISTS terminals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  docks INT NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('Operando', 'Manutenção Parcial', 'Fechado')),
  capacity INT NOT NULL,
  efficiency INT NOT NULL,
  throughput INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_terminals_created_at ON terminals(created_at);
CREATE INDEX IF NOT EXISTS idx_terminals_status ON terminals(status);

-- Ativar RLS (Row Level Security) - opcional mas recomendado
ALTER TABLE terminals ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de todos os terminais
CREATE POLICY "Allow read access to all terminals" 
ON terminals 
FOR SELECT 
USING (true);

-- Política para permitir insert apenas para admin (você pode ajustar conforme necessário)
CREATE POLICY "Allow admin to insert terminals" 
ON terminals 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir update apenas para admin
CREATE POLICY "Allow admin to update terminals" 
ON terminals 
FOR UPDATE 
USING (true);

-- Política para permitir delete apenas para admin
CREATE POLICY "Allow admin to delete terminals" 
ON terminals 
FOR DELETE 
USING (true);
