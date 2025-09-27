# Placar360 Frontend

Frontend para sistema de placar e torneios desenvolvido com React + TypeScript + Vite.

## Tecnologias

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Certifique-se de que o backend está rodando na porta 3000

3. Execute o projeto:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3001`

## Estrutura do projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (AuthContext)
├── pages/          # Páginas da aplicação
├── services/       # Serviços (API)
├── App.tsx         # Componente principal
└── main.tsx        # Ponto de entrada
```

## Funcionalidades

- ✅ Login e registro de usuários
- ✅ Proteção de rotas
- ✅ Gerenciamento de estado de autenticação
- ✅ Integração com backend via API
- ✅ Interface responsiva e limpa

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
