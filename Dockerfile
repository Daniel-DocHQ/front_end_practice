# Stage 0: "build-stage" using NodeJS v12 LTS (erbium) to build the site
FROM node:erbium-alpine 

WORKDIR /usr/src/app
COPY . .
# Environment variables
ARG REACT_APP_BOOKING_URL=https://dochq-booking-api-staging.dochq.co.uk
ARG REACT_APP_DISCOUNT_URL=https://services-discounts-staging.dochq.co.uk
ARG REACT_APP_DELFIN_URL=https://dochq-booking-api-staging.dochq.co.uk
ARG REACT_APP_BOOKING_USER_DATA_URL=https://services-booking-user-data-staging.dochq.co.uk
ARG REACT_APP_LOGIN_URL=https://services-login-staging.dochq.co.uk
ARG REACT_APP_IDENTITIES_URL=https://services-identity-staging.dochq.co.uk
ARG REACT_APP_WEB_SOCKET_URL=https://services-websocket-server-staging.dochq.co.uk
ARG REACT_APP_IDENTITES_UI=https://ui-identity-editor-staging.dochq.co.uk/login?client=dochqhealth

ARG REACT_APP_LOGIN_BEARER=qj6WfxEpLg2WVjss
ARG REACT_APP_IDENTITIES_BEARER=Ww8cEFh9EIGPNNRi
ARG REACT_APP_TWILIO_ACCOUNT_SID=AC9bf0a45db52d3044f2e1f1874f746eaa
ARG REACT_APP_TWILIO_ACCOUNT_API_KEY=SK1b7bc2faeaf6c323223c15d50bc54150
ARG REACT_APP_TWILIO_ACCOUNT_API_SECRET=vYoZBNVhH14hfuFSX5lNK8iplUZiFCog


# Stage 1: install and build app
RUN env; npm install && npm run build

EXPOSE 80
# Stage 2: serve app
CMD [ "node", "server.js" ]
