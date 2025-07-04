# Étape 1 : build
FROM node:18.20-alpine AS builder
WORKDIR /app

# 1. Copie manifestes, installe deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 2. Copie schema et generate Prisma pour Linux musl
COPY prisma ./prisma
RUN npx prisma generate

# 3. Copie le reste du code
COPY . .

# Étape finale
FROM node:18.20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
