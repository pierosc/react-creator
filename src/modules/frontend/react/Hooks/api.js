import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_API_URL || "http://localhost:3001",
  headers: {
    "Content-type": "application/json",
    Authorization: process.env.VITE_API_TOKEN,
  },
});

// Añadir un interceptor de respuesta
api.interceptors.response.use(
  (response) => response, // Simplemente retornar la respuesta si todo va bien
  (error) => handleError(error) // Manejar errores
);

export default api;

function handleError(error) {
  // Aquí puedes manejar el error como desees
  console.error("Se ha producido un error en la solicitud:", error);

  // Dependiendo del error, podrías querer hacer algo específico
  if (error.response && error.response.status === 401) {
    console.error("Error de autenticación.");
    // por ejemplo, redirigir al usuario a la página de inicio de sesión
  }

  // Debes retornar un rechazo para mantener la cadena de promesas en un estado de error
  return Promise.reject(error);
}
