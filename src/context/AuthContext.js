import React, { Component, useContext } from 'react';
import { get } from 'lodash';
import authorisationSvc from '../services/authorisationService';
import bookingUserDataService from '../services/bookingUserDataService';

export const AuthContext = React.createContext();

export default class AuthContextProvider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false,
			token: null,
			user: null, // id (user_id), created_at, first_name, last_name, date_of_birth, email, telephone, roles:[{role}]
			role: null, // id (role_id), created_at, name (role name), organisation_id, user_id
			role_profile: null, // id (role_profile_id), created_at, onboarding_complete, organisation_profile_id, role_id, shipping_details
			organisation_profile: null,
		};
		this.logout = logout.bind(this);
		this.setToken = setToken.bind(this);
		this.setUser = setUser.bind(this);
		this.setRole = setRole.bind(this);
		this.setRoleProfile = setRoleProfile.bind(this);
		this.setOrgProfile = setOrgProfile.bind(this);

		this.clearState = clearState.bind(this);

		function clearState() {
			const keys = Object.keys(this.state);
			const newState = {};
			keys.forEach(k => {
				newState[k] = null;
			});
			this.setState(newState);
		}
		function logout() {
			this.clearState();
			localStorage.clear();
			window.localStorage.clear();
		}
		function setToken(token) {
			localStorage.setItem('auth_token', token);
			this.setState({ token, isAuthenticated: true });
		}
		function setUser(user) {
			const obj = {};
			obj.user = user;
			if (!!user && !!user.roles && !!user.roles[0]) {
				obj.role = user.roles[0];
				this.setState({role: user.roles[0]});
			}
			this.setState(obj);
		}
		function setRole(role) {
			this.setState({ role });
		}
		function setRoleProfile(role_profile) {
			this.setState({ role_profile });
		}
		function setOrgProfile(organisation_profile) {
			this.setState({ organisation_profile });
		}
	}
	componentWillMount() {
		const authToken = localStorage.getItem('auth_token');
		if (authToken) {
			let role = '';
			this.state.token = authToken;
			this.state.isAuthenticated = true;
			authorisationSvc.getUser(authToken).then(resp => {
				if (resp.success && resp.user) {
					this.setUser(resp.user);
					role = get(resp.user, 'roles[0].name', '');
				} else {
					this.logout();
				}
			});
			if (role === 'patient') {
				bookingUserDataService
					.getRoleProfile(authToken)
					.then(result => {
						if (result.success && result.role_profile) {
							this.setRoleProfile(result.role_profile);
						}
					})
			}
		}
	}

	render() {

		return (
			<AuthContext.Provider
				value={{
					isAuthenticated: this.state.isAuthenticated,
					token: this.state.token,
					user: this.state.user,
					role: this.state.role,
					role_profile: this.state.role_profile,
					organisation_profile: this.state.organisation_profile,
					logout: this.logout,
					setToken: this.setToken,
					setUser: this.setUser,
					setRole: this.setRole,
					setRoleProfile: this.setRoleProfile,
					setOrgProfile: this.setOrgProfile,
				}}
			>
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}
export const useToken = () => {
	const { token } = useContext(AuthContext);
	return token;
};
export const useAuthenticated = () => {
	const { isAuthenticated } = useContext(AuthContext);
	return isAuthenticated;
};
export const useRoleProfile = () => {
	const { role_profile } = useContext(AuthContext);
	return role_profile;
};
export const useUser = () => {
	const { user } = useContext(AuthContext);
	return user;
};
export const useOrgProfile = () => {
	const { organisation_profile } = useContext(AuthContext);
	return organisation_profile;
};
export const useRoleName = () => {
	const { role } = useContext(AuthContext);
	return !!role && !!role.name ? role.name : null;
};
