FROM node:alpine as builder

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

FROM builder AS dev

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "500"]

FROM builder AS prod

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/chat-app/browser /usr/share/nginx/html

EXPOSE 80
