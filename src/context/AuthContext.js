import React, { Component, useContext } from 'react';
export const AuthContext = React.createContext();

export default class AuthContextProvider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false,
			token: null,
			user: null,
			role: null,
			role_profile: {
			},
			role_data: {},
			role_profile: null,
			role_data: null,
			organisation_profile: null,
			hra_data: null,
		};
		this.logout = logout.bind(this);
		this.setToken = setToken.bind(this);
		this.setUser = setUser.bind(this);
		this.setRole = setRole.bind(this);
		this.setRoleProfile = setRoleProfile.bind(this);
		this.setIsAuthenticated = setIsAuthenticated.bind(this);
		this.setRoleData = setRoleData.bind(this);
		this.setOrgProfile = setOrgProfile.bind(this);
		this.setHRAData = setHRAData.bind(this);

		function logout() {
			localStorage.clear();
			this.setState({
				isAuthenticated: false,
				token: null,
				user: null,
				role: null,
				role_data: null,
			});
			window.localStorage.clear();
		}
		function setToken(token) {
			localStorage.setItem('auth_token', token);
			this.setState({ token, isAuthenticated: true });
		}
		function setUser(user) {
			localStorage.setItem('docHQUser', JSON.stringify(user));
			this.setState({ user });
		}
		function setRole(role) {
			localStorage.setItem('docHQRole', role);
			this.setState({ role });
		}
		function setRoleData(role_data) {
			localStorage.setItem('docHQRoleData', JSON.stringify(role_data));
			this.setState({ role_data });
		}
		function setRoleProfile(role_profile) {
			localStorage.setItem('docHQRoleProfile', JSON.stringify(role_profile));
			this.setState({ role_profile });
		}
		function setIsAuthenticated(isAuthenticated) {
			this.setState({ isAuthenticated });
		}
		function setOrgProfile(organisation_profile) {
			localStorage.setItem('docHQOrgProfile', JSON.stringify(organisation_profile));
			this.setState({ organisation_profile });
		}
		function setHRAData(hra_data) {
			localStorage.setItem('docHQHRAData', JSON.stringify(hra_data));
			this.setState({ hra_data });
		}
	}
	componentWillMount() {
		if (localStorage.getItem('docHQUser')) {
			try {
				this.state.user = JSON.parse(localStorage.getItem('docHQUser'));
			} catch (error) {
				this.state.user = null;
			}
		}
		if (localStorage.getItem('auth_token')) {
			this.state.token = localStorage.getItem('auth_token');
			this.state.isAuthenticated = true;
		}
		if (localStorage.getItem('docHQRole')) {
			console.log(localStorage.getItem('docHQRole'));
			this.state.role = localStorage.getItem('docHQRole');
		}
		if (localStorage.getItem('docHQRoleData')) {
			this.state.role_data = JSON.parse(localStorage.getItem('docHQRoleData'));
		}
		if (localStorage.getItem('docHQRoleProfile')) {
			this.state.role_profile = JSON.parse(localStorage.getItem('docHQRoleProfile'));
		}
		if (localStorage.getItem('docHQOrgProfile')) {
			this.state.organisation_profile = JSON.parse(localStorage.getItem('docHQOrgProfile'));
		}
		if (localStorage.getItem('docHQHRAData')) {
			this.state.hra_data = JSON.parse(localStorage.getItem('docHQHRAData'));
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
					role_data: this.state.role_data,
					organisation_profile: this.state.organisation_profile,
					hra_data: this.state.hra_data,
					logout: this.logout,
					setToken: this.setToken,
					setUser: this.setUser,
					setRole: this.setRole,
					setRoleProfile: this.setRoleProfile,
					setIsAuthenticated: this.setIsAuthenticated,
					setRoleData: this.setRoleData,
					setOrgProfile: this.setOrgProfile,
					setHRAData: this.setHRAData,
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
