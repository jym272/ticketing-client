import styled from 'styled-components';
import useSWR from 'swr';
import { Order, OrderStatus } from '@src/types';
import { fetcher } from '@src/utils';
import React from 'react';
import Link from 'next/link';

const OrderRow = styled.tr`
    td {
        padding: 0.5rem;
        border: 1px solid #ddd;
    }

    .link-view {
        color: #07968b;
        text-align: center;

        &:hover {
            cursor: pointer;
            color: #07968b;
            text-decoration: underline;
        }
    }

    .link-reserved {
        color: #c99b9b;
        text-align: center;
        pointer-events: none;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    thead {
        background-color: #f2f2f2;
    }

    th {
        text-align: left;
        padding: 0.5rem;
        border: 1px solid #ddd;
    }
`;

//  order.updatedAt -> to local time
const convertToLocalTime = (date: string) => {
    const localDate = new Date(date);
    return localDate.toLocaleString();
};

export const OrdersList = () => {
    const { data } = useSWR<Order[]>('/api/orders', fetcher);

    // <span className="link-reserved">Reserved</span>
    return (
        <Table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Ticket Title</th>
                    <th>Ticket Price</th>
                    <th>Ticket Id</th>
                    <th>Updated At</th>
                </tr>
            </thead>
            <tbody>
                {data
                    ?.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
                    .map(order => (
                        <OrderRow key={order.id}>
                            <td>
                                {order.status === OrderStatus.Created ? (
                                    <Link className={'link-view'} href={`/orders/${order.id}`}>
                                        View
                                    </Link>
                                ) : (
                                    order.status
                                )}
                            </td>
                            <td>{order.ticket.title}</td>
                            <td>{order.ticket.price}</td>
                            <td>{order.ticket.id}</td>
                            <td>{convertToLocalTime(order.updatedAt)}</td>
                        </OrderRow>
                    ))}
            </tbody>
        </Table>
    );
};
