FROM node:20.19-alpine3.21

WORKDIR /home/node/app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

ENTRYPOINT [ "pnpm", "dev" ]
