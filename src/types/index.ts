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

export interface JwtPayload {
    [key: string]: any;
    iss?: string | undefined;
    sub?: string | undefined;
    aud?: string | string[] | undefined;
    exp?: number | undefined;
    nbf?: number | undefined;
    iat?: number | undefined;
    jti?: string | undefined;
}

export interface JwtPayloadCustom extends JwtPayload {
    permissions: {
        authenticated: boolean;
    };
}

export interface Ticket {
    id: string;
    title: string;
    price: number;
}
