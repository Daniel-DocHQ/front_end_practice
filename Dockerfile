FROM node:erbium-alpine

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}

COPY . .

RUN npm i && npm run build:$ENVIRONMENT

CMD ["sh", "-c", "node server.js"]
