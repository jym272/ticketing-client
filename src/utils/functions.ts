import { NextApiRequest } from 'next';
import { getEnvOrFail } from '@src/utils/env';
import { JwtPayloadCustom } from '@src/types';

export const fetcher = (url: string) => fetch(url).then(res => res.json());

export const getCurrentUser = async ({ req }: { req: NextApiRequest | undefined }) => {
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
