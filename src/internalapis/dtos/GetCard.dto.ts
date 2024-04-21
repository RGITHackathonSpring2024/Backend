import { IsNotEmpty, IsString } from "class-validator";

export class GetCardDto {
    @IsNotEmpty()
    @IsString()
    cardToken: string;
}