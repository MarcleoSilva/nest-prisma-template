import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class ReservationDates {
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    checkin!: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    checkout!: Date;
}