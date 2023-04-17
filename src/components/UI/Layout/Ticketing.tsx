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
    height: ${props => props.theme.constants.headerHeight};
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

const BodyHeader = styled.div`
    display: flex;
`;

export const TicketingLayout = ({ children }: { children: ReactNode }) => {
    // `data` will always be available as it's in `fallback` -> it's never undefined
    const { data, mutate } = useSWR<{ currentUser: null | JwtPayloadCustom }>('/api/users/current-user', fetcher, {
        revalidateOnFocus: false
    });

    const signoutHandler = async () => {
        const res = await fetch('/api/users/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            await mutate(
                { currentUser: null },
                {
                    revalidate: false,
                    populateCache: () => {
                        return { currentUser: null };
                    }
                }
            );
        }
    };

    return (
        <>
            <Header>
                <Logo>
                    <Link href="/">GitTix</Link>
                </Logo>
                <BodyHeader>{data?.currentUser && <Link href="/tickets/new">Tickets</Link>}</BodyHeader>
                <AuthContainer>
                    {!data?.currentUser ? (
                        <>
                            <Container>
                                <Link href="/auth/signup">Sign Up</Link>
                            </Container>
                            <Container>
                                <Link href="/auth/signin">Sign In</Link>
                            </Container>
                        </>
                    ) : (
                        <Container onClick={signoutHandler}>Sign Out</Container>
                    )}
                </AuthContainer>
            </Header>
            {children}
        </>
    );
};
