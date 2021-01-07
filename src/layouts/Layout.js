import React, { useState, useEffect, useContext } from 'react';
import SideNavigation from '../components/Navigation/SideNavigation';
import TopNavigation from '../components/Navigation/TopNavigation';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ title, children }) => {
	const contextValue = useContext(AuthContext);
	function addProps() {
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
	}
	return (
		<React.Fragment>
			<TopNavigation title={title} {...contextValue} />
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
