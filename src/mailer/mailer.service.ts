import { Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import { EMAIL_QUEUE, EmailJob } from './email-queue.constants';
import {InjectQueue} from '@nestjs/bullmq';
import { PasswordResetEmailJob, VerificationEmailJob } from './dtos/email-jobs';
import { encryptSecret } from '../common/utils/email-crypto';

const DEFAULT_JOB_OPTIONS: JobsOptions = {
    attempts: 5,
    backoff: {type: 'exponential', delay: 5000},
    removeOnComplete: true,
    removeOnFail: {age: 3600}
};

@Injectable()
export class MailService {
    constructor (@InjectQueue(EMAIL_QUEUE) private readonly queue: Queue) {}

    async sendPasswordResetEmail(email: string, token: string, name: string) {
        const payload: PasswordResetEmailJob = {
            email, name, encryptedToken: encryptSecret(token),
        }
        await this.queue.add(EmailJob.PasswordReset, payload, DEFAULT_JOB_OPTIONS)
    }

    async sendVerificationEmail(email: string, code: string, name: string) {
        const payload: VerificationEmailJob = {
            email , name, encryptedCode: encryptSecret(code),
        }

        await this.queue.add(EmailJob.Verification, payload, DEFAULT_JOB_OPTIONS)
    }
}