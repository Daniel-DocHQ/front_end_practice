import { useEffect } from 'react';

const FRESHCHAT_CONFIG = {
  token: process.env.REACT_APP_FRESHCHAT_KEY,
  host: 'https://wchat.in.freshchat.com',
  config: {
    cssNames: {
      widget: 'widget',
    },
  },
};

const initFreshChat = () => (
  window.fcWidget.init(FRESHCHAT_CONFIG)
);

const initialize = (i, t) => {
  let e;
  i.getElementById(t)
    ? initFreshChat()
    : ((e = i.createElement('script')).id = t, e.async = !0, e.src = 'https://wchat.in.freshchat.com/js/widget.js', e.onload = initFreshChat, i.head.appendChild(e));
};

const initiateCall = () => {
  initialize(document, 'freshchat-js-sdk');
};

const useChat = () => {
  console.log(FRESHCHAT_CONFIG);
  useEffect(() => {
    initiateCall();
  }, []);
};

export default useChat;
