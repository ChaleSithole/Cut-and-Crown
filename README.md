# Cut & Crown

A responsive website for a fictional Pretoria barber shop, with an online booking system that shares availability between all visitors, plus calendar export. Built with plain HTML, CSS and JavaScript, with a Supabase database for bookings. No frameworks and no build step.

**Live site:** https://chalesithole.github.io/cut-and-crown/

> Cut & Crown is a fictional business created for a practical assessment. The address, phone number, email and reviews are made up.

## Features

- **Pages:** Home, Services, About, Contact, Book, Terms & Conditions and Privacy Policy, on one page with hash-based navigation.
- **Booking in four steps:** service, barber (or "any available barber"), date and time, then customer details. A confirmation screen follows with a booking reference.
- **Shared, live availability:** once a time is booked, it shows as taken for every visitor on every device. Slots follow the opening hours for the chosen day and the length of the chosen service.
- **No double bookings:** the database rejects a second booking for the same barber and time, so if two people book at the same moment, one is asked to pick another slot.
- **Calendar export:**
  - **Google Calendar** link that pre-fills the title, date, time, barber, price, reference and location.
  - **Apple Calendar** event (`.ics` file) generated in the browser, with time zone and a one-hour reminder. On iPhone and iPad it opens the calendar sheet directly. It also works with Outlook and most other calendar apps.
- **Form validation:** name, email, phone number, promo code and Terms acceptance, with clear inline messages.
- **Promo code:** `FIRSTCUT` takes 10% off. A first-visit offer popup shows once, five seconds after the page loads, and closes with the × button, the Escape key or a click outside it.
- **Book this service:** every service card opens the booking with that service already selected.
- **Mobile navigation:** menu button that closes after a link is chosen.
- **Accessibility and performance:** keyboard-friendly, visible focus, skip link, reduced-motion support, lazy-loaded and compressed photos.

## Project structure

```
cut-and-crown/
├── index.html           Page markup for all views
├── styles.css           Styling and responsive layout
├── app.js               Routing, booking wizard, validation, calendar export
├── config.js            Supabase project URL and public key
├── supabase-setup.sql   Database tables and rules (run once in Supabase)
└── img/                 Compressed photos (hero, services, barbers, shopfront)
```

## How bookings work

Bookings are stored in a [Supabase](https://supabase.com) (Postgres) database. The site talks to it directly from the browser, so there is no server of my own to run.

- **Reading availability:** the site asks the database which times are taken on the chosen date. It gets back only barber and time, never customer details.
- **Making a booking:** the site calls a database function that reserves each 30-minute block and saves the booking in one step. The blocks table has a primary key on date, barber and time, which makes double-booking impossible even if two people submit at once.
- **Privacy:** both tables have row-level security turned on with no public policies, so the website can only use the two functions and cannot read names, emails or phone numbers. The key in `config.js` is a public (publishable) key by design. The shop owner reads bookings in the Supabase Table Editor.
- **Demo mode:** if `config.js` is left empty, the site still works, but bookings are only remembered in each visitor's own browser and some slots are shown as taken at random.

## Run locally

Open `index.html` in a browser, or serve the folder so it behaves like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Set up your own database

1. Create a free project at supabase.com.
2. In **SQL Editor**, paste the contents of `supabase-setup.sql` and click **Run**.
3. In **Project Settings, API Keys**, copy the Project URL and the publishable (or anon) key.
4. Paste them into `config.js`:
   ```js
   window.CC_CONFIG={url:'https://your-project.supabase.co',key:'sb_publishable_...'};
   ```
5. Never put the secret or `service_role` key in this file.

To clear all bookings, for example after testing, run this in the SQL Editor:

```sql
delete from bookings;
delete from slot_blocks;
```

## Deploy

The site is static. On GitHub Pages: **Settings, Pages, Deploy from a branch, `main` / root**. It also works on Netlify or Vercel by uploading the folder. Keep the `img/` folder next to `index.html`.

## Known limits

- There is no cancel or edit for bookings. Changes are made in the Supabase dashboard.
- There is no spam protection on the booking form, so a determined visitor could fill the calendar.
- No emails or payments are sent or processed.

## Tech

HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (ES2020), Supabase (Postgres and its REST API). Fonts: Bodoni Moda and DM Sans from Google Fonts.

## Author

Chale Sithole

## License

[MIT](LICENSE)
