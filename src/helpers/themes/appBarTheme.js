import { createMuiTheme } from '@material-ui/core';

export const appBarTheme = createMuiTheme({
	overrides: {
		MuiTabs: {
			root: {
				color: 'var(--doc-white) !important',
			},
		},
	},
});
