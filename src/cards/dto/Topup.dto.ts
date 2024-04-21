import { IsNotEmpty, IsPositive, Max } from "class-validator";

export class TopupDto {
    @IsNotEmpty()
    @IsPositive()
    @Max(65535)
    amount: number;
}