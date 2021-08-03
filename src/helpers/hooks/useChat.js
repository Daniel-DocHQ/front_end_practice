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
  !!window && !!window.fcWidget ?
    window.fcWidget.init(FRESHCHAT_CONFIG) : null
);

const initialize = (i, t) => {
  let e;
  const initialize = i.getElementById(t)
    ? initFreshChat()
    : ((e = i.createElement('script')).id = t, e.async = !0, e.src = 'https://wchat.in.freshchat.com/js/widget.js', e.onload = initFreshChat, i.head.appendChild(e));
  return initialize;
};

const initiateCall = () => {
  initialize(document, 'freshchat-js-sdk');
};

const useChat = () => {
  useEffect(() => {
    initiateCall();
  }, []);
};

export default useChat;
