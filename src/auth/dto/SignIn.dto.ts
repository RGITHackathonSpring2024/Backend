import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsString()
 //   @MinLength(1)
  //  @MaxLength(20)
    credential: string

    @IsNotEmpty()
    @IsString()
  //  @MinLength(8)
  //  @MaxLength(32)
    password: string
}