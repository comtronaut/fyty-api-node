# FyTy Core API

Fyty Core API manages the fundamental core business logic, i.e., user account, team, appointment, room, training records, and admin.

## Setup

1. install

```bash
npm i
npm run prisma:gen
```

2. add `.env`. by creating `.env` files in `env` directory. it's require both `.env.dev` and `.env.prod`

3. after installing and preparation, to start the dev server:

```bash
npm run dev
```

4. happy development!

## Deployment

Run

```bash
make docker-deploy.prod
```

To deploy on the production.
