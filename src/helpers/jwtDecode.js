import jwt_decode from 'jwt-decode';

export function jwtDecode(token) {
	return jwt_decode(token);
}
