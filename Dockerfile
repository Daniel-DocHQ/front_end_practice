# Stage 0: "build-stage" using NodeJS v12 LTS (erbium) to build the site
FROM node:erbium-alpine 

WORKDIR /usr/src/app
COPY . .
# Environment variables
ARG DOC_ENVIRONMENT=dev


# Stage 1: install and build app
RUN npm i && npm run build:$DOC_ENVIRONMENT

EXPOSE 80
# Stage 2: serve app
CMD [ "node", "server.js" ]
