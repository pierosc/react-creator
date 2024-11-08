export function auditRepository(metaData) {
  return `
package ${metaData.group}.audit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditRepository extends JpaRepository<AuditLog, Long> {
}
`;
}
