# Stage 0: "build-stage" using NodeJS v12 LTS (erbium) to build the site
FROM bash:devel
WORKDIR /opt
COPY . .
