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
    .link {
        color: #07968b;
        text-align: center;
        &:hover {
            cursor: pointer;
            color: #07968b;
            text-decoration: underline;
        }
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
        revalidateOnFocus: false
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
                {data?.map(ticket => (
                    <TicketRow key={ticket.id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.price}</td>
                        <td className={'link'}>
                            <Link href={`/tickets/${ticket.id}`}>view</Link>
                        </td>
                    </TicketRow>
                ))}
            </tbody>
        </Table>
    );
};
