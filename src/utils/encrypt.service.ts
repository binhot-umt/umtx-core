import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export async function encrypt(data: string) {
  const password = () => {
    return process.env.ENCRYPTION_PASSWORD;
  };
  const iv = Buffer.from(password().slice(0, 16));

  const key = (await promisify(scrypt)(password(), 'salt', 32)) as Buffer;
  // console.log('re-key', key);
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([cipher.update(data), cipher.final()]);
  return encryptedText.toString('base64');
}

export async function decrypt(data: any) {
  const password = () => {
    return process.env.ENCRYPTION_PASSWORD;
  };
  const iv = Buffer.from(password().slice(0, 16));

  const key = (await promisify(scrypt)(password(), 'salt', 32)) as Buffer;
  // console.log('de-key', key);
  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(data, 'hex')),
    decipher.final(),
  ]);
  return decryptedText.toString('utf-8');
}
