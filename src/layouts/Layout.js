import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopNavigation from '../components/Navigation/TopNavigation';
import { AuthContext } from '../context/AuthContext';
import AdminNavigator from '../components/Navigation/AdminNavigator';

const useStyles = makeStyles((theme) => ({
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

const Layout = ({ title, children }) => {
	const classes = useStyles();
	const contextValue = useContext(AuthContext);
	const { isAuthenticated, user, logout } = contextValue;
	const role = (!!user && !!user.roles ? user.roles[0].name : '').toLowerCase();

	const addProps = () => {
		const childrenWithProps = React.Children.map(children, child => {
			// checking isValidElement is the safe way and avoids a typescript error too
			const newProps = {
				...contextValue,
			};
			if (React.isValidElement(child)) {
				return React.cloneElement(child, newProps);
			}
			return child;
		});
		return childrenWithProps;
	};

	return (role === 'practitioner' || role === 'shift_manager')  ? (
		<div style={{ display: 'flex' }}>
			<AdminNavigator
				role={role}
				isAuthenticated={isAuthenticated}
				title={title}
				user={user}
				logout={logout}
			/>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<div
					style={{
						maxWidth: '100vw',
						margin: 'auto',
						boxSizing: 'border-box',
					}}
				>
					{addProps()}
				</div>
			</main>
		</div>
	) : (
		<React.Fragment>
			<TopNavigation
				role={role}
				user={user}
				title={title}
				logout={logout}
				{...contextValue}
				isAuthenticated={isAuthenticated}
			/>
			<div
				style={{
					maxWidth: '100vw',
					height: '100%',
					paddingTop: '74px',
					margin: 'auto',
					boxSizing: 'border-box',
				}}
			>
				{addProps()}
			</div>
		</React.Fragment>
	);
};

export default Layout;
