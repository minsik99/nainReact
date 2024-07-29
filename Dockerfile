FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx next build

EXPOSE 3000

CMD ["npm", "run", "dev"]

