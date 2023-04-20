interface Data {
    id: number;
}
export interface PostData extends Data {
    title: string;
}

export type CommentStatus = 'approved' | 'rejected' | 'pending';
export type CommentStatusModerated = 'approved' | 'rejected';

export interface CommentData extends Data {
    text: string;
    postId: number;
    status: CommentStatus;
}
export interface CommentDataModerated extends CommentData {
    status: CommentStatusModerated;
}

export type EventType = 'PostCreated' | 'CommentCreated' | 'CommentModerated' | 'CommentUpdated';

export interface EventInterface {
    type: EventType;
    data: PostData | CommentData | CommentDataModerated;
}

export interface EventPropagated extends EventInterface {
    id: number;
}

export interface PostCreatedEvent extends EventInterface {
    data: PostData;
}

export interface CommentCreatedEvent extends EventInterface {
    data: CommentData;
}

export interface CommentModeratedEvent extends EventInterface {
    data: CommentDataModerated;
}

export interface CommentUpdatedEvent extends EventInterface {
    data: CommentData;
}

export interface QueryData extends Data {
    postId: number;
    postTitle: string;
    comments: CommentData[];
}

export interface Credentials {
    email: string;
    password: string;
}

export interface JwtPayloadCustom {
    permissions: {
        authenticated: boolean;
    };
    iat: number;
    exp: number;
    aud: string;
    iss: string;
    sub: string;
    jti: string;
}

export interface Ticket {
    id: string;
    title: string;
    price: number;
    orderId: number | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

//ORDER {
//   expiresAt: '2023-04-18T00:27:14.705Z',
//   id: 2,
//   userId: 1,
//   status: 'created',
//   version: 0,
//   ticketId: 1,
//   createdAt: '2023-04-18T00:12:14.706Z',
//   updatedAt: '2023-04-18T00:12:14.706Z',
//   ticket: {
//     price: 1,
//     id: 1,
//     title: 'Gaottt',
//     version: 3,
//     createdAt: '2023-04-17T23:53:31.716Z',
//     updatedAt: '2023-04-18T00:12:14.793Z'
//   }
// }

export enum OrderStatus {
    // When the order has been created, but the ticket it is trying to order has not been reserved
    Created = 'created',
    // The ticket the order is trying to reserve has already been reserved, or when the user has cancelled the order
    // The order expires before payment TODO: it can be three different statuses
    Cancelled = 'cancelled',
    // The order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',
    // The order has reserved the ticket and the user has provided payment successfully
    Complete = 'complete'
}
export interface Order {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
        id: string;
        title: string;
        price: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface NewOrderProps {
    order: Order;
    initialExpiration: number;
    stripePublishableKey: string;
}
