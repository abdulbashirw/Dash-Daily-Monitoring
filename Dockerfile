  FROM node:22.16.0-alpine AS base

  WORKDIR /app

  # Copy only package.json and yarn.lock initially for efficient caching
  COPY package.json yarn.lock ./

  # Install npm globally and enable corepack (for managing Yarn versions)
  RUN npm i -g npm && corepack enable

  # Install dependencies
  COPY . .
  RUN yarn install

  # Lint and build steps (common for dev, staging, and prod)
  RUN yarn lint --fix

  # Builder for production
  FROM base AS builder-prod
  RUN yarn build

  # Builder for staging
  FROM base AS builder-staging
  RUN yarn build --mode staging

  # Builder for development
  FROM base AS builder-dev
  RUN yarn build --mode development

  # Production environment
  FROM node:22.16.0-alpine AS prod
  RUN npm install -g serve
  WORKDIR /app
  COPY --from=builder-prod /app/dist ./dist
  COPY --from=builder-prod /app/public ./public
  EXPOSE 4173
  CMD ["serve", "-s", "dist", "-l", "4173"]

  # Staging environment
  FROM node:22.16.0-alpine AS staging
  RUN npm install -g serve
  WORKDIR /app
  COPY --from=builder-staging /app/dist ./dist
  COPY --from=builder-staging /app/public ./public
  EXPOSE 4173
  CMD ["serve", "-s", "dist", "-l", "4173"]

  # Development environment
  FROM node:22.16.0-alpine AS dev
  RUN npm install -g serve
  WORKDIR /app
  COPY --from=builder-dev /app/dist ./dist
  COPY --from=builder-dev /app/public ./public
  COPY --from=builder-dev /app/package.json ./package.json
  EXPOSE 4173
  CMD ["serve", "-s", "dist", "-l", "4173"]