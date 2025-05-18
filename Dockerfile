
# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación NestJS (en dist/)
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

# Copia solo los archivos necesarios desde la etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expone el puerto (ajústalo según tu aplicación)
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main"]
