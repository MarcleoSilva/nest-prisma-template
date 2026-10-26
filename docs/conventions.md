# Conventions
v0.0
## Money
Money is diveded in whole and cents. They are separated in the database, preventing working money with float.

## Rerservations
Reservations are dates without timestamp. By regulation check-in starts at 14 PM and check-out by 10 AM. They are in the international format DD/MM/YYYY.

## Date and Time
Date and time are calculated in the America/Sao_Paulo timestamp, based on the flat's location. (`now` follows this rule)

## Nights
THe amount of nights is calculated by the amount of days minus one (check-in day and check-out day).



