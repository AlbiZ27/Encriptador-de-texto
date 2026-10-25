
import { verificarLetra} from "./app.js"

export function encriptarTexto(text){

    const encriptarTexto = new Map([
        ["e","enter"],
        ["i","imes"],
        ["a","ai"],
        ["o","ober"],
        ["u","ufat"],
      ]);

    let textEncriptado="";
    if (verificarLetra()){
        for (let char in text){
        
            if (encriptarTexto.has(text[char])) {
                textEncriptado += encriptarTexto.get(text[char]);   
            }
            else{
                textEncriptado += text[char];
            }
        }
    }
    return textEncriptado;
}
export function desencriptadorTexto(text){
    const desencriptarTexto = new Map([
        ["enter","e"],
        ["imes","i"],
        ["ai","a"],
        ["ober","o"],
        ["ufat","u"]
      ]);

      let i=0;
      let textDesencriptado="";
      

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
        return textDesencriptado;
    }
}
    
