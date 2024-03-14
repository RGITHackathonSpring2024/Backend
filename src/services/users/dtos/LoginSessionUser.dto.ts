import { IsArray, IsObjectID, IsString } from "moleculer-plus";
import { AUTH_SCOPES_ARRAY } from "./Scopes.dto";

export class LoginSessionUserDto {
  @IsString()
  UserIdentifier: string;

  @IsArray()
  Scopes: string[]
}
