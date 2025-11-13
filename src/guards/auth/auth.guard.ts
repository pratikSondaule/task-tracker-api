import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest()

    const authorization = request.headers.authorization

    if (!authorization) {
      throw new HttpException("Authorization token is missing", HttpStatus.FORBIDDEN)
    }

    const token = authorization.split(' ')[1]

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND)
    }

    try {

      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })

      request['user'] = payload

      return true

    } catch (error) {

      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED)

    }

  }
}
