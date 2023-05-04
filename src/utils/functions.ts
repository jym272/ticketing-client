import { NextApiRequest } from 'next';
import { getEnvOrFail } from '@src/utils/env';
import { JwtPayloadCustom } from '@src/types';

export const fetcher = (url: string) => fetch(url).then(res => res.json());

export const getCurrentUser = async ({ req }: { req: NextApiRequest | undefined }) => {
    // eslint-disable-next-line no-console
    const log = console.log;

    const isServerSide = !!req;
    let url = '/api/users/current-user';
    const headers = {};
    if (isServerSide) {
        if (!req.headers.cookie) {
            log("No cookie, don't fetch the current user");
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

    const isServerSideMsg = isServerSide ? 'server side' : 'client side';
    let res: Response;

    try {
        res = await fetch(url, {
            method: 'GET',
            headers
        });
    } catch (err) {
        log(`No response from the server, fetch the current user from ${isServerSideMsg}}`);
        return {
            fallback: {
                '/api/users/current-user': {
                    currentUser: null
                }
            }
        };
    }

    if (!res.ok) {
        log(`No response from the server, fetch the current user from ${isServerSideMsg}}`);
        return {
            fallback: {
                '/api/users/current-user': {
                    currentUser: null
                }
            }
        };
    }
    const data = (await res.json()) as { currentUser: null | JwtPayloadCustom };
    log(`Fetch the current user from ${isServerSideMsg}`);
    return {
        fallback: {
            '/api/users/current-user': data
        }
    };
};

const roundToTwoDecimals = (num: number) => {
    return Math.round(num * 100) / 100;
};

export const createAValidPriceCents = (validPrice: number) => {
    return roundToTwoDecimals(validPrice * 100);
};
