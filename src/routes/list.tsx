import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useTickets } from "./../hooks";

const List = () => {
  const tickets = useTickets();
  const [filter, setFilter] = useState("");

  const ticketListItems = tickets
    // Simple filtering based on searching for id, keyword, or assignee.
    // Works fine with small datasets, but we would probably want to support filtering (or
    // pagination) before grabbing all the tickets from the backend
    // NOTE: while doing a final lookover, I realize the filtering was supposed to be on status -- whoops!
    .filter(ticket => {
      if (filter === "") return true;
      return `${ticket.id}${ticket.description}${ticket.user?.name}`.includes(filter)
    })
    // Display each of the items in a raw list of items, including links to enter the details view.
    .map(ticket => {
      const displayString = `#${ticket.id} ${ticket.description} - ${ticket.completed ? "Completed by" : "Assigned to"} ${ticket.user?.name || "unknown"}`
      return <li key={displayString}>
        <Link to={`/details/${ticket.id}`} key={ticket.id} state={ticket}>{displayString} </Link>
      </li>
    })


  // TODO: missing ticket creations
  return (
    <div className="app">
      <h2>Tickets</h2>
      <input
        type="search"
        placeholder="Filter"
        value={filter}

        onChange={(e) => setFilter(e.target.value)}
      />
      {tickets ? (
        <ul aria-label="tickets">
          {ticketListItems}
        </ul>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

export default List;
