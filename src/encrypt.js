const FORMAT = "textcrypt";
const VERSION = 1;
const ALGORITHM = "AES-GCM";
const KDF = "PBKDF2-HMAC-SHA-256";
const ITERATIONS = 600_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const TAG_BITS = 128;
const MAX_PLAINTEXT_BYTES = 2 * 1024 * 1024;
const MAX_PACKET_CHARS = 3 * 1024 * 1024;

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });
const AAD = encoder.encode(`${FORMAT}|${VERSION}|${ALGORITHM}|${KDF}|${ITERATIONS}`);

function ensureWebCrypto() {
  if (!globalThis.isSecureContext || !globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API no está disponible. Ejecuta la página mediante HTTPS o en localhost.");
  }
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value, fieldName) {
  if (typeof value !== "string" || value.length === 0 || value.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) {
    throw new Error(`El campo ${fieldName} no contiene Base64 válido.`);
  }
  let binary;
  try {
    binary = atob(value);
  } catch {
    throw new Error(`El campo ${fieldName} no contiene Base64 válido.`);
  }
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function deriveEncryptionKey(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256"
    },
    passwordKey,
    { name: ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Cifra un texto plano con una contraseña y devuelve un paquete JSON.
 * @param {string} plaintext - texto a cifrar
 * @param {string} password - contraseña (mínimo 12 caracteres)
 * @returns {Promise<string>} paquete JSON con sal, IV y cifrado
 */
export async function encryptText(plaintext, password) {
  ensureWebCrypto();
  if (typeof plaintext !== "string") throw new Error("El texto de entrada debe ser una cadena.");
  if (Array.from(password).length < 12) throw new Error("Para cifrar, usa una contraseña de al menos 12 caracteres.");

  const plaintextBytes = encoder.encode(plaintext);
  if (plaintextBytes.byteLength > MAX_PLAINTEXT_BYTES) {
    throw new Error("El texto supera el límite de 2 MiB de esta versión.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveEncryptionKey(password, salt);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, additionalData: AAD, tagLength: TAG_BITS },
    key,
    plaintextBytes
  );

  const ciphertext = new Uint8Array(encryptedBuffer);
  const packet = {
    format: FORMAT,
    version: VERSION,
    algorithm: ALGORITHM,
    kdf: KDF,
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(ciphertext)
  };

  return JSON.stringify(packet, null, 2);
}

/**
 * Descifra un paquete JSON con una contraseña.
 * @param {string} packetText - paquete JSON cifrado
 * @param {string} password - contraseña usada para cifrar
 * @returns {Promise<string>} texto plano descifrado
 */
export async function decryptText(packetText, password) {
  ensureWebCrypto();
  if (!password) throw new Error("Introduce la contraseña utilizada para cifrar.");
  if (packetText.length > MAX_PACKET_CHARS) throw new Error("El paquete supera el límite de esta versión.");

  let packet;
  try {
    packet = JSON.parse(packetText);
  } catch {
    throw new Error("La entrada no es un paquete JSON válido.");
  }

  if (!packet || typeof packet !== "object" || Array.isArray(packet) ||
      packet.format !== FORMAT || packet.version !== VERSION ||
      packet.algorithm !== ALGORITHM || packet.kdf !== KDF ||
      packet.iterations !== ITERATIONS) {
    throw new Error("Formato o versión no compatibles con esta versión de TextCrypt.");
  }

  const salt = base64ToBytes(packet.salt, "salt");
  const iv = base64ToBytes(packet.iv, "iv");
  const ciphertext = base64ToBytes(packet.ciphertext, "ciphertext");
  if (salt.byteLength !== SALT_BYTES) throw new Error("La sal tiene una longitud inválida.");
  if (iv.byteLength !== IV_BYTES) throw new Error("El vector de inicialización tiene una longitud inválida.");
  if (ciphertext.byteLength < TAG_BITS / 8 || ciphertext.byteLength > MAX_PLAINTEXT_BYTES + TAG_BITS / 8) {
    throw new Error("El contenido cifrado tiene una longitud inválida.");
  }

  const key = await deriveEncryptionKey(password, salt);
  try {
    const plaintextBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv, additionalData: AAD, tagLength: TAG_BITS },
      key,
      ciphertext
    );
    return decoder.decode(plaintextBuffer);
  } catch {
    throw new Error("No se pudo descifrar. Comprueba la contraseña y que el paquete no haya sido alterado.");
  }
}
