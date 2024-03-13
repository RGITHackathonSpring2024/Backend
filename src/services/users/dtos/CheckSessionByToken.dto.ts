import { IsString } from "moleculer-plus";

export class CheckSessionByTokenDto {
    @IsString()
    Token: string;
}