import { Controller, Get, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Get("/@me")
    async getMe(@Request() req) {
      return {
        user: req.user,
      };
    }
}
