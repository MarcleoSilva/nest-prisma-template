import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { createHash, randomInt } from 'crypto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mailer/mailer.service';



const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;
const MAX_VERIFICATION_ATTEMPTS = 5;
const BASE_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESEND_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const INVALID_CODE_MESSAGE = 'Código inválido';
const RESEND_GENERIC_MESSAGE =
  'Se houver um cadastro pendente para este e-mail, enviamos um novo código';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailService,
    private jwtService: JwtService,
  ) { }
  // helper functions

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async generateVerificationCode(): Promise<{
    verificationCode: string;
    hashedVerificationCode: string;
  }> {
    const verificationCode = randomInt(0, 1_000_000)
        .toString()
        .padStart(6,'0');
    
    const hashedVerificationCode = await argon2.hash(verificationCode);

    return {verificationCode, hashedVerificationCode}
  }

  // main methods
  async registerAccount(dto: CreateAccountDto) {
    const alreadyExists = await this.prisma.user.findUnique({
      where: { email: dto.email},
    })

    if (alreadyExists) throw new ConflictException('Email já registrado');
    
    const hashedPassword = await argon2.hash(dto.password);

    const {verificationCode, hashedVerificationCode} = await this.generateVerificationCode();

    let sessionToken: string;

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          passwordHash: hashedPassword
        }
      })

      await tx.emailVerification.create({
        data: {
          userId: user.id,
          codeHash: hashedVerificationCode,
          expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
        }
      })

      sessionToken = await this.jwtService.signAsync({
        sub: user.id,
        email: dto.email,
        type: 'registration',
      },
    { expiresIn: '15m'})
    })

    await this.mailer.sendVerificationEmail(
      dto.email, verificationCode, dto.firstName
    )

    return {
      message:
        'Conta registrada com sucesso. Verifique seu email para confirmar o cadastro',
        sessionToken: sessionToken!,
    }
  }
  
}