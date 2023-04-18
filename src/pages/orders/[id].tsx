import { GetServerSideProps } from 'next';
import { getEnvOrFail } from '@src/utils';
import { Order as OrderType, OrderStatus } from '@src/types';
import { TicketingLayout } from '@src/components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
export default function Order({ order }: { order: OrderType }) {
    const initialExpiration = Math.round((new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000);
    const [expiration, setExpiration] = useState<number>(initialExpiration);
    const router = useRouter();
    // const [error, setError] = useState<string | null>(null);
    // const purchaseHandler = async () => {
    //     const res = await fetch('/api/orders', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             ticketId: ticket.id
    //         })
    //     });
    //
    //     if (res.ok) {
    //         const { order } = (await res.json()) as { order: Order };
    //         return router.push(`/orders/${order.id}`);
    //     }
    //     const { message } = (await res.json()) as { message: string };
    //     setError(message);
    // };

    useEffect(() => {
        const timerId = setInterval(() => {
            setExpiration(prevExpiration => prevExpiration - 1);
        }, 1000);

        if (initialExpiration <= 0) {
            void router.push('/');
        }

        return () => {
            clearInterval(timerId);
        };
    }, [initialExpiration, router]);

    return (
        <div>
            <TicketingLayout>
                <h1>Order {order.id}</h1>
                <h4>Ticket: {order.ticket.title}</h4>
                <h4>Price: {order.ticket.price}</h4>
                <h4>Status: {order.status}</h4>
                <h4>Expires in: {expiration} seconds</h4>
            </TicketingLayout>
        </div>
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
    if (!res.ok) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }
    const order = (await res.json()) as OrderType;

    if (order.status === OrderStatus.Cancelled) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: {
            order
        }
    };
};
