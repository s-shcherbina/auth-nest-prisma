import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordsMatchingConstraint } from 'src/decorators/is-passwords-matching-constraint.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
