import React from "react";
import { useParams } from "react-router-dom";
import { useTicket } from "./../hooks";

export default function Details() {
  const { id } = useParams();
  const ticketId = parseInt(id || "")

  const ticket = useTicket(ticketId);

  // TODO: missing ticket re-assignment
  return <div className="ticket">
    <h2>{ticket.id}: {ticket.description}</h2>
    <h2> {ticket.completed ? "Completed by" : "Assigned to"} {ticket.user?.name || "unknown"} </h2>
    <button onClick={ticket.complete}> Complete </button>
  </div>;
}