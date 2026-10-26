import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  JwtAccessPayload,
  TAuthenticatedUser,
} from '../../common/types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtAccessPayload): TAuthenticatedUser {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token de autenticação inválido');
    }

    return {
      id: payload.sub,
      issuedAt: payload.iat,
      expiration: payload.exp,
    };
  }
}
