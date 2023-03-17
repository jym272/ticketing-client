import React from 'react';
import { TicketingComponent, TicketingLayout } from '@src/components';
import type { SWRConfiguration } from 'swr';
import { NextApiRequest } from 'next';
import { SWRConfig } from 'swr/_internal';
import { JwtPayloadCustom } from '@src/types';
import { getEnvOrFail } from '@src/utils';

// const useIngress = process.env.NEXT_PUBLIC_INGRESS_NGINX;

export default function Home({ fallback }: { fallback: SWRConfiguration['fallback'] }) {
    return (
        <SWRConfig value={{ fallback }}>
            <TicketingLayout>
                <TicketingComponent />
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

Home.getInitialProps = async ({ req }: { req: NextApiRequest | undefined }) => {
    const isServerSide = !!req;
    let url = '/api/users/current-user';
    const headers = {};
    if (isServerSide) {
        if (!req.headers.cookie) {
            return {
                fallback: {
                    '/api/users/current-user': {
                        currentUser: null
                    }
                }
            };
        }
        const namespace = getEnvOrFail('INGRESS_NS');
        const service = getEnvOrFail('INGRESS_SVC');
        const ingressUrl = `http://${service}.${namespace}.svc.cluster.local/api/users/current-user`;
        // the controller endpoint need the cookies, the ingress need the Host header
        // Object.assign(headers, { cookie: req.headers.cookie, Host: 'ticketing.dev' });
        // proxy the headers from the web browser to the ingress
        Object.assign(headers, req.headers);
        url = ingressUrl;
    }
    const res = await fetch(url, {
        method: 'GET',
        headers
    });
    if (!res.ok) {
        return {
            fallback: {
                '/api/users/current-user': {
                    currentUser: null
                }
            }
        };
    }
    const data = (await res.json()) as { currentUser: null | JwtPayloadCustom };
    return {
        fallback: {
            '/api/users/current-user': data
        }
    };
};
