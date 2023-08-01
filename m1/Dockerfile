FROM node:lts-bullseye-slim

WORKDIR /m1

COPY package*.json ./
COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN npm install

COPY . .

CMD /wait && npm run start
