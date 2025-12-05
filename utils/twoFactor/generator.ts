import * as OTPAuth from 'otplib';
import QRCode from 'qrcode';

export interface QRCodeData {
  secret: string;
  qrCodeUrl: string;
}

export const generateTwoFactorSecret = async (userEmail: string, userId: string): Promise<QRCodeData> => {
  const secret = OTPAuth.authenticator.generateSecret();
  
  const otpauthUrl = OTPAuth.authenticator.keyuri(
    userEmail || userId,
    'Veep Admin',
    secret
  );
  
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);
  
  return { secret, qrCodeUrl };
};

export const verifyTwoFactorToken = (token: string, secret: string): boolean => {
  if (!secret) return false;
  
  try {
    return OTPAuth.authenticator.verify({
      token: token.replace(/\s/g, ''),
      secret
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    codes.push(code);
  }
  return codes;
};
