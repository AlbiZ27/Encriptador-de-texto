import { encriptarTexto, desencriptadorTexto } from "./legacy-cypher.js";

const btnCypher = document.getElementById("cypher-btn");
const btnDecipher = document.getElementById("decipher-btn");

btnCypher.addEventListener('click', (e) => { 
    wrapperCypherText();
});

btnDecipher.addEventListener("click", (e) => {
  wrapperDecipherText();
});





function removerImg() {
  const img = document.getElementById("id_img_desencriptador");

  if (img) {
    img.remove();
  }
}

function mostrarTexto(text) {
  const resultado = document.getElementById("resultado");
  resultado.textContent = "";

  resultado.textContent = text;
}

export function verificarLetra() {
  let letra = document.getElementById("input_users").value;

  if (letra.toLowerCase() != letra) {
    removerImg();
    mostrarTexto("Tipo de letra no valido, Solo se aceptan minusculas");
    return false;
  }
  return true;
}

function wrapperCypherText() { 
    const text = document.getElementById("input_users").value;

    const cypherText = encriptarTexto(text);

    removerImg();
    mostrarTexto(cypherText);

}

function wrapperDecipherText() {
  const text = document.getElementById("input_users").value;

  const decipherText = desencriptadorTexto(text);
  
  removerImg();
  mostrarTexto(decipherText);  
}
