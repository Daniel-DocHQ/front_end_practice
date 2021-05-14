import React from 'react';
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, eventID: null };

        Sentry.init({
            dsn: "https://34cf6ee2768b4e2684394a5d208dab31@o239521.ingest.sentry.io/5520337",
            integrations: [new Integrations.BrowserTracing()],
            environment: process.env.REACT_APP_ENV,
            beforeSend(event, hint) {
            // Check if it is an exception, and if so, show the report dialog
            if (event.exception && process.env.REACT_APP_ENV === 'staging') {
                Sentry.showReportDialog({ eventId: event.event_id });
            }
            return event;
            },
        });
    }


    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Sentry.withScope(scope => {
            scope.setExtras(errorInfo);
            const eventID = Sentry.captureException(error);
            this.setState({ eventId: eventID });
        });
    }

    render() {
       return this.props.children;
    }
}

export default ErrorBoundary;
