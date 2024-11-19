export const getJwtAuthenticationConverter = (metaData) => {
  return `package ${metaData.group}.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component

public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    @Value("\${jwt.auth.converter.principle-attribute}")
    private String principleAttribute;

    @Value("\${jwt.auth.converter.resource-id}")
    private String resourceId;

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {

        Collection<GrantedAuthority> authorities = Stream
                .concat(jwtGrantedAuthoritiesConverter.convert(jwt).stream(), extractResourceRoles(jwt).stream())
                .toList();

        return new JwtAuthenticationToken(
                jwt,
                authorities,
                getPrincipleClaimName(jwt));
    }

    private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {

        // Map<String, Object> resourceAccess;
        Map<String, Object> resource;
        Collection<String> resourceRoles;

        if (jwt.getClaim("resource_access") == null) {
            return Set.of();
        }
        // resourceAccess = jwt.getClaim("resource_access");
        Object resourceAccessObj = jwt.getClaim("resource_access");

        if (!(resourceAccessObj instanceof Map)) {

            // logger.warn("resource_access claim is missing or not a map");
            return Set.of();
        }

        // if (resourceAccess.get(resourceId) == null) {
        // return Set.of();
        // }
        Map<String, Object> resourceAccess = (Map<String, Object>) resourceAccessObj;
        System.out.println("--------------------------------------------");
        System.out.println("resource");
        resource = (Map<String, Object>) resourceAccess.get(resourceId);
        System.out.println(resource);
        resourceRoles = (Collection<String>) resource.get("roles");
        System.out.println(resourceRoles);
        System.out.println("--------------------------------------------");
        return resourceRoles
                .stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toSet());
    }

    private String getPrincipleClaimName(Jwt jwt) {
        String claimName = JwtClaimNames.SUB;
        if (principleAttribute != null) {
            claimName = principleAttribute;
        }
        return jwt.getClaim(claimName);
    }
}
`;
};
