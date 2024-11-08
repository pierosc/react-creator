export function auditAspect(metaData) {
  return `
package ${metaData.group}.audit;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditRepository auditRepository;

    @Around("@annotation(auditable)")
    public Object auditMethod(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Object result = null;
        String username = getCurrentUsername();
        String action = auditable.action();
        String methodName = joinPoint.getSignature().toShortString();
        String parameters = Arrays.toString(joinPoint.getArgs());
        LocalDateTime timestamp = LocalDateTime.now();

        try {
            result = joinPoint.proceed();
            saveAuditLog(username, action, methodName, parameters, "SUCCESS", timestamp);
        } catch (Exception e) {
            saveAuditLog(username, action, methodName, parameters, "FAILURE: " + e.getMessage(), timestamp);
            throw e;
        }
        return result;
    }

    private void saveAuditLog(String username, String action, String method, String parameters, String result, LocalDateTime timestamp) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setMethod(method);
        auditLog.setParameters(parameters);
        auditLog.setResult(result);
        auditLog.setTimestamp(timestamp);
        auditRepository.save(auditLog);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null) ? authentication.getName() : "Anonymous";
    }
}

  `;
}
