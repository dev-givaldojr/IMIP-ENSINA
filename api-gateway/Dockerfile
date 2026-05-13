FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Initialize minimal tsconfig for build
RUN echo '{"compilerOptions":{"target":"es2022","module":"commonjs","outDir":"./dist","esModuleInterop":true,"strict":true}}' > tsconfig.json

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
