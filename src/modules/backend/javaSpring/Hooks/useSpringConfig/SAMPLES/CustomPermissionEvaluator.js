export const CustomPermissionEvaluator = `
package com.users.config;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import org.springframework.security.oauth2.jwt.Jwt;
import java.io.Serializable;

@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {

    private final WebClient webClient;

    public CustomPermissionEvaluator(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        if (auth == null) {
            return false;
        }
        String permissionString = targetDomainObject + "#" + permission;

        return checkPermissionInKeycloak(auth, permissionString);
    }

    @Override
    public boolean hasPermission(Authentication auth, Serializable targetId, String targetType, Object permission) {
        return hasPermission(auth, targetType, permission);
    }

    private boolean checkPermissionInKeycloak(Authentication auth, String permissionString) {
        String token;

        if (auth instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthToken = (JwtAuthenticationToken) auth;
            Jwt jwt = jwtAuthToken.getToken();
            token = jwt.getTokenValue();
        } else {
            System.out.println("Unable to extract token from Authentication object.");
            return false;
        }

        // System.out.println("token");
        // System.out.println(token);

        String url = "/realms/URP/protocol/openid-connect/token";

        Mono<Boolean> permissionCheck = webClient.post()
                .uri(uriBuilder -> uriBuilder.path(url).build())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "urn:ietf:params:oauth:grant-type:uma-ticket")
                        .with("audience", "backend")
                        .with("permission", permissionString)
                        .with("response_mode", "decision"))
                .retrieve()
                .bodyToMono(KeyCloackPermissionResponse.class)
                .map(response -> {
                    if (response.getResult() != null) {
                        return response.getResult();
                    } else {
                        System.out.println("Unexpected response structure: " + response);
                        return false;
                    }
                })
                .onErrorResume(e -> {
                    System.out.println("Error during permission check: " + e.getMessage());
                    return Mono.just(false);
                });

        return permissionCheck.block();
    }
}

`;
