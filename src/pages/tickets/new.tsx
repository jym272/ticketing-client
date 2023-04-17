import { getCurrentUser } from '@src/utils';
import { SWRConfiguration } from 'swr';
import { JwtPayloadCustom } from '@src/types';
import { NewTicketComponent, TicketingLayout } from '@src/components';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SWRConfig } from 'swr/_internal';
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
const isAuthenticated = (currentUser: JwtPayloadCustom) => {
    return currentUser.permissions.authenticated;
};
const isExpired = (currentUser: JwtPayloadCustom) => {
    if (!currentUser.exp) return true;
    return currentUser.exp < Math.floor(Date.now().valueOf() / 1000);
};

const isAuth = (fallback: SWRConfiguration['fallback']) => {
    if (!fallback) return false;
    const authApiPayload = fallback['/api/users/current-user'] as Record<'currentUser', null | JwtPayloadCustom>;
    if (!authApiPayload.currentUser) return false;
    const currentUser = authApiPayload.currentUser;
    return isAuthenticated(currentUser) && !isExpired(currentUser);
};
export default function NewTicket({ fallback }: { fallback: SWRConfiguration['fallback'] }) {
    const isAuthed = isAuth(fallback);
    const router = useRouter();
    useEffect(() => {
        if (!isAuthed) {
            void router.push('/');
        }
    }, [router, isAuthed]);

    if (!isAuthed) return null;

    return (
        <SWRConfig value={{ fallback }}>
            <TicketingLayout>
                <NewTicketComponent />
            </TicketingLayout>
        </SWRConfig>
    );
}
NewTicket.getInitialProps = getCurrentUser;
