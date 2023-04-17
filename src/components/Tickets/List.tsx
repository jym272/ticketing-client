import useSWR from 'swr';
import { fetcher } from '@src/utils';
import styled from 'styled-components';

interface Ticket {
    id: string;
    title: string;
    price: number;
}

const TicketContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    width: 160px;
    background-color: #e4e4e4;
    margin: 1rem;
`;

const Ticket = ({ ticket }: { ticket: Ticket }) => {
    return (
        <TicketContainer>
            <div>{ticket.title}</div>
            <div>{ticket.price}</div>
        </TicketContainer>
    );
};

const ListContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: #f5f5f5;
`;

export const TicketsList = () => {
    const { data } = useSWR<Ticket[]>('/api/tickets', fetcher, {
        revalidateOnFocus: false
    });

    return (
        <ListContainer>
            {data?.map(ticket => (
                <Ticket key={ticket.id} ticket={ticket} />
            ))}
        </ListContainer>
    );
};
