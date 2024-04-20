import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]*$/)
  login: string;

  @IsNotEmpty()
  @IsString()
  //   @MinLength(8)
  //   @MaxLength(32)
  //   @IsStrongPassword({
  //       minLength: 8,
  //       minLowercase: 1,
  //      minUppercase: 1,
  //      minNumbers: 1,
  //      minSymbols: 1
  //  })
  password: string;
}
