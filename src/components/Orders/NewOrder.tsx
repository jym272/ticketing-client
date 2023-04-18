import StripeCheckout, { Token } from 'react-stripe-checkout';
import React, { useEffect, useState } from 'react';
import { JwtPayloadCustom, NewOrderProps } from '@src/types';
import { useRouter } from 'next/router';

export const NewOrder = ({
    order,
    initialExpiration,
    stripePublishableKey,
    currentUser
}: NewOrderProps & { currentUser?: JwtPayloadCustom | null }) => {
    const [user, setUser] = useState<JwtPayloadCustom | null>(null);
    const [expiration, setExpiration] = useState<number>(initialExpiration);
    const router = useRouter();

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
        if (!res.ok) {
            // TODO: not thro an error, better message in the UI
            throw new Error('Payment failed');
        }
        const result = (await res.json()) as { message?: string };
        // eslint-disable-next-line no-console
        console.log(result); // TODO: do a message or something
    };

    if (!user) return null;
    return (
        <div>
            <h1>Order {order.id}</h1>
            <h4>Ticket: {order.ticket.title}</h4>
            <h4>Price: {order.ticket.price}</h4>
            <h4>Status: {order.status}</h4>
            <h4>Expires in: {expiration} seconds</h4>
            <StripeCheckout
                token={createPayment}
                stripeKey={stripePublishableKey}
                amount={order.ticket.price * 100}
                email={user.sub}
            />
        </div>
    );
};
