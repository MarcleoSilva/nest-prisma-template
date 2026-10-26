import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from "class-validator";

export class CreateAccountDto {
    @Length(2, 80)
    @Matches(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, {
        message: 'Only letters, spaces, hifens or apostrophe',
    })
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @Length(2, 80)
    @Matches(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, {
        message: 'Only letters, spaces, hifens or apostrophe',
    })
    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string;
}