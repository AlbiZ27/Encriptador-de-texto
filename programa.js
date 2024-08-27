
function removerImg(){

    const img = document.getElementById("id_img_desencriptador");

    if (img) {
        img.remove();
    }
}

function mostrarTexto(textEncriptado){

    const resultado = document.getElementById("resultado");
    resultado.textContent="";

    resultado.textContent = textEncriptado;

}


function verificarLetra(){
    let letra = document.getElementById("input_users").value;

    if(letra.toLowerCase()!= letra){
        removerImg()
        mostrarTexto("Tipo de letra no valido, Solo se aceptan minusculas");
        return false;
    }
    return true;
}



function encriptarTexto(){

    const encriptarTexto = new Map([

        ["e","enter"],
        ["i","imes"],
        ["a","ai"],
        ["o","ober"],
        ["u","ufat"],
      ]);

    let textEncriptado="";
    const text = document.getElementById("input_users").value;

    if (verificarLetra()){
        for (let char in text){
        
            if (encriptarTexto.has(text[char])) {
                textEncriptado += encriptarTexto.get(text[char]);   
            }
            else{
                textEncriptado += text[char];
            }
    }

    removerImg();

    mostrarTexto(textEncriptado);


    } 
}
function desencriptadorTexto(){
    const desencriptarTexto = new Map([
        ["enter","e"],
        ["imes","i"],
        ["ai","a"],
        ["ober","o"],
        ["ufat","u"]
      ]);

      let i=0;
      let textDesencriptado="";
      const text = document.getElementById("input_users").value;

      if (verificarLetra()){
        while (i < text.length) {
            let encontrado = false;
            //pedimos la llaves para almacenarlas en clave
            for (let clave of desencriptarTexto.keys()) {

                if (text.substr(i, clave.length) === clave) {
                    
                    textDesencriptado += desencriptarTexto.get(clave);
                    
                    i += clave.length;
                    encontrado = true;
                    break;
                }
            }

            if (!encontrado) {
                textDesencriptado += text[i];
                i++;
            }
        }

        removerImg();

        mostrarTexto(textDesencriptado);
    }
}
    
