import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { JwtPayloadCustom } from '@src/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetcher } from '@src/utils';
import useSWR from 'swr';

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
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-around;
`;
interface TicketingLayoutProps {
    children: ReactNode;
    currentUser?: JwtPayloadCustom | null;
}

export const TicketingLayout = ({ children, currentUser }: TicketingLayoutProps) => {
    // `data` will always be available IF it's in `fallback`
    const { data, mutate } = useSWR<{ currentUser: null | JwtPayloadCustom }>('/api/users/current-user', fetcher, {
        revalidateOnFocus: false
    });

    const router = useRouter();

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
            void router.push('/');
        }
    };

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement<TicketingLayoutProps>(child)) {
            return React.cloneElement<TicketingLayoutProps>(child, { currentUser: currentUser ?? data?.currentUser });
        }
        return child;
    });

    return (
        <>
            <Header>
                <Logo>
                    <Link href="/">GitTix</Link>
                </Logo>
                {(currentUser ?? data?.currentUser) && (
                    <BodyHeader>
                        <Link href="/tickets/new">Sell Tickets</Link>
                        <Link href="/orders/">My Orders</Link>
                    </BodyHeader>
                )}
                <AuthContainer>
                    {!(currentUser ?? data?.currentUser) ? (
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
            {childrenWithProps}
        </>
    );
};
