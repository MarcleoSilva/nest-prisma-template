import { IsInt, IsNotEmpty, Min} from 'class-validator'

export class MoneyDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    whole!: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    cents!: number;

}