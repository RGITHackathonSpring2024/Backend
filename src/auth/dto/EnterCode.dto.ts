import { IsNotEmpty, IsString, Length, ValidateIf } from "class-validator";

export class EnterCodeDto {
    @IsNotEmpty()
    @IsString()
    @ValidateIf(o => !!o && (o.length === 6))
    code: string
}