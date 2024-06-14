export function validateString(word) {
  // Expresión regular que permite letras y números, pero no caracteres especiales
  const regex = /^[a-zA-Z0-9ñÑ\s.]{0,50}$/;

  // Verifica si la cadena cumple con la expresión regular
  return regex.test(word);
}

export function validateAddres(word) {}

export function validateStringWithNumbers(word) {
  // Expresión regular que permite letras y números, pero no caracteres especiales
  const regex = /^[a-zA-Z-ñÑ\s]{0,50}$/;

  // Verifica si la cadena cumple con la expresión regular
  return regex.test(word);
}

export function validatePassword(word) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  return regex.test(word);
}

// crear la funcion del regex para caracteres especiales para implementar en los formularios
