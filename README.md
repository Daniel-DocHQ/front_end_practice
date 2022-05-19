# React Video Consultations System

## ENV_VARS

REACT_APP_BOOKING_URL -- booking api url (will default to staging)
REACT_APP_DISCOUNT_URL -- discount api url (will default to staging)
REACT_APP_DELFIN_URL -- delfin user data api url (will default to staging)
REACT_APP_IDENTITIES_URL -- identities api url (will default to staging)
REACT_APP_LOGIN_URL -- login service url (will default to staging)
REACT_APP_BOOKING_USER_DATA_URL -- booking user data api url (will default to staging)
REACT_APP_LOGIN_BEARER -- defaults to what is in the service file
REACT_APP_IDENTITIES_BEARER -- defaults to what is in the service file
REACT_APP_WEB_SOCKET_URL -- NOT IMPLEMENTED YET
REACT_APP_TWILIO_ACCOUNT_API_SID -- defaults to aaron.bosley@dochq's twilio deets
REACT_APP_TWILIO_ACCOUNT_API_KEY -- defaults to aaron.bosley@dochq's twilio deets
REACT_APP_TWILIO_ACCOUNT_API_SECRET -- defaults to aaron.bosley@dochq's twilio deets

NODE_ENV - if this is production, websocket server connects to the correct server and if development it tries to connect to the localhost server, fails if not running (will default to staging)

## NVM

Node version - v12.x.x (LTS until April 2022)

## Locally serving production app

To see how the website should display in production you need to have docker installed
Then run **npm run serve:production** and open localhost:1338 to view the site

## Browser Support

Edge - 15+ since April 2017
Firefox - 22+ May 2013
Chrome - 23+ Sept 2012
Safari - 11+ Sept 2017
Opera - 18+ Dec 2013
iOS Safari - 11+ Sept 2017
Chrome and Firefox for Android
Android Browser
Samsung Internet

https://caniuse.com/#search=rtc

## Technologies used

Web socket server using Express and Socket.io for WebRTC Peer Connection handshakes
Simple Peer with AdapterJS in order to simplify the WebRTC Peer Connection handling, I plan to rebuild this section and get it running from vanillaJS it's just a pain with the browser supports.
React Router
React Toasts library - intend to remove this in the future when we have our own components for this
Context currently only keeps track of the user and auth
Twilio Video

## Icons

Font Awesome free icons only - no material-ui icons <3

## Merge Requests

In the merge request on GitLab please add the following information to the description. This will make it easier to understand what's going on in an MR and also look back on branches in the future

- Design
- User Stories
- End user tests
- Developer tests
- Additional tests
- Reporter
- Error handling

## Scripts

Format - formats all code using prettier - **npm run format**
Serve production locally with server - **npm run serve:production**

## Warnings

Do not install upgrade @date-io/date-fns past 1.3.x until @material-ui/pickers is ready to take v2 of @date-io/date-fns as it's a breaking change.
