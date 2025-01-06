export const loginExample = `// src/components/LoginForm.js
import React, { useState } from 'react';
import { useLoginMutation } from '../hooks/useAuth';

export default function LoginForm() {
  const { mutate: login, isLoading } = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Usuario</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button disabled={isLoading}>Iniciar Sesión</button>
    </form>
  );
}
`;
