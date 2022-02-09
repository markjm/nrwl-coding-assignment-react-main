import React, { useEffect, useState } from "react";
import { BackendService, User, Ticket } from "./backend";
import { firstValueFrom } from "rxjs";

type UserTicket = Ticket & { user?: User, complete?: any }

const backend = new BackendService();

// I like the semi-recent pattern of network-related hooks returning something like
// `[data, loading, error]` so that the consumer can handle the loading/error case more
// explicitely. Since 2 hours is not enough time for me to handle errors and loading delays
// on the rendering side, I figure I'll leave out that complexity from these hooks as well.
export function useTicket(id: number) {
  const [ticket, setTicket] = useState({} as UserTicket);
  useEffect(() => {
    const fetchData = async () => {
      // Not super familiar with rxjs, so maybe there is a better way to chain data requests...
      const rawTicket = await firstValueFrom(backend.ticket(id));
      const user = await firstValueFrom(backend.user(rawTicket.assigneeId!))
      const ticket = rawTicket as UserTicket
      ticket.user = user;
      setTicket(ticket);
    };
    fetchData();
  }, [id]);

  ticket.complete = async () => {
    const toggled = !ticket.completed;
    // messed up first render
    setTicket({ ...ticket, completed: toggled })
    const result = await firstValueFrom(backend.complete(id,toggled));
  }

  return ticket
}

export function useTickets() {
  const [tickets, setTickets] = useState([] as UserTicket[]);
  useEffect(() => {
    const fetchData = async () => {
      const [users, tickets]: [User[], UserTicket[]] = await Promise.all([
        firstValueFrom(backend.users()),
        firstValueFrom(backend.tickets())])
      for (let t of tickets) {
        t.user = users.find(u => u.id === t.assigneeId)
      }
      setTickets(tickets);
    };
    fetchData().catch(() => setTickets([]));

  }, []);
  return tickets
}
