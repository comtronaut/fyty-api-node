FROM node:16-alpine as build
WORKDIR /app
COPY . .
RUN npm install \
    && npm run build

ENV PORT=80
ENV HOST=0.0.0.0

CMD ["node", "./dist/main.js"]

EXPOSE 80
