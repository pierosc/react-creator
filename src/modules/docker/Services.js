import React, { useState } from "react";
import CSelect from "../../components/CSelect/CSelect";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { IconButton, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
function Services() {
  //  KEYCLOAK
  const [keycloakUser, setKeycloakUser] = useState("admin");
  const [keycloakPassword, setKeycloakPassword] = useState("admin");
  const [keycloakPort, setKeycloakPort] = useState("8080");
  const [hasKeycloak, setHasKeycloak] = useState(true);

  // POSTGRESQL
  const [hasPostgreSQL, setHasPostgreSQL] = useState(true);
  const [postgresUser, setPostgresUser] = useState("admin");
  const [postgresPassword, setPostgresPassword] = useState("admin");
  const [postgresDB, setPostgresDB] = useState("mydatabase");
  const [postgresPort, setPostgresPort] = useState("5432");

  // ADMINER
  const [hasAdminer, setHasAdminer] = useState(true);
  const [adminerPort, setAdminerPort] = useState("8081");

  // ADMINER
  const [hasReact, setHasReact] = useState(true);
  const [reactURL, setReactURL] = useState("./ruta_dockerfile");

  return (
    <div className="col-span-2 ">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-2 justify-start items-start">
          {/* DATABASE */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">POSTGRESQL</label>
              <IconButton
                onClick={() => {
                  setHasPostgreSQL(!hasPostgreSQL);
                }}
              >
                {hasPostgreSQL ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
            {hasPostgreSQL && (
              <>
                <TextField
                  label="POSTGRES_USER"
                  size="small"
                  value={postgresUser}
                  onChange={(e) => {
                    setPostgresUser(e.target.value);
                  }}
                />
                <TextField
                  label="POSTGRES_PASSWORD"
                  size="small"
                  value={postgresPassword}
                  onChange={(e) => {
                    setPostgresPassword(e.target.value);
                  }}
                />
                <TextField
                  label="POSTGRES_DB"
                  size="small"
                  value={postgresDB}
                  onChange={(e) => {
                    setPostgresDB(e.target.value);
                  }}
                />
                <TextField
                  label="POSTGRES_PORT"
                  size="small"
                  value={postgresPort}
                  onChange={(e) => {
                    setPostgresPort(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {/* ADMINER */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">ADMINER</label>
              <IconButton
                onClick={() => {
                  setHasAdminer(!hasAdminer);
                }}
              >
                {hasAdminer ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
            {hasAdminer && (
              <>
                <TextField
                  label="PORT"
                  size="small"
                  value={adminerPort}
                  onChange={(e) => {
                    setAdminerPort(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {/* KEYCLOAK */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">KEYCLOAK</label>
              <IconButton
                onClick={() => {
                  setHasKeycloak(!hasKeycloak);
                }}
              >
                {hasKeycloak ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
            {hasKeycloak && (
              <>
                <TextField
                  label="KEYCLOAK USER"
                  size="small"
                  value={keycloakUser}
                  onChange={(e) => {
                    setKeycloakUser(e.target.value);
                  }}
                />
                <TextField
                  label="KEYCLOAK PASSWORD"
                  size="small"
                  value={keycloakPassword}
                  onChange={(e) => {
                    setKeycloakPassword(e.target.value);
                  }}
                />
                <TextField
                  label="KEYCLOAK PORT"
                  size="small"
                  value={keycloakPort}
                  onChange={(e) => {
                    setKeycloakPort(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {/* FRONTEND */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">REACT</label>
              <IconButton
                onClick={() => {
                  setHasReact(!hasReact);
                }}
              >
                {hasReact ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
            {hasReact && (
              <>
                <TextField
                  label="BUILD URL"
                  size="small"
                  value={reactURL}
                  onChange={(e) => {
                    setReactURL(e.target.value);
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className="col-span-2 overflow-auto" style={{ height: "90vh" }}>
          <CodeEditor
            title="docker-compose.yml"
            padding="0px 25px "
            language="yml"
            fontSize="12px"
            codeString={`version: '3.8'
            
services:
    ${
      hasPostgreSQL
        ? `# PostgreSQL: Base de datos
    db:
        image: postgres:latest
        environment:
        - POSTGRES_USER=${postgresUser}
        - POSTGRES_PASSWORD=${postgresPassword}
        - POSTGRES_DB=${postgresDB}
        volumes:
        - postgres-data:/var/lib/postgresql/data
        ports:
        - "${postgresPort}:5432"
        networks:
        - db_network
        restart: always
`
        : ``
    }${
      hasAdminer
        ? `# Servicio de Adminer para gestionar la base de datos
    adminer:
        image: adminer:latest
        container_name: adminer
        ports:
        - "${adminerPort}:8080"
        networks:
        - db_network
        restart: always
`
        : ``
    }${
      hasReact
        ? `
    # Frontend: React
    frontend:
        build: ./Yachayhuasi_Frontend  # Ruta al Dockerfile de tu aplicación React
        container_name: react_frontend
        ports:
        - "80:80"  # Nginx sirve la app en el puerto 80
        networks:
        - db_network
    restart: always`
        : ``
    }

    # Backend: Spring Boot
    backend:
        build:
        context: ./backend
        dockerfile: Dockerfile
        environment:
        - SPRING_PROFILES_ACTIVE=dev
        - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/mydb
        - SPRING_DATASOURCE_USERNAME=admin
        - SPRING_DATASOURCE_PASSWORD=admin
        ports:
        - "8080:8080"
        networks:
        - app-network
        depends_on:
        - db
        - keycloak

    # JMeter: Para pruebas de carga
    jmeter:
        image: justb4/jmeter
        ports:
        - "60000:60000"
        networks:
        - app-network

    ${
      hasKeycloak
        ? `# Keycloak Service
    keycloak:
        image: quay.io/keycloak/keycloak:latest
        command: start-dev
        container_name: keycloak
        environment:
        - KC_BOOTSTRAP_ADMIN_USERNAME=admin
        - KC_BOOTSTRAP_ADMIN_PASSWORD=admin
        - DB_VENDOR=POSTGRES
        - DB_ADDR=db
        - DB_DATABASE=mydatabase
        - DB_USER=admin
        - DB_PASSWORD=secret  
        ports:
        - "8080:8080"  # Puerto donde estará disponible el UI de Keycloak
        depends_on:
        - db
        networks:
        - db_network
        restart: always`
        : ``
    }

    

networks:
    app-network:
        driver: bridge

volumes:
    postgres-data:
        driver: local
    postgres-backups:
        driver: local
    keycloak-data:
        driver: local
            `}
          />
        </div>
      </div>
    </div>
  );
}

export default Services;

// # Backup: Contenedor para crear backups periódicos
// db-backup:
//     image: postgres:latest
//     environment:
//     - POSTGRES_USER=admin
//     - POSTGRES_PASSWORD=admin
//     - POSTGRES_DB=mydb
//     volumes:
//     - postgres-backups:/backups
//     - postgres-data:/var/lib/postgresql/data
//     entrypoint: /bin/bash -c "while true; do pg_dump -U admin mydb > /backups/backup_$(date +'%Y%m%d%H%M%S').sql; find /backups -type f -mtime +5 -exec rm -f {} \;; sleep 3600; done"
//     networks:
//     - app-network
//     depends_on:
//     - db
