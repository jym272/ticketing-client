import { JwtPayloadCustom } from '@src/types';
import { SWRConfiguration } from 'swr';

//{
//     "permissions": {
//         "authenticated": true
//     },
//     "iat": 1681684514,
//     "exp": 1681770914,
//     "aud": "ticketing-frontend",
//     "iss": "auth-api",
//     "sub": "jym272@gmail.com",
//     "jti": "1"
// }

const havePermissions = (currentUser: JwtPayloadCustom) => {
    return currentUser.permissions.authenticated;
};
const isExpired = (currentUser: JwtPayloadCustom) => {
    if (!currentUser.exp) return true;
    return currentUser.exp < Math.floor(Date.now().valueOf() / 1000);
};

export const isAuthenticated = (fallback: SWRConfiguration['fallback']) => {
    if (!fallback) return { isAuth: false, currentUser: null };
    const authApiPayload = fallback['/api/users/current-user'] as Record<'currentUser', null | JwtPayloadCustom>;
    if (!authApiPayload.currentUser) return { isAuth: false, currentUser: null };
    const currentUser = authApiPayload.currentUser;
    // return isAuthenticated(currentUser) && !isExpired(currentUser);
    return { isAuth: havePermissions(currentUser) && !isExpired(currentUser), currentUser };
};
