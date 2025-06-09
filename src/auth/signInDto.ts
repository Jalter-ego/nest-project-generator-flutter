import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignInGoogle{
  @IsString()
  @IsNotEmpty()
  token:string
}
