import * as crypto from 'crypto';
const secret = process.env.TIKTOK_WEBHOOK_SECRET || '';

//using key base64
export function verifySignature(signature: string | undefined, payload: any) {
    if (!signature) return false;
    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expected = crypto
        .createHmac('sha256', process.env.TIKTOK_WEBHOOK_SECRET || '')
        .update(body)
        .digest('hex');
    return signature === expected;
}

//phone number
export function normalizePhone(input?: string | null) {
    if (!input) return null;
    // replace 0 to 84
    const digits = input.replace(/\D/g, '');
    return digits.replace(/^0/, '84');
}