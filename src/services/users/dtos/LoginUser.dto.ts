import { IsArray, IsString } from "moleculer-plus";
import { AUTH_SCOPES_ARRAY } from "./Scopes.dto";



export class LoginUserDto {
  @IsString()
  Login: string;

  @IsString()
  Password: string;

  @IsArray()
  Scopes: string[]
}
