import nacl from "tweetnacl";
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from "tweetnacl-util";

export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    privateKey: encodeBase64(keyPair.secretKey),
  };
}

export function encryptMessage(
  message: string,
  receiverPublicKey: string,
  senderSecretKey: string
) {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = decodeUTF8(message);
  const encryptedMessage = nacl.box(
    messageUint8,
    nonce,
    decodeBase64(receiverPublicKey),
    decodeBase64(senderSecretKey)
  );

  return encodeBase64(nonce) + ":" + encodeBase64(encryptedMessage);
}

export function decryptMessage(encryptedMessage: string, senderPublicKey: string, receiverSecretKey: string): string | null {
    const [nonce, message] = encryptedMessage.split(':').map(decodeBase64);
    const decryptedMessage = nacl.box.open(
      message,
      nonce,
      decodeBase64(senderPublicKey),
      decodeBase64(receiverSecretKey)
    );
  
    if (!decryptedMessage) {
      return null;
    }
  
    return encodeUTF8(decryptedMessage);
  }