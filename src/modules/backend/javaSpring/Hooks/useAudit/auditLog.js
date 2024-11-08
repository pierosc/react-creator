export function auditLog(metaData) {
  return `
package ${metaData.group}.audit;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String action;
    private String method;
    private String parameters;
    private String result;
    private LocalDateTime timestamp;

}
  `;
}
