import useSWR from 'swr';
import { fetcher } from '@src/utils';
import styled from 'styled-components';
import Link from 'next/link';
import { Ticket } from '@src/types';

const TicketRow = styled.tr`
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

export const TicketsList = () => {
    const { data } = useSWR<Ticket[]>('/api/tickets', fetcher, {
        revalidateOnFocus: true
    });

    return (
        <Table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {data
                    ?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                    .map(ticket => (
                        <TicketRow key={ticket.id}>
                            <td>{ticket.title}</td>
                            <td>{ticket.price}</td>
                            <td className={!ticket.orderId ? 'link-view' : 'link-reserved'}>
                                <Link href={`/tickets/${ticket.id}`}>{!ticket.orderId ? 'view' : 'reserved'}</Link>
                            </td>
                        </TicketRow>
                    ))}
            </tbody>
        </Table>
    );
};
