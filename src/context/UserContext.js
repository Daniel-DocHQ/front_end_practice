import React, { useState, useMemo, useEffect } from 'react';
/*


I AM NOT THE CONTEXT YOU'RE LOOKING FOR


*/
export const UserContext = React.createContext();
const UserContextProvider = ({ children }) => {
	const [userId, setUserId] = useState();
	const [userEmail, setUserEmail] = useState();
	const [token, setToken] = useState();
	const [tokenLastUsed, setTokenLastUsed] = useState();
	const [isAuthenticated, setIsAuthenticated] = useState();
	useEffect(() => {
		if (
			isAuthenticated !== true &&
			typeof token === 'undefined' &&
			localStorage.getItem('docHQVideoConsultationAuthToken')
		) {
			setToken(localStorage.getItem('docHQVideoConsultationAuthToken'));
			setIsAuthenticated(true);
		}
	}, [isAuthenticated, token]);
	const value = useMemo(
		() => ({
			userId,
			setUserId,
			userEmail,
			setUserEmail,
			token,
			setToken,
			tokenLastUsed,
			setTokenLastUsed,
			isAuthenticated,
			setIsAuthenticated,
		}),
		[
			userId,
			setUserId,
			userEmail,
			setUserEmail,
			token,
			setToken,
			tokenLastUsed,
			setTokenLastUsed,
			isAuthenticated,
			setIsAuthenticated,
		]
	);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserContextProvider;
