import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import ErrorBoundary from './components/ErrorBoundary';
import PractitionerOnlinePinger from './components/PractitionerOnlinePinger';
import AuthContextProvider from './context/AuthContext';
import RouteContainer from './router/RouteContainer';

export default class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<ToastsContainer store={ToastsStore} />
				<AuthContextProvider>
					<PractitionerOnlinePinger />
					<Router>
						<ErrorBoundary>
							<Switch>
								<RouteContainer />
							</Switch>
						</ErrorBoundary>
					</Router>
				</AuthContextProvider>
			</React.Fragment>
		);
	}
}
