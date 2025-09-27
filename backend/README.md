# Placar360 Backend

Backend para sistema de placar e torneios desenvolvido com NestJS e Prisma.

## Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de schemas

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na pasta backend/ com:
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

**Nota:** O projeto está configurado para usar SQLite por padrão (arquivo `dev.db`). Para usar PostgreSQL, altere o `provider` no `prisma/schema.prisma` para `"postgresql"` e adicione a `DATABASE_URL` no `.env`.

3. Execute as migrações do Prisma:
```bash
npm run prisma:migrate
```

4. Gere o cliente Prisma:
```bash
npm run prisma:generate
```

## Executando o projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Endpoints

- **Login**: POST /auth/login
- **Registro**: POST /auth/register

## Estrutura do projeto

```
src/
├── auth/           # Módulo de autenticação
│   ├── schemas/    # Schemas Zod para validação
│   ├── strategies/ # Estratégias Passport
│   └── guards/     # Guards de autenticação
├── common/         # Utilitários compartilhados
│   ├── decorators/ # Decorators personalizados
│   └── pipes/      # Pipes de validação
├── prisma/         # Configuração do Prisma
├── app.module.ts   # Módulo principal
└── main.ts         # Arquivo de inicialização
```
