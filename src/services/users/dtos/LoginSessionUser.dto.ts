import { IsObjectID, IsString } from "moleculer-plus";

export class LoginSessionUserDto {
    @IsObjectID()
    UserIdentifier: string;
}