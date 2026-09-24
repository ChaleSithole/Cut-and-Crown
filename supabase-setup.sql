-- Cut & Crown: shared booking database for Supabase.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists bookings (
  id          uuid primary key default gen_random_uuid(),
  ref         text unique not null,
  service     text not null,
  barber      text not null,
  day         date not null,
  start_min   int  not null,
  duration    int  not null,
  name        text not null,
  email       text not null,
  phone       text not null,
  notes       text,
  price       int  not null,
  created_at  timestamptz not null default now()
);

-- One row per 30-minute block. The primary key makes double-booking impossible.
create table if not exists slot_blocks (
  day    date not null,
  barber text not null,
  block  int  not null,
  primary key (day, barber, block)
);

-- Lock both tables. Visitors can only use the two functions below,
-- so nobody can read names, emails or phone numbers from the website.
alter table bookings    enable row level security;
alter table slot_blocks enable row level security;

-- Which times are taken on a day (no personal details).
create or replace function taken_slots(d date)
returns table (barber text, block int)
language sql security definer set search_path = public as $$
  select s.barber, s.block from slot_blocks s where s.day = d;
$$;

-- Create a booking. Fails with a 409 if any block is already taken.
create or replace function create_booking(
  p_ref text, p_service text, p_barber text, p_day date, p_start int,
  p_duration int, p_name text, p_email text, p_phone text, p_notes text, p_price int
) returns void
language plpgsql security definer set search_path = public as $$
declare i int; n int := ceil(p_duration / 30.0);
begin
  if p_barber not in ('marcus','liam','thabo') then raise exception 'invalid barber'; end if;
  if p_day < current_date - 1 or p_day > current_date + 61 then raise exception 'invalid date'; end if;
  if p_start < 480 or p_start > 1080 or p_duration not between 15 and 120 then raise exception 'invalid time'; end if;
  if length(trim(p_name)) not between 2 and 100
     or length(p_email) > 200 or length(p_phone) > 30 or length(coalesce(p_notes,'')) > 500
  then raise exception 'invalid details'; end if;

  for i in 0 .. n - 1 loop
    insert into slot_blocks (day, barber, block) values (p_day, p_barber, p_start + i * 30);
  end loop;

  insert into bookings (ref, service, barber, day, start_min, duration, name, email, phone, notes, price)
  values (p_ref, p_service, p_barber, p_day, p_start, p_duration, trim(p_name), trim(p_email), trim(p_phone), nullif(trim(p_notes),''), p_price);
end;
$$;

revoke all on function taken_slots(date) from public;
revoke all on function create_booking(text,text,text,date,int,int,text,text,text,text,int) from public;
grant execute on function taken_slots(date) to anon;
grant execute on function create_booking(text,text,text,date,int,int,text,text,text,text,int) to anon;
