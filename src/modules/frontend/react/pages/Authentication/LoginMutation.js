export const loginMutation = `// src/hooks/useAuth.js
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export function useLoginMutation() {
  return useMutation({
    mutationFn: async ({ username, password }) => {
      // Llamamos a POST /login de tu backend
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Login exitoso:', data);
      // La cookie httpOnly ya se guardó en el navegador automáticamente.
      // Aquí podrías actualizar un contexto, redirigir al usuario, etc.
    },
    onError: (error) => {
      console.error('Error al hacer login:', error);
    },
  });
}`;
