import React from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";

function DockerCompose() {
  return (
    <CodeEditor
      title="docker-compose.yml"
      padding="5px 25px"
      language="cmd"
      codeString={`version: '3.8'

services:
    keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
    - KEYCLOAK_USER=admin
    - KEYCLOAK_PASSWORD=admin
    ports:
    - "8080:8080"
    volumes:
    - ./keycloak-data:/opt/keycloak/data  # Montar un directorio local
    networks:
    - keycloak-network

networks:
keycloak-network:
driver: bridge`}
    />
  );
}

export default DockerCompose;
