import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { EMAIL_QUEUE, EmailJob } from "./email-queue.constants";
import { Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Job, UnrecoverableError } from "bullmq";
import { PasswordResetEmailJob, VerificationEmailJob } from "./dtos/email-jobs";
import { decryptSecret } from "../common/utils/email-crypto";
import { escapeHtml } from "../common/utils/escape-html";

@Processor(EMAIL_QUEUE, {concurrency: 5})
export class EmailProcessor extends WorkerHost {
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly mailer: MailerService) {
        super();
    }

    async process(job: Job): Promise<void> {
        this.logger.log(
            `Processando job ${job.id} (${job.name}), tentativa ${job.attemptsMade + 1}`
        )
    

    switch (job.name) {
        case EmailJob.Verification:
            return this.sendVerification(job.data as VerificationEmailJob);
        case EmailJob.PasswordReset:
            return this.sendPasswordReset(job.data as PasswordResetEmailJob);
        default:
            throw new UnrecoverableError(
                `Job de email desconhecido: ${job.name}`
            )
    }

}
    private decrypt(encrypted: string): string {
        try {
            return decryptSecret(encrypted);
        } catch (err) {
            throw new UnrecoverableError(
                `Falha ao decifrar segredo do job: ${(err as Error).message}`
            )
        }
    }

    private async sendVerification(data: VerificationEmailJob): Promise<void> {
        const code = this.decrypt(data.encryptedCode);
        const safeName = escapeHtml(data.name);
        await this.mailer.sendMail({
            to: data.email,
            subject: 'Verifique seu Email',
            html:
            `
            <h2>Verificação de email</h2>
                <p>${safeName}, use o código abaixo para finalizar seu cadastro e verificar sua conta:</p>
                <p style="font-weight: bold; font-size: 32px; letter-spacing: 6px">${code}</p>
                <p>Esse código expira em <strong>15 minutos</strong>.</p> 
            `
        })
    }

    private async sendPasswordReset(data: PasswordResetEmailJob): Promise<void> {
        const token = this.decrypt(data.encryptedToken);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const safeName = escapeHtml(data.name);
        await this.mailer.sendMail({
            to: data.email,
            subject: 'Mudar senha',
            html:
            `
            ${safeName},para alterar a senha, clique no link abaixo:

            <a href="${resetUrl}"> Trocar senha </a>
            <p>Esse link vai expirar em 15 minutos</p>
            <p>Se você não solicitou esse email, por favor ignorar. </p>
            `
        })
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, err: Error): void {
        this.logger.error(
            `Job ${job?.id} (${job?.name}) falhou após ${job?.attemptsMade} tentativa(s): ${err.message}`
        )
    }
}