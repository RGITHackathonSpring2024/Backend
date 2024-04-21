import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ProcessTransactionDto {
    @IsNotEmpty()
    @IsString()
    cardId: string;

    @IsNotEmpty()
    @IsString()
    institutionId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(65535)
    amount: number;
}