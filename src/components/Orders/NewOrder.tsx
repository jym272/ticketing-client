import StripeCheckout from 'react-stripe-checkout';
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

    if (!user) return null;
    return (
        <div>
            <h1>Order {order.id}</h1>
            <h4>Ticket: {order.ticket.title}</h4>
            <h4>Price: {order.ticket.price}</h4>
            <h4>Status: {order.status}</h4>
            <h4>Expires in: {expiration} seconds</h4>
            <StripeCheckout
                token={token => {
                    // eslint-disable-next-line no-console
                    console.log('TOKEN', token);
                }}
                stripeKey={stripePublishableKey}
                amount={order.ticket.price * 100}
                email={user.sub}
            />
        </div>
    );
};
//{
//     "id": "tok_1MyLRiFCS8gMf7cqCfxzdMXU",
//     "object": "token",
//     "card": {
//         "id": "card_1MyLRhFCS8gMf7cqKomrjrgn",
//         "object": "card",
//         "address_city": null,
//         "address_country": null,
//         "address_line1": null,
//         "address_line1_check": null,
//         "address_line2": null,
//         "address_state": null,
//         "address_zip": null,
//         "address_zip_check": null,
//         "brand": "Visa",
//         "country": "US",
//         "cvc_check": "unchecked",
//         "dynamic_last4": null,
//         "exp_month": 2,
//         "exp_year": 2025,
//         "funding": "credit",
//         "last4": "4242",
//         "name": "a@a.com",
//         "tokenization_method": null,
//         "wallet": null
//     },
//     "client_ip": "186.22.17.71",
//     "created": 1681850894,
//     "email": "a@a.com",
//     "livemode": false,
//     "type": "card",
//     "used": false
// }
