jest.mock("./../hooks", () => ({
  useTickets: () => [
    {
      id: 0,
      description: "Install a monitor arm",
      assigneeId: 111,
      completed: false,
      user: {
        name: "Vic",
        id: 111
      }
    }]
}))

import React from "react";
import { BrowserRouter} from "react-router-dom";
import { render } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import List from "./list";

test("renders learn react link", () => {
  const { getByText } = render(<BrowserRouter><List /></BrowserRouter>);
  const header = getByText(/Tickets/i);
  expect(header).toBeInTheDocument();
});

test("filters by assignee", () => {
  // Setup
  const { getByPlaceholderText, getByText } = render(<BrowserRouter><List /></BrowserRouter>);
  const filter = getByPlaceholderText("Filter");

  // Filter to a specific ticket
  userEvent.click(filter);
  userEvent.keyboard("Vic");
  expect(getByText(/Vic/)).toBeInTheDocument()

  // Filter known to not exist
  userEvent.keyboard("Vic is not here");
  expect(() => getByText(/Vic/)).toThrow()
});
