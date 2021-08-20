FROM node:erbium-alpine

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}

COPY . .

RUN npm set progress=false ; npm ci && npm run build:$ENVIRONMENT

CMD ["sh", "-c", "node server.js"]
