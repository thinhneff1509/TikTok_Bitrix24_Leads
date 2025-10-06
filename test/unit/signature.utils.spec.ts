import * as crypto from 'crypto';
import {
    normalizePhone,
    verifySignature,
} from '../../src/main/common/utils/signatureUtils';

describe('signatureUtils', () => {
    describe('normalizePhone', () => {
        it('trả null với input falsy', () => {
            // @ts-ignore
            expect(normalizePhone(undefined)).toBeNull();
            // @ts-ignore
            expect(normalizePhone(null)).toBeNull();
            expect(normalizePhone('')).toBeNull();
        });

        it('chuẩn hóa các định dạng phổ biến (VN) → bỏ ký tự không phải số, 0 đầu thành 84', () => {
            expect(normalizePhone('0901-234-567')).toBe('84901234567'); // 0 -> 84
            expect(normalizePhone('+84 901 234 567')).toBe('84901234567'); // bỏ ký tự, giữ 84
            expect(normalizePhone('84901234567')).toBe('84901234567'); // đã chuẩn -> giữ nguyên
        });
    });

    describe('verifySignature', () => {
        const secret = 'unit-secret';
        const payload = { a: 1, b: 'x' };

        beforeAll(() => {
            // hàm verifySignature đọc trực tiếp từ env
            process.env.TIKTOK_WEBHOOK_SECRET = secret;
        });

        it('trả true khi chữ ký hợp lệ (HMAC-SHA256 hex)', () => {
            const expectedSig = crypto
                .createHmac('sha256', secret)
                .update(JSON.stringify(payload))
                .digest('hex');

            expect(verifySignature(expectedSig, payload)).toBe(true);
        });

        it('trả false khi sai chữ ký hoặc thiếu chữ ký', () => {
            expect(verifySignature('wrong', payload)).toBe(false);
            // @ts-ignore
            expect(verifySignature(undefined, payload)).toBe(false);
        });
    });
});
