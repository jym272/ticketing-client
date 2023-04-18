import { GetServerSideProps } from 'next';
import { getEnvOrFail } from '@src/utils';
import { Order, Ticket as TicketType } from '@src/types';
import { TicketingLayout } from '@src/components';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';

const PurchaseButton = styled.button`
    background-color: #000;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    &:hover {
        background-color: #333;
    }
`;

export default function Ticket({ ticket }: { ticket: TicketType }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const purchaseHandler = async () => {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ticketId: ticket.id
            })
        });

        if (res.ok) {
            const { order } = (await res.json()) as { order: Order };
            return router.push(`/orders/${order.id}`);
        }
        const { message } = (await res.json()) as { message: string };
        setError(message);
    };

    return (
        <div>
            <TicketingLayout>
                <h1>Ticket {ticket.id}</h1>
                <h4>Title: {ticket.title}</h4>
                <h4>Price: {ticket.price}</h4>
                <PurchaseButton onClick={purchaseHandler}>Purchase</PurchaseButton>
                {error && <p>{error}</p>}
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

    const endpoint = `/api/tickets/${id}`;
    const headers = {};
    const req = context.req;
    const namespace = getEnvOrFail('INGRESS_NS');
    const service = getEnvOrFail('INGRESS_SVC');
    const ingressUrl = `http://${service}.${namespace}.svc.cluster.local${endpoint}`;
    Object.assign(headers, req.headers); // the ingressUrl it needs the host header
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
    const ticket = (await res.json()) as TicketType;

    return {
        props: {
            ticket
        }
    };
};
