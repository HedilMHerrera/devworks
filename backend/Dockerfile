FROM node:20-alpine

WORKDIR /app

# Copiar configs
COPY package*.json ./

# Instalar TODAS las dependencias (producción + prisma)
RUN npm install

# Copiar todo el código del backend
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Railway usa un puerto dinámico
EXPOSE 8080

# Iniciar la app
CMD ["npm", "start"]
