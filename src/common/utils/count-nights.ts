import { ReservationDates } from "../dto/reservation-dates.dto";

export function CountNights(reservationDate: ReservationDates):number  {
    
    const differenceMs = reservationDate.checkout.getTime() - reservationDate.checkin.getTime();
    
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

    return Math.round(differenceDays);
}