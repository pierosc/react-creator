function useException(springProject) {
  // const { springProject } = useContext(SpringContext);
  const metaData = springProject?.selected?.metaData ?? {};

  const file = `package ${metaData.group}.exceptions;

import ${metaData.group}.dtos.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import jakarta.validation.ConstraintViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFound(EntityNotFoundException ex) {
        ApiResponse<Void> response = new ApiResponse<>(false, ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityAlreadyExists(EntityAlreadyExistsException ex) {
        ApiResponse<Void> response = new ApiResponse<>(false, ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach((FieldError error) -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        ApiResponse<Map<String, String>> response = new ApiResponse<>(false, "Error de validación", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex, WebRequest request) {
        ex.printStackTrace(); // Opcional: Loggear la excepción
        ApiResponse<Void> response = new ApiResponse<>(false, "Error interno del servidor", null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}`;

  const getEntityNotFoundException = () => {
    return `package ${metaData.group}.exceptions;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String message) {
        super(message);
    }
}`;
  };

  const getEntityAlreadyExistsException = () => {
    return `package ${metaData.group}.exceptions;

public class EntityAlreadyExistsException extends RuntimeException {

    public EntityAlreadyExistsException(String message) {
        super(message);
    }
}`;
  };

  const getFolderContent = () => {
    return [
      {
        type: "file",
        name: `GlobalExceptionHandler.java`,
        content: file,
      },
      {
        type: "file",
        name: `EntityNotFoundException.java`,
        content: getEntityNotFoundException(),
      },
      {
        type: "file",
        name: `EntityAlreadyExistsException.java`,
        content: getEntityAlreadyExistsException(),
      },
    ];
  };

  return { getFolderContent };
}

export default useException;
