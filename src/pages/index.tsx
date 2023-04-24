import React from 'react';
import { TicketingLayout, TicketsList } from '@src/components';
import type { SWRConfiguration } from 'swr';
import { SWRConfig } from 'swr/_internal';
import { getCurrentUser, isAuthenticated } from '@src/utils';

// silly ccomment
export default function Home({ fallback }: { fallback: SWRConfiguration['fallback'] }) {
    const { currentUser } = isAuthenticated(fallback);

    //TODO: the fallback it was use to only /api/users/current-user, if is not used, the fallback is not used!
    return (
        <SWRConfig value={{ fallback }}>
            <TicketingLayout currentUser={currentUser}>
                {/*<TicketingComponent />*/}
                <TicketsList />
            </TicketingLayout>
        </SWRConfig>
    );

    // const dispatch: AppDispatch = useDispatch();
    //
    // const ingressUrl = `/query-posts`;
    // const apiUrl = `/api/query-posts`;
    // const { data } = useSWR<QueryData[]>(useIngress ? ingressUrl : apiUrl, fetcher, { refreshInterval: 1000 });
    //
    // useEffect(() => {
    //     if (data) {
    //         dispatch(updateData(data));
    //     }
    // }, [data, dispatch]);

    // const ingressUrl = `/query-posts`;
    // const apiUrl = `/api/query-posts`;
}

Home.getInitialProps = getCurrentUser;
