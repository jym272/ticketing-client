import StripeCheckout, { Token } from 'react-stripe-checkout';
import React, { useEffect, useState } from 'react';
import { JwtPayloadCustom, NewOrderProps } from '@src/types';
import { useRouter } from 'next/router';
import { createAValidPriceCents } from '@src/utils';
import styled from 'styled-components';

const Container = styled.div`
    //display: flex;
    button {
        //background-image: #07968b;
        //color: #000000;
        //width: 100%;
        //pointer-events: none;
        //cursor: not-allowed;
    }

    span {
        //background-image: linear-gradient(rgb(125, 197, 238), rgb(0, 140, 221) 85%, rgb(48, 162, 228));
        //font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        //font-size: 14px;
        //position: relative;
        //padding: 0px 12px;
        //display: block;
        //height: 30px;
        //line-height: 30px;
        //color: rgb(16, 0, 0);
        //font-weight: bold;
        //box-shadow: rgba(255, 255, 255, 0.25) 0px 1px 0px inset;
        //text-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px;
        //border-radius: 4px;
    }
`;

interface PaymentStatus {
    status?: 'loading' | 'success' | 'error';
    message?: string;
}
export const NewOrder = ({
    order,
    initialExpiration,
    stripePublishableKey,
    currentUser
}: NewOrderProps & { currentUser?: JwtPayloadCustom | null }) => {
    const [user, setUser] = useState<JwtPayloadCustom | null>(null);
    const [expiration, setExpiration] = useState<number>(initialExpiration);
    const router = useRouter();
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({});

    useEffect(() => {
        if (expiration <= 0) {
            void router.push('/');
        }
    }, [expiration, router]);

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setExpiration(prevExpiration => prevExpiration - 1);
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [currentUser, initialExpiration, router]);

    const createPayment = async (token: Token) => {
        setPaymentStatus({ status: 'loading', message: 'Processing payment...' });
        const res = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token.id,
                orderId: order.id
            })
        });
        if (res.ok) {
            setPaymentStatus({ status: 'success', message: 'Payment successful!' });
            await new Promise(resolve => setTimeout(resolve, 600));
            return router.push('/orders');
        }
        let msg;
        try {
            const result = (await res.json()) as { message?: string };
            msg = result.message ?? 'Payment failed!';
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
        setPaymentStatus({ status: 'error', message: msg });
    };

    if (!user) return null;
    return (
        <Container>
            <h1>Order {order.id}</h1>
            <h4>Ticket: {order.ticket.title}</h4>
            <h4>Price: {order.ticket.price}</h4>
            <h4>Status: {order.status}</h4>
            <h4>Expires in: {expiration} seconds</h4>
            <StripeCheckout
                token={createPayment}
                stripeKey={stripePublishableKey}
                amount={createAValidPriceCents(order.ticket.price)}
                email={user.sub}
            />
            {paymentStatus.status === 'loading' && <span>{paymentStatus.message}</span>}
            {paymentStatus.status === 'success' && <span>{paymentStatus.message}</span>}
            {paymentStatus.status === 'error' && <span>{paymentStatus.message}</span>}
        </Container>
    );
};
