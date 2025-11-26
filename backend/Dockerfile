# ======================
# Backend Dockerfile
# ======================

FROM node:20 AS base
WORKDIR /app

# Copiar package.json y instalar deps
COPY package*.json ./
RUN npm install --production

# Copiar el código fuente
COPY . .

# Generar el cliente de Prisma dentro del contenedor
RUN npx prisma generate
RUN npx prisma db seed

# Exponer puerto necesario para Cloud Run
EXPOSE 30001

# Comando de inicio
CMD ["npm","run" "start"]
