
const {
    NEXT_PUBLIC_BASE_URL = 'http://localhost:3000',
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_HOST,
    SMTP_FROM
} = process.env

export  {
    NEXT_PUBLIC_BASE_URL,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_HOST,
    SMTP_FROM,
}