FROM node:16-alpine as build
WORKDIR /app
COPY . .
RUN npm install --omit=optional \
    && npm run build

FROM node:16-alpine as prod

WORKDIR /app
COPY --from=build /app/ .

ENV HOST=0.0.0.0

EXPOSE 80 443

CMD ["node", "dist/main.js"]
