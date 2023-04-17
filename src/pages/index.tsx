import React from 'react';
import { TicketingLayout, TicketsList } from '@src/components';
import type { SWRConfiguration } from 'swr';
import { SWRConfig } from 'swr/_internal';
import { getCurrentUser } from '@src/utils';

// const useIngress = process.env.NEXT_PUBLIC_INGRESS_NGINX;

export default function Home({ fallback }: { fallback: SWRConfiguration['fallback'] }) {
    return (
        <SWRConfig value={{ fallback }}>
            <TicketingLayout>
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
