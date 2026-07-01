# Oxetech Helpdesk API

Esta e uma codebase-base para exercicios de refatoracao incremental. O projeto simula uma API simples de chamados de suporte academico.

O objetivo nao e reconstruir o sistema do zero. O objetivo e entender a aplicacao existente, identificar problemas tecnicos, fazer melhorias pequenas e justificar as decisoes por Pull Request.

## Requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose (para o PostgreSQL e o Mailpit)

## Como rodar

Instale as dependencias:

```bash
npm install
```

Suba o PostgreSQL e o Mailpit (servidor de email de teste):

```bash
docker compose up -d
```

Copie o arquivo de ambiente. Os valores ja apontam para os containers do Docker:

```bash
cp .env.example .env
```

Crie o schema no banco e gere o Prisma Client:

```bash
npm run db:push
```

Popule os dados de exemplo:

```bash
npm run seed
```

Execute em modo desenvolvimento:

```bash
npm run dev
```

A API ficara disponivel em `http://localhost:3000/api`. Os emails enviados
ao criar chamados podem ser inspecionados na interface web do Mailpit em
`http://localhost:8025`.

## Scripts

- `npm run dev`: executa a API em modo desenvolvimento.
- `npm run db:push`: aplica o schema do Prisma no banco (`prisma db push`).
- `npm run prisma:migrate`: cria/aplica migrations versionadas (`prisma migrate dev`).
- `npm run prisma:generate`: (re)gera o Prisma Client.
- `npm run seed`: popula o banco com os dados de exemplo.
- `npm run typecheck`: valida os tipos TypeScript.
- `npm run build`: gera o Prisma Client e compila o projeto para `dist`.
- `npm test`: executa os testes unitarios e de integracao.

## Endpoints principais

### Healthcheck

```http
GET /api/health
```

### Listar usuarios

```http
GET /api/users
```

### Listar chamados

```http
GET /api/tickets
GET /api/tickets?status=open
GET /api/tickets?category=infra
GET /api/tickets?search=login
```

### Resumo dos chamados

```http
GET /api/tickets/summary
```

### Detalhar chamado

```http
GET /api/tickets/ticket_001
```

### Criar chamado

```http
POST /api/tickets
Content-Type: application/json

{
  "title": "Nao consigo enviar atividade",
  "description": "O sistema apresenta erro ao anexar o arquivo da atividade.",
  "category": "sistemas",
  "requesterId": "user_ana"
}
```

### Atualizar status

```http
PATCH /api/tickets/ticket_001/status
Content-Type: application/json

{
  "status": "in_progress",
  "authorId": "user_carla",
  "comment": "Chamado em atendimento."
}
```

### Adicionar comentario

```http
POST /api/tickets/ticket_001/comments
Content-Type: application/json

{
  "authorId": "user_carla",
  "message": "Solicitei mais informacoes ao usuario."
}
```

## Jornada de refatoracao

Trabalhe em Pull Requests pequenos e bem explicados.

Em cada PR, registre:

- quais problemas voce encontrou;
- quais melhorias foram feitas;
- quais conceitos do curso foram aplicados;
- como voce verificou que o comportamento continua funcionando;
- quais limitacoes continuam existindo.

Consulte [docs/CHECKPOINTS.md](docs/CHECKPOINTS.md) para entender o escopo esperado de cada entrega.