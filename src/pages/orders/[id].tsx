import { GetServerSideProps } from 'next';
import { NewOrderProps, Order as OrderType, OrderStatus } from '@src/types';
import { NewOrder, TicketingLayout } from '@src/components';
import React from 'react';
import { getEnvOrFail } from '@src/utils';
import { getSecretOrFail } from '@src/utils/getSecret';

export default function Order(props: NewOrderProps) {
    return (
        <TicketingLayout>
            <NewOrder {...props} />
        </TicketingLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async context => {
    const id = context.params?.id;
    if (!id || Array.isArray(id) || isNaN(Number(id))) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        };
    }

    const endpoint = `/api/orders/${id}`;
    const headers = {};
    const req = context.req;
    const namespace = getEnvOrFail('INGRESS_NS');
    const service = getEnvOrFail('INGRESS_SVC');
    const ingressUrl = `http://${service}.${namespace}.svc.cluster.local${endpoint}`;
    Object.assign(headers, req.headers); // the ingressUrl it needs the host header and the cookie!
    const res = await fetch(ingressUrl, {
        method: 'GET',
        headers
    });
    // for example, if the user is not logged in, ie: not authenticated and not cookie
    if (!res.ok) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }
    const order = (await res.json()) as OrderType;

    const initialExpiration = Math.round((new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000);

    if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Complete || initialExpiration <= 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: {
            order,
            initialExpiration,
            stripePublishableKey: getSecretOrFail('STRIPE_PUBLISHABLE_KEY')
        }
    };
};
