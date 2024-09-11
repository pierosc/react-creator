export const aplicationProperties = `
spring.application.name=springdocker
server.port=8080
spring.datasource.driver-class-name=org.postgresql.Driver

# spring.datasource.url=jdbc:mysql://localhost:3306/db_example?serverTimezone=UTC
#BASE DE DATOS POSTGRES
# spring.datasource.url=jdbc:postgresql://my_database:5432/companyurp
# spring.datasource.url=jdbc:postgresql://172.17.32.97:5432/yachayhuasi_db
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.datasource.url=jdbc:postgresql://localhost:5433/yachayhuasi_db
# spring.datasource.url=jdbc:postgresql://localhost:5432/yachayhuasi_db
spring.jpa.properties.hibernate.jdbc.time_zone=UTC

# spring.datasource.username=dibu
spring.datasource.username=yachayhuasi
# spring.datasource.password=dibu1204
spring.datasource.password=yachayhuasi2023

spring.jpa.hibernate.ddl-auto=update
# logging.level.org.hibernate=DEBUG
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.open-in-view=false

#Habilitar apidocs - swagger-ui
springdoc.api-docs.enabled = true
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.path=/doc/swagger-ui.html

# Keycloak Config
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://172.17.32.97:8080/realms/URP
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://172.17.32.97:8080/realms/URP/protocol/openid-connect/certs

jwt.auth.converter.resource-id=spring-client-api-rest
jwt.auth.converter.principle-attribute=preferred_username

logging.level.org.keycloak = DEBUG
`;
