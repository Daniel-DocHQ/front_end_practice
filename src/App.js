import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import AuthContextProvider from './context/AuthContext';
import RouteContainer from './router/RouteContainer';

export default class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<ToastsContainer store={ToastsStore} />
				<AuthContextProvider>
					<Router>
						<Switch>
							<RouteContainer />
						</Switch>
					</Router>
				</AuthContextProvider>
			</React.Fragment>
		);
	}
}
