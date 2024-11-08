export function auditable(metaData) {
  return `
package ${metaData.group}.audit;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Auditable {
    String action();
}  
`;
}
