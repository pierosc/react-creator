function useException(springProject) {
  // const { springProject } = useContext(SpringContext);
  const metaData = springProject?.selected?.metaData ?? {};

  const file = `package ${metaData.packageName}.exception;

    import org.springframework.http.HttpStatus;
    import org.springframework.http.HttpStatusCode;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.ControllerAdvice;
    import org.springframework.web.bind.annotation.ExceptionHandler;
    import org.springframework.web.bind.annotation.RestControllerAdvice;
    import org.springframework.web.context.request.WebRequest;
    import org.springframework.web.server.ResponseStatusException;
    import java.util.Map;
    
    @ControllerAdvice
    @RestControllerAdvice
    public class GlobalExceptionHandler {
    
        @ExceptionHandler(ResponseStatusException.class)
        public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
            HttpStatusCode status = ex.getStatusCode();
            String error = ex.getReason();
            ErrorResponse errorResponse = new ErrorResponse(status, error);
            return new ResponseEntity<>(errorResponse, status);
        }
    
        public static class ErrorResponse {
            private final int status;
            private final String error;
    
            public ErrorResponse(HttpStatusCode status2, String error) {
                this.status = status2.value();
                this.error = error;
            }
    
            public int getStatus() {
                return status;
            }
    
            public String getError() {
                return error;
            }
        }
        
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : ex.getBindingResult().getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
    }`;

  const getFolderContent = () => {
    return [
      {
        type: "file",
        name: `GlobalExceptionHandler.java`,
        content: file,
      },
    ];
  };

  return { getFolderContent };
}

export default useException;
