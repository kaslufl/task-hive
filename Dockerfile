FROM node:22

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]