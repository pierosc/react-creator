export function apiResponseFile(metaData) {
  return `
package ${metaData.group}.dtos.responses;

import lombok.*;

// ApiResponse es una clase genérica que encapsula la estructura estándar 
// de las respuestas que tu API enviará al cliente. Esto proporciona consistencia
// y facilita el manejo de respuestas en el lado del cliente.

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

}
`;
}
