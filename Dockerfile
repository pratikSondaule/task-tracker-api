FROM node:20-alpine

WORKDIR /app

ENV DATABASE_URL=""

ENV PORT=""

ENV JWT_SECRET=""

ENV SMTP_EMAIL=""

ENV SMTP_PASSWORD=""

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]