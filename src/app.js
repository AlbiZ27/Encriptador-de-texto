import { encryptText, decryptText } from "./encrypt.js";

const inputText = document.getElementById("inputText");
const passwordInput = document.getElementById("password");
const outputText = document.getElementById("outputText");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const moveBtn = document.getElementById("moveBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");

function setStatus(message, state = "") {
  statusEl.textContent = message;
  statusEl.dataset.state = state;
}

function setBusy(isBusy) {
  encryptBtn.disabled = isBusy;
  decryptBtn.disabled = isBusy;
  moveBtn.disabled = isBusy;
  clearBtn.disabled = isBusy;
  encryptBtn.textContent = isBusy ? "Procesando…" : "Cifrar";
  decryptBtn.textContent = isBusy ? "Procesando…" : "Descifrar";
}

encryptBtn.addEventListener("click", async () => {
  setBusy(true);
  setStatus("Cifrando… PBKDF2 puede tardar unos segundos.");
  try {
    outputText.value = await encryptText(inputText.value, passwordInput.value);
    setStatus("Cifrado completado. Guarda el paquete JSON y recuerda la contraseña.", "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Ocurrió un error inesperado.", "error");
  } finally {
    setBusy(false);
  }
});

decryptBtn.addEventListener("click", async () => {
  setBusy(true);
  setStatus("Descifrando…");
  try {
    outputText.value = await decryptText(inputText.value, passwordInput.value);
    setStatus("Descifrado completado.", "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Ocurrió un error inesperado.", "error");
  } finally {
    setBusy(false);
  }
});

moveBtn.addEventListener("click", () => {
  inputText.value = outputText.value;
  setStatus("El resultado se ha pasado al campo de entrada.");
  inputText.focus();
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  passwordInput.value = "";
  setStatus("Campos limpiados.");
  inputText.focus();
});
