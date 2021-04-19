import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from './App';
import * as serviceWorker from './serviceWorker';
import './assets/css/theme.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

Sentry.init({
	dsn: "https://34cf6ee2768b4e2684394a5d208dab31@o239521.ingest.sentry.io/5520337",
	integrations: [new Integrations.BrowserTracing()],
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});


ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
