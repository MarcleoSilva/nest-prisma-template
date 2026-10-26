export const EMAIL_QUEUE = 'email';

export const EmailJob = {
    Verification: 'verification',
    PasswordReset: 'password-reset'
} as const;

export type EmailJobName = (typeof EmailJob)[keyof typeof EmailJob]