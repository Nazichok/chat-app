FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/chat-app/browser /usr/share/nginx/html

EXPOSE 80