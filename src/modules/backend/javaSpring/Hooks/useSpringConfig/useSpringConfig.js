import { getCustomPermissionEvaluator } from "./templates/CustomPermissionEvaluator";
import { getJwtAuthenticationConverter } from "./templates/jwtAuthenticationConverter";
import { getKeyCloackPermissionResponse } from "./templates/KeyCloackPermissionResponse";
import { getMethodSecurityConfig } from "./templates/MethodSecurityConfig";
import { getSecurityConfig } from "./templates/securityConfig";
import { getSwaggerConfig } from "./templates/swaggerConfig";
import { getWebClientConfig } from "./templates/WebClientConfig";

function useSpringConfig(springProject) {
  const metaData = springProject?.selected?.metaData ?? {};

  const CustomPermissionEvaluator = getCustomPermissionEvaluator(metaData);
  const jwtAuthenticationConverter = getJwtAuthenticationConverter(metaData);
  const KeyCloackPermissionResponse = getKeyCloackPermissionResponse(metaData);
  const MethodSecurityConfig = getMethodSecurityConfig(metaData);
  const securityConfig = getSecurityConfig(metaData);
  const SwaggerConfig = getSwaggerConfig(metaData);
  const WebClientConfig = getWebClientConfig(metaData);

  const files = () => {
    return [
      {
        type: "file",
        name: `CustomPermissionEvaluator.java`,
        content: CustomPermissionEvaluator,
      },
      {
        type: "file",
        name: `JwtAuthenticationConverter.java`,
        content: jwtAuthenticationConverter,
      },
      {
        type: "file",
        name: `KeyCloackPermissionResponse.java`,
        content: KeyCloackPermissionResponse,
      },
      {
        type: "file",
        name: `MethodSecurityConfig.java`,
        content: MethodSecurityConfig,
      },
      {
        type: "file",
        name: `SecurityConfig.java`,
        content: securityConfig,
      },
      {
        type: "file",
        name: `WebClientConfig.java`,
        content: WebClientConfig,
      },
      {
        type: "file",
        name: `SwaggerConfig.java`,
        content: SwaggerConfig,
      },
    ];
  };
  return { files };
}

export default useSpringConfig;
