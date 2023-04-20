import { SWRConfiguration } from 'swr';
import { getCurrentUser, isAuthenticated } from '@src/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SWRConfig } from 'swr/_internal';
import { OrdersList, TicketingLayout } from '@src/components';

export default function ListOfOrders({ fallback }: { fallback: SWRConfiguration['fallback'] }) {
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
                <OrdersList />
            </TicketingLayout>
        </SWRConfig>
    );
}

ListOfOrders.getInitialProps = getCurrentUser;
