import forge from "node-forge";
export const generateAESKey = (): string => {
  return forge.random.getBytesSync(32);
};

export const encryptWithAES = (message: string, aesKey: string): string => {
  const iv = forge.random.getBytesSync(12);
  const cipher = forge.cipher.createCipher("AES-GCM", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(message, "utf8"));
  cipher.finish();
  const encrypted = cipher.output.getBytes();
  const tag = cipher.mode.tag.getBytes();
  return forge.util.encode64(iv + encrypted + tag);
};

export const encryptAESKeyWithRSA = (
  aesKey: string,
  publicKeyPem: string
): string => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedAESKey = publicKey.encrypt(aesKey, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: forge.mgf.mgf1.create(forge.md.sha1.create()),
  });
  return forge.util.encode64(encryptedAESKey);
};

export const decryptAESKeyWithRSA = (
  encryptedAESKey: string,
  privateKeyPem: string
): string => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decodedAESKey = forge.util.decode64(encryptedAESKey);
  return privateKey.decrypt(decodedAESKey, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: forge.mgf.mgf1.create(forge.md.sha1.create()),
  });
};

export const decryptWithAES = (
  encryptedMessage: string,
  aesKey: string
): string => {
  try {
    const decodedMessage = forge.util.decode64(encryptedMessage);
    const iv = decodedMessage.slice(0, 12);
    const encrypted = decodedMessage.slice(12, decodedMessage.length - 16);
    const tag = decodedMessage.slice(decodedMessage.length - 16);

    const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
    decipher.start({ iv: iv, tag: forge.util.createBuffer(tag) });
    decipher.update(forge.util.createBuffer(encrypted));
    const result = decipher.finish();

    if (result) {
      return decipher.output.toString();
    } else {
      throw new Error("Decryption failed");
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};

export const encryptMessage = (message: string, publicKey: string) => {
    // Создаем объект PublicKey из PEM-формата
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    
    // Шифруем сообщение с использованием публичного ключа
    const encrypted = publicKeyObj.encrypt(message, 'RSA-OAEP', {
        md: forge.md.sha256.create()
    });
    
    // Возвращаем зашифрованное сообщение в формате Base64
    return forge.util.encode64(encrypted);
}

export const decryptMessage = (encryptedMessage: string, privateKey: string) => {
    // Создаем объект PrivateKey из PEM-формата
    const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
    
    // Декодируем зашифрованное сообщение из Base64
    const encrypted = forge.util.decode64(encryptedMessage);
    
    // Расшифровываем сообщение с использованием частного ключа
    const decrypted = privateKeyObj.decrypt(encrypted, 'RSA-OAEP', {
        md: forge.md.sha256.create()
    });
    
    // Возвращаем расшифрованное сообщение
    return decrypted;
}
