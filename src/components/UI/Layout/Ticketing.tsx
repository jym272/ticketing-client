import { ReactNode } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { JwtPayloadCustom } from '@src/types';
import { fetcher } from '@src/utils';
import Link from 'next/link';

const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background-color: #e4e4e4;
    width: 100vw;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    color: #000;
    margin-left: 1rem;
`;

const AuthContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 10rem;
`;
const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 5rem;
    cursor: pointer;
    color: #000;
    font-size: 1rem;
    font-weight: 600;
    margin-right: 1rem;
`;

export const TicketingLayout = ({ children }: { children: ReactNode }) => {
    // `data` will always be available as it's in `fallback` -> it's never undefined
    const { data, mutate } = useSWR<{ currentUser: null | JwtPayloadCustom }>('/api/users/current-user', fetcher);
    //TODO: refactor for signing out with useSWR -> limit the auto revalidation!!, create a loading state ->
    // block buttons, show some frontend, etc...

    const signoutHandler = async () => {
        const res = await fetch('/api/users/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            await mutate({ currentUser: null });
        }
    };

    return (
        <>
            <Header>
                <Logo>
                    <Link href="/">GitTix</Link>
                </Logo>
                {data?.currentUser === null && (
                    <AuthContainer>
                        <Container>
                            <Link href="/auth/signup">Sign Up</Link>
                        </Container>
                        <Container>
                            <Link href="/auth/signin">Sign In</Link>
                        </Container>
                    </AuthContainer>
                )}
                {data?.currentUser && (
                    <AuthContainer>
                        <Container onClick={signoutHandler}>Sign Out</Container>
                    </AuthContainer>
                )}
            </Header>
            {data?.currentUser && <div>{JSON.stringify(data.currentUser)}</div>}
            {children}
        </>
    );
};

// const signMethod = isLogin ? 'signin' : 'signup';
// const response = await fetch(`/api/users/${signMethod}`, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
// });
//
// const result = (await response.json()) as { message?: string };
//
// if (response.status >= 400) {
//     setError('root.serverError', {
//         type: '400',
//         message: result.message ?? 'Something went wrong, try again later'
//     });
//     return;
// }
// await router.push('/');
