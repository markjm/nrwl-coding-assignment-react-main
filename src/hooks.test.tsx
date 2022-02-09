import { renderHook, act, waitForNextUpdate } from '@testing-library/react-hooks'
import { useTickets, useTicket } from './hooks'
import * as rxjs from 'rxjs';

// Since backend implementation is already basically mocked, not re-mocking it here

beforeAll(() => jest.restoreAllMocks())

test('should return the list of all tickets', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useTickets())
  await waitForNextUpdate()

  expect(result.current.length).toBe(2)
})

test('should return an empty list if the request fails', async () => {
  // intercepting rxjs as a good point of fault injection.
  const spy = jest.spyOn(rxjs, "firstValueFrom")
  spy.mockRejectedValueOnce(new Error());

  const { result, waitForNextUpdate } = renderHook(() => useTickets())
  await waitForNextUpdate()

  expect(result.current.length).toBe(0)
})