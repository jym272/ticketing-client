import { useRouter } from 'next/router';
import useSWR from 'swr';
import { JwtPayloadCustom } from '@src/types';
import React, { useEffect, useState } from 'react';
import { CreatePosts, ListPosts } from '@src/components';
import { fetcher } from '@src/utils';

export const TicketingComponent = () => {
    // `data` will always be available as it's in `fallback`.e
    const router = useRouter();
    const { data } = useSWR<{ currentUser: null | JwtPayloadCustom }>('/api/users/current-user', fetcher);
    const [signedIn, setSignedIn] = useState(data?.currentUser !== null);

    useEffect(() => {
        if (data) {
            // if (!data.currentUser) {
            //     return void router.push('/auth/signup');
            // }
            // const { permissions, exp } = data.currentUser;
            //
            // if (!permissions.authenticated) {
            //     return void router.push('/auth/signup');
            // }
            // if (!exp || exp < Date.now() / 1000) {
            //     return void router.push('/auth/signup');
            // }
            // setting when useSwr refetches
            setSignedIn(data.currentUser !== null);
        }
    }, [data, router]);

    return (
        <>
            <CreatePosts />
            <ListPosts />
            {signedIn && <div>Signed In</div>}
            {!signedIn && <div>NOIOOOOOOOOOOOOOOt Signed In</div>}
        </>
    );
};
