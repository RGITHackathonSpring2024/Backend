import { IsString } from "moleculer-plus";

export class FindUserByLoginDto {
    @IsString()
    Login: string;
}