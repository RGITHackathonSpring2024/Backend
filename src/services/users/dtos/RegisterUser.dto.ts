import { IsString } from "moleculer-plus";

export class RegisterUserDto {
    @IsString()
    Login: string;

    @IsString()
    Password: string;
}