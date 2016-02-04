import config from '../config/config.json';
import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

// TODO change passwd in production
const passwd = config.cryptopass;

export default class CryptoManager {
  encrypt(text) {
    let cipher = crypto.createCipher(algorithm, passwd);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }
  decrypt(encrypted) {
    let decipher = crypto.createDecipher(algorithm, passwd);
    let dec = decipher.update(encrypted, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
