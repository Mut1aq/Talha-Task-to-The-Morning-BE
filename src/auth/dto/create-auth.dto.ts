import { IsNotEmpty, IsString, Length, Min } from 'class-validator'

export class CreateAuthDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}
