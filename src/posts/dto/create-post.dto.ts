import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    textBody: string;

    @IsNumber()
    @IsNotEmpty()
    likes: string;
}
