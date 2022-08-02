import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  signup(@Body() createAuthDto: CreateAuthDto, @Body('username') username: string, @Body('password') password: string) {
    return this.authService.signup(username, password)
  }

}
