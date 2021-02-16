import React, { Component, useContext } from 'react';
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
			this.setState({ user });
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
		if (localStorage.getItem('auth_token')) {
			this.state.token = localStorage.getItem('auth_token');
			this.state.isAuthenticated = true;
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
