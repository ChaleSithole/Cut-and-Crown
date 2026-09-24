# Cut & Crown

A responsive website for a fictional Pretoria barber shop, with a full online booking flow and calendar export. Built with plain HTML, CSS and JavaScript. No frameworks, no build step, no backend.

**Live site:** https://chalesithole.github.io/Cut-and-Crown/

> Cut & Crown is a fictional business created for a practical assessment. The address, phone number, email and reviews are made up.

## Features

- **Pages:** Home, Services, About, Contact, Book, Terms & Conditions and Privacy Policy, all on one page with hash-based navigation.
- **Booking in four steps:** service, barber (or "any available barber"), date and time, then customer details. A confirmation screen follows with a booking reference.
- **Live availability:** time slots follow the opening hours for the chosen day and the length of the chosen service. Times that are already taken or have passed are disabled.
- **Calendar export:**
  - **Google Calendar** link that pre-fills the title, date, time, barber, price, reference and location.
  - **Apple Calendar (.ics)** file generated in the browser, with time zone and a one-hour reminder. It also opens in Outlook and most other calendar apps.
- **Form validation:** name, email, phone number, promo code and Terms acceptance, with clear inline messages.
- **Promo code:** `FIRSTCUT` takes 10% off. A first-visit offer popup shows once after a few seconds, closes with the × button, the Escape key or a click outside it.
- **Book this service:** every service card opens the booking with that service already selected.
- **Mobile navigation:** menu button that closes after a link is chosen.
- **Accessibility and performance:** keyboard-friendly, visible focus, skip link, reduced-motion support, lazy-loaded and compressed photos.

## Project structure

```
cut-and-crown/
├── index.html    Page markup for all views
├── styles.css    Styling and responsive layout
├── app.js        Routing, booking wizard, validation, calendar export
└── img/          Compressed photos (hero, services, barbers, shopfront)
```

## Run locally

Open `index.html` in a browser, or serve the folder so the behaviour matches production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

The site is static. On GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. It also works on Netlify or Vercel by uploading the folder. Keep the `img/` folder next to `index.html`.

## How bookings work

There is no server or database, so this is a front-end demonstration of the customer journey:

- Availability is simulated. Some slots are marked as taken so the picker behaves realistically.
- A confirmed booking is remembered in the visitor's own browser (`localStorage`) so the same slot can't be booked twice on that device.
- No emails or payments are sent or processed, and no personal details leave the browser.

A real version would add a backend to store bookings, check availability across devices and send confirmation emails.

## Tech

HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (ES2020). Fonts: Bodoni Moda and DM Sans from Google Fonts.

## Author

Chale Sithole

## License

[MIT](LICENSE)
