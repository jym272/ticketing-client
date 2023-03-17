import React from 'react';
import styled from 'styled-components';
import { LoginComponent } from '@src/components';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #e4e4e4;
    width: 100vw;
`;

const Login = () => {
    const { param } = useRouter().query as { param: 'signin' | 'signup' };

    return (
        <LoginContainer>
            <LoginComponent param={param} />
        </LoginContainer>
    );
};

export default Login;

// just declare the function, it's enough for 'param' in Login to be defined
// eslint-disable-next-line @typescript-eslint/require-await -- because it's required by the server-side function
export const getServerSideProps: GetServerSideProps = async context => {
    const route = context.params?.param;
    if (!route || Array.isArray(route) || !['signin', 'signup'].includes(route)) {
        return {
            notFound: true
        };
    }
    return {
        // prop not used, but it's required for the function to return a defined value
        // at this point param is defined 'signin' | 'signup'
        props: {
            param: route as 'signin' | 'signup'
        }
    };
};
