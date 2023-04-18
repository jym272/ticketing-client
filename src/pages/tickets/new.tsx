import { getCurrentUser, isAuthenticated } from '@src/utils';
import { SWRConfiguration } from 'swr';
import { NewTicketComponent, TicketingLayout } from '@src/components';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SWRConfig } from 'swr/_internal';

export default function NewTicket({ fallback }: { fallback: SWRConfiguration['fallback'] }) {
    const { isAuth, currentUser } = isAuthenticated(fallback);
    const router = useRouter();
    useEffect(() => {
        if (!isAuth) {
            void router.push('/');
        }
    }, [router, isAuth]);

    if (!isAuth) return null;

    return (
        <SWRConfig value={{ fallback }}>
            <TicketingLayout currentUser={currentUser}>
                <NewTicketComponent />
            </TicketingLayout>
        </SWRConfig>
    );
}
NewTicket.getInitialProps = getCurrentUser;
