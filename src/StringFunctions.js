export function CC(text) {
  // console.log(text);
  // console.log(text?.replace(/[_-](.)/g, (_, char) => char.toUpperCase()));
  return text
    ?.replace(/[_-](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}

export function UCC(text) {
  //Upper Camel Case
  return text
    ?.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    ?.replace(/^(.)/, (_, char) => char.toUpperCase());
}

export function TC(text) {
  // Inserta un espacio antes de letras mayúsculas si no están al principio y reemplaza guiones y guiones bajos con un espacio
  return text
    ?.replace(/([A-Z])/g, " $1") // Inserta espacio antes de mayúsculas
    ?.replace(/[_-]+/g, " ") // Convierte guiones y guiones bajos en espacios
    ?.trim() // Elimina espacios al principio y al final
    ?.toLowerCase() // Convierte todo a minúsculas para empezar de una base uniforme
    ?.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()); // Capitaliza la primera letra de cada palabra
}

export function Spaced(text) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export const lastWord = (string) => {
  const stringSplitted = string.trim().split(" ");
  return stringSplitted[stringSplitted.length - 1].trim();
};

export const splitOnNext = (string, character = "{") => {
  var indice = string.indexOf(character);
  if (indice !== -1) {
    var primeraParte = string.substring(0, indice);
    var segundaParte = string.substring(indice + 1);
    return [primeraParte, segundaParte];
  } else {
    return [string];
  }
};

export const splitOnLast = (string, character = "{") => {
  var indice = string.lastIndexOf(character);
  if (indice !== -1) {
    var primeraParte = string.substring(0, indice);
    var segundaParte = string.substring(indice + 1);
    return [primeraParte, segundaParte];
  } else {
    return [string];
  }
};

export const scopeBetween = (string, firstChar = "{", lastChar = "}") => {
  if (!string.includes(firstChar) || !string.includes(lastChar)) {
    return null;
  }
  const [, afterFirst] = splitOnNext(string, firstChar);
  const [contenidoScope] = splitOnLast(afterFirst, lastChar);
  return contenidoScope;
};

export function removeString(texto, palabra) {
  // Crear una expresión regular para buscar la palabra con límites de palabra (\b)
  var regex = new RegExp("\\b" + palabra + "\\b", "gi");

  // Reemplazar la palabra encontrada con una cadena vacía
  var nuevoTexto = texto.replace(regex, "");

  return nuevoTexto;
}

export function sqlVarToJavaVar(sqlVar) {
  // console.log(sqlVar);
  if (
    sqlVar.toUpperCase().includes("VAR") ||
    sqlVar.toUpperCase().includes("DATE") ||
    // sqlVar.toUpperCase().includes("TIMESTAMP") ||
    sqlVar.toUpperCase().includes("JSON")
  ) {
    return "String";
  } else if (sqlVar.toUpperCase().includes("UUID")) {
    return "UUID";
  } else if (
    sqlVar.toUpperCase().includes("INT") ||
    sqlVar.toUpperCase().includes("SERIAL")
  ) {
    return "Integer";
  } else if (sqlVar.toUpperCase().includes("FLOAT")) {
    return "float";
  } else if (sqlVar.toUpperCase().includes("TIMESTAMP")) {
    return "Timestamp";
  } else {
    return sqlVar;
  }
}

//ARRAYS METHODS..........................................

export function UniqueArray(array) {
  return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
}

export function JoinNewLine(array, separator) {
  if (separator) {
    return array.join(`${separator}
`);
  } else {
    return array.join(`
`);
  }
}
