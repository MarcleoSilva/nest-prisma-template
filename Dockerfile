FROM node:24-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Nao precisamos do Chrome do puppeteer (ERD desligado no runtime); evita download pesado e com falha.
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["sh", "docker-entrypoint.sh"]