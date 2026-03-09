# Configuração do Banco de Dados - Sapo Dashboard

## Tabela: terminals

Os dados dos terminais agora são salvos no Supabase (antes eram salvos apenas em localStorage).

### Passos para configurar:

1. **Abra o Supabase Console:**
   - Acesse: https://app.supabase.com
   - Selecione seu projeto

2. **Navigate para SQL Editor:**
   - Clique em "SQL Editor" no menu lateral esq.
   - Clique em "New Query"

3. **Execute o SQL:**
   - Copie o conteúdo do arquivo `SETUP_DATABASE.sql`
   - Cole na janela do SQL Editor
   - Clique em "Run" (ou Ctrl+Enter)

4. **Verifique a criação:**
   - Vá para "Table Editor"
   - Procure pela tabela "terminals"
   - Você deve ver uma tabela vazia inicialmente

### Estrutura da tabela:

```sql
- id (BIGINT): Identificador único
- name (VARCHAR): Nome do terminal
- type (VARCHAR): Tipo de carga (Contêineres, Carga Geral, etc)
- docks (INT): Número de berços
- status (VARCHAR): Status operacional (Operando, Manutenção Parcial, Fechado)
- capacity (INT): Percentual de ocupação (0-100)
- efficiency (INT): Eficiência operacional (0-100)
- throughput (INT): Volume mensal em mil TEUs
- created_at (TIMESTAMP): Data de criação
- updated_at (TIMESTAMP): Data de atualização
```

### Teste a integração:

1. Acesse a aplicação em http://localhost:5173/
2. Faça login com admin@sapo.com
3. Vá para a página "Terminais"
4. Clique em "Cadastrar Terminal"
5. Preencha os dados e clique em "Cadastrar Terminal"
6. Verifique se o terminal aparece na lista
7. Volte ao Supabase e verifique se os dados foram salvos na tabela

### Observações:

- Os dados salvos no localStorage anterior serão descartados
- Somente usuários com email admin@sapo.com podem adicionar/remover terminais
- O RLS (Row Level Security) pode ser ajustado conforme necessário para seu modelo de negócio
