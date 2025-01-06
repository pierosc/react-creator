export const queryClient = `// src/api/reactQueryClient.js
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reintentos automáticos si falla la query
      retry: 1,
      // No volver a hacer fetch al regresar al tab
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;`;
