# 🔐 TextCrypt — Encriptador de Texto

Cifrado y descifrado de texto en el navegador con **AES-256-GCM** y derivación de claves mediante **PBKDF2-HMAC-SHA-256**. Todo se procesa localmente: nada sale de tu máquina.

---

## ✨ Características

| Característica | Detalle |
|---|---|
| 🔒 **Cifrado fuerte** | AES-256-GCM con autenticación (tag de 128 bits) |
| 🔑 **Derivación de clave** | PBKDF2-HMAC-SHA-256 con 600 000 iteraciones |
| 🧾 **Paquete JSON autocontenido** | Incluye sal, vector de inicialización (IV) y cifrado; nunca expone la contraseña |
| ✅ **Validación de integridad** | Detecta si el paquete fue alterado o la contraseña es incorrecta |
| 📏 **Límites de seguridad** | Máx. 2 MiB de texto plano; contraseña mínima de 12 caracteres para cifrar |
| 🖥️ **Solo navegador** | Procesamiento 100 % local; requiere HTTPS o `localhost` |

---

## 🚀 Cómo usar

1. Abre `index.html` en un servidor local (por ejemplo `http://localhost`) o en HTTPS.
2. Escribe el texto que quieres cifrar en el área de entrada.
3. Ingresa una contraseña larga y única (mínimo 12 caracteres para cifrar).
4. Pulsa **Cifrar**. Obtendrás un paquete JSON: guárdalo y recuerda la contraseña.
5. Para descifrar, pega el paquete JSON en la entrada, escribe la misma contraseña y pulsa **Descifrar**.

> ⚠️ No compartas la contraseña junto con el paquete. Sin ella, el texto es irrecuperable.

---

## 🛠️ Estructura del proyecto

```
encriptador-txt/
├── index.html               # Página principal (UI)
├── README.md                # Esta documentación
├── .gitignore
├── styles/
│   └── main.css             # Estilos (modo claro/oscuro, sistema-ui)
├── src/
│   ├── app.js               # Lógica de la UI y eventos
│   ├── encrypt.js           # Núcleo criptográfico (AES-GCM + PBKDF2)
│   └── legacy-cypher.js     # Implementación anterior (legacy)
├── test/
│   └── legacy-cypher.test.js
├── resources/               # Imágenes y assets
└── textcrypt-fase2.html     # Referencia del script de la Fase 2
```

---

## 🧠 Cómo funciona (Fase 2)

El núcleo criptográfico vive en `src/encrypt.js`:

1. **Derivación de clave:** la contraseña se importa como clave raw PBKDF2 y se deriva una clave AES-256 usando una sal aleatoria de 16 bytes y 600 000 iteraciones con SHA-256.
2. **Cifrado:** el texto plano se cifra con AES-256-GCM, un IV aleatorio de 12 bytes y datos adicionales autenticados (AAD) que identifican formato, versión, algoritmo y KDF.
3. **Empaquetado:** el resultado es un JSON que incluye `format`, `version`, `algorithm`, `kdf`, `iterations`, `salt`, `iv` y `ciphertext` (todos en Base64).
4. **Descifrado:** se valida la estructura del paquete, se vuelve a derivar la clave con la misma sal y se descifra y autentica con AES-GCM.

---

## 📋 Requisitos

- Navegador moderno con **Web Crypto API** (`crypto.subtle`).
- La página debe servirse por **HTTPS** o desde **localhost** (contexto seguro).
- No se necesita servidor de backend ni instalación de dependencias.

---

## 📄 Licencia

Proyecto educativo. Úsalo bajo tu propia responsabilidad; no almacenes secretos críticos en dispositivos que no controlas.

---

