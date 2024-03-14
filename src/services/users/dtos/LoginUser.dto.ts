import { IsString } from "moleculer-plus";

export class LoginUserDto {
  @IsString()
  Login: string;

  @IsString()
  Password: string;
}
