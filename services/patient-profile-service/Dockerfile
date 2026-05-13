FROM node:20-alpine

WORKDIR /app

# Required for Prisma on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
# Generate Prisma Client
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

# Run migrations, seed, and start app
CMD ["sh", "-c", "npx prisma db push && npm run db:seed && npm start"]
