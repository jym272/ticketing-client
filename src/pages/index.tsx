import React, { useEffect } from 'react';
import { CreatePosts, ListPosts } from '@src/components';
import useSWR from 'swr';
import { QueryData } from '@src/types';
import { useDispatch } from 'react-redux';
import { AppDispatch, updateData } from '@src/store';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const useIngress = process.env.NEXT_PUBLIC_INGRESS_NGINX;

export default function Home() {
    const dispatch: AppDispatch = useDispatch();

    const ingressUrl = `/query-posts`;
    const apiUrl = `/api/query-posts`;
    const { data } = useSWR<QueryData[]>(useIngress ? ingressUrl : apiUrl, fetcher, { refreshInterval: 1000 });

    useEffect(() => {
        if (data) {
            dispatch(updateData(data));
        }
    }, [data, dispatch]);
    return (
        <>
            <CreatePosts />
            <ListPosts />
        </>
    );
}
