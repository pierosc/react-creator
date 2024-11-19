export const getKeyCloackPermissionResponse = (metaData) => {
  return `package ${metaData.group}.config;

import lombok.Data;

@Data
public class KeyCloackPermissionResponse {
    private Boolean result;
}
`;
};
