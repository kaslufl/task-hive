# Task Hive

Task Hive é um projeto para gerenciar tarefas de forma eficiente e colaborativa. Este projeto visa fornecer uma interface intuitiva e funcionalidades robustas para ajudar equipes a acompanhar o progresso de suas tarefas e projetos.

## Funcionalidades

- **Gerenciamento de Tarefas**: Crie, edite e exclua tarefas facilmente.
- **Acompanhamento de Progresso**: Visualize o progresso das tarefas em tempo real.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações server-side eficientes e escaláveis.
- **Swagger**: Ferramenta para documentação de APIs.
- **Prisma**: ORM (Object-Relational Mapping) para banco de dados.
- **pnpm**: Gerenciador de pacotes rápido e eficiente.

## Instalação

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Docker

### Passos

Para executar a aplicação via docker compose, siga os passos:

```shell
#Subir container.
docker compose up -d

#Para aplicar as migrations.
docker compose exec web alembic upgrade head
```

Após subir os containers podemos acessar a documentação **[back-end](http://localhost:3000/api)**

### Testes

Para efetuar os testes do back-end, executar os comando abaixo:

```shell
# instalar pnpm
npm install -g pnpm

# instalar as dependências
pnpm i
```

Para os testes unitários:

```bash
pnpm test:unit
```

Para o teste e2e:

```bash
# subir o banco de testes
docker compose up db -d

# rodar as migrations do prisma
pnpm migrate:postgres

# testes e2e
pnpm test:e2e

# apagar o volume
docker volume rm task-hive_db-data
```
