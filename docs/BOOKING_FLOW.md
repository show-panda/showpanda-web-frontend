# Booking flow

This document describes the booking flow in this frontend. The booking and payment service implementations are outside this repository.

## Customer journey

1. Movie cards open `/movies/[movieId]`. The page loads `GET /movies/:movieId/showtimes`, groups shows by cinema and IST date, and disables sold out shows.
2. A show opens `/seat-layout/[showId]`. The page loads `GET /shows/:showId`, `GET /shows/:showId/seats`, and nearby showtimes. Seat prices and availability come from the seat response.
3. The customer selects up to ten available seats. The seat and total update immediately, while `POST /bookings/lock` or `POST /bookings/unlock` runs for that seat. Different seats can update concurrently; the same seat waits for its current request. A failed request reverses only that seat's visual change. **Proceed** waits until every request settles. Authentication is required before selecting a seat. Confirmed locks and seat details are stored in this tab's `sessionStorage` for navigation to review.
4. **Proceed** opens `/review-order/[showId]`. It displays the movie, cinema, screen, show date and time, selected tickets, ticket prices, offers and coupons area, and order summary. The order summary currently includes ticket prices only; no service fees or discounts are supplied by an API.
5. **Back to seats** on the review page calls `POST /bookings/unlock` for all held seats before returning. Browser Back makes a best effort to do the same. A local 120-second timer also clears the draft and attempts release when it expires.
6. Payment and coupon redemption are not connected because no payment confirmation, offer listing, coupon validation, or server-calculated total contract is present here. The payment action stays disabled. `POST /bookings` must be called only after the server verifies a successful payment; it is not called by the current seat or review pages.
7. Once a booking exists, `/bookings` loads history with `GET /bookings`; `/bookings/[id]` loads details with `GET /bookings/:id` and can cancel with `POST /bookings/:id/cancel`.

## API integration

| Operation | Backend endpoint | Frontend source |
| --- | --- | --- |
| Showtimes | `GET /movies/:movieId/showtimes` | `lib/api/showtimes.api.ts` |
| Show details | `GET /shows/:showId` | `lib/api/showtimes.api.ts` |
| Seat map | `GET /shows/:showId/seats` | `lib/api/seats.api.ts` |
| Lock selected seat | `POST /bookings/lock` | `lib/api/bookings.api.ts` |
| Unlock selected seats | `POST /bookings/unlock` | `lib/api/bookings.api.ts` |
| Create booking after verified payment | `POST /bookings` | API helper exists; no UI caller |
| Booking history | `GET /bookings` | `lib/api/bookings.api.ts` |
| Booking details | `GET /bookings/:id` | `lib/api/bookings.api.ts` |
| Cancel booking | `POST /bookings/:id/cancel` | `lib/api/bookings.api.ts` |

Lock, unlock, and booking creation use `{ "showId": "...", "showSeatIds": ["..."] }`. Protected calls use the bearer token stored in browser `localStorage` and go through the same-origin `/api/bookings/*` proxy. The proxy forwards `X-Device-Source: web`. A `401` causes one token refresh attempt in `lib/api/auth.api.ts`.

Public showtime responses are cached for 15 seconds, show details for 60 seconds, and the seat map is requested with revalidation set to zero. Time display and date grouping use `Asia/Kolkata`.

## Earlier implementation

Previously the seat page selected seats locally, then offered **Hold seats**. That button sent one lock request for the entire selection. **Confirm booking** immediately called `POST /bookings` without payment and navigated to booking details. The review page did not exist. This behavior was removed from the booking UI.

## Contracts needed to finish checkout

- Payment order creation, provider checkout, and a **server-side payment verification** result that authorizes booking creation. A browser success callback alone must not count as payment success.
- The exact relationship between payment and `POST /bookings`, including payment/order identifiers, idempotency, and recovery if payment succeeds but the booking request fails.
- Offer listing and coupon validation endpoints, their eligibility rules, and the server-calculated payable amount including fees, taxes, and discounts.
- The lock response's authoritative expiry, if provided. The frontend currently assumes 120 seconds from the first successful lock; the backend must remain authoritative.

## Current edge cases

- A full tab close or network interruption may prevent an unlock request from finishing. The server must expire locks independently.
- Seat selection is lost when an unauthenticated customer is redirected through Google sign in; they can select seats after returning.
- A lock can change between the seat map fetch and selection, so a rejected lock clears no other held seats and asks the customer to try again.
- Booking details and cancellation eligibility depend on the backend response. The detail page offers cancellation for any status except `CANCELLED`; the backend must enforce its policy.
