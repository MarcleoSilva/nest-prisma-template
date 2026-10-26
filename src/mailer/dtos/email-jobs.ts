export interface VerificationEmailJob {
    email: string;
    name: string;
    encryptedCode: string;
}

export interface PasswordResetEmailJob {
    email: string;
    name: string;
    encryptedToken: string;
}