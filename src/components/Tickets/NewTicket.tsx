import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { JwtPayloadCustom } from '@src/types';
import { fetcher } from '@src/utils';

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #f5f5f5;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #f5f5f5;
`;

const Input = styled.input`
    width: 300px;
    height: 35px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #dfd9d9;
    padding: 12px;
    //z-index: 2;
    outline: none;

    &:hover {
        border: 1px solid #07968b;
    }
    &:focus {
        border: 2px solid #07968b;
    }

    &:valid + span::after {
        content: '✓';
        color: #00ff00;
    }
    &:invalid + span::after {
        content: '✗';
        color: #ff0000;
    }
`;

const ServerError = styled.div`
    //position: absolute;
    height: 20px;
    bottom: -10%;
    font-size: 12px;
    font-weight: 400;
    color: #ff0000;
    font-family: 'Ubuntu Mono', monospace;
`;

interface Inputs {
    title: string;
    price: number;
}

export const NewTicketComponent = () => {
    const router = useRouter();
    const { data } = useSWR<{ currentUser: null | JwtPayloadCustom }>('/api/users/current-user', fetcher, {
        revalidateOnFocus: false
    });

    useEffect(() => {
        if (data?.currentUser === null) {
            void router.push('/auth/signin');
        }
    }, [data, router]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<Inputs>();
    // eslint-disable-next-line no-console
    const onSubmit: SubmitHandler<Inputs> = async data => {
        const response = await fetch(`/api/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = (await response.json()) as { message?: string };

        if (response.status >= 400) {
            setError('root.serverError', {
                type: '400',
                message: result.message ?? 'Something went wrong, try again later'
            });
            return;
        }
        await router.push('/');
    };

    return (
        <>
            <CardContainer>
                <h1>New Ticket</h1>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="title">Title</label>
                    <Input
                        type="text"
                        minLength={1}
                        maxLength={255}
                        required
                        placeholder="e.g. Concert"
                        {...register('title', { required: true })}
                    />

                    <label htmlFor="price">Price</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        defaultValue="1.00"
                        placeholder="e.g. 10.00"
                        max="999999"
                        list="defaultNumbers"
                        required
                        {...register('price', {
                            required: true,
                            pattern: {
                                value: /^(?=.*\d)(?!0+(?:\.0{1,2})?$)(?:0*(?:[1-9]\d{0,4}|\d{0,4}\.\d{1,2})|[1-9]\d{0,5})(?:\.\d{1,2})?$/,
                                message: 'Price must be a number with 2 decimal places between 0.01 and 999999'
                            }
                        })}
                    />
                    <span className="asd"></span>

                    {errors.title && <span>Title is required</span>}
                    {errors.price?.type === 'required' && <span>Price is required</span>}
                    {errors.price?.type === 'pattern' && <span>{errors.price.message}</span>}

                    <input type="submit" />
                </Form>
            </CardContainer>
            {errors.root?.serverError.type === '400' && <ServerError>{errors.root.serverError.message}</ServerError>}
        </>
    );
};
