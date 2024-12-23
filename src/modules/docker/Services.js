import React, { useState } from "react";
import CSelect from "../../components/CSelect/CSelect";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { IconButton, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import useFile from "../../hooks/useFile/useFile";
function Services() {
  const { downloadFile } = useFile();
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

  // REACT
  const [hasReact, setHasReact] = useState(true);
  const [reactURL, setReactURL] = useState("./ruta_dockerfile");
  const [reactPORT, setReactPORT] = useState("80");

  // sprintboot
  const [hasSpring, setHasSpring] = useState(true);
  const [springURL, setSpringURL] = useState("./ruta_dockerfile");
  const [sprintPORT, setSpringPORT] = useState("8080");

  // JMETER
  const [hasJMeter, setHasJMeter] = useState(false);

  // PORTAINER
  const [hasPortainer, setHasPortainer] = useState(true);

  // JENKINS
  const [hasJenkins, setHasJenkins] = useState(true);

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
                <div className="flex">
                  <TextField
                    label="DOCKERFILE URL"
                    size="small"
                    value={reactURL}
                    onChange={(e) => {
                      setReactURL(e.target.value);
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      downloadFile(reactDockerfile, "dockerfile", "");
                    }}
                  >
                    <FileDownloadIcon sx={{ color: "white" }} />
                  </IconButton>
                </div>
                <TextField
                  label="PORT"
                  size="small"
                  value={reactPORT}
                  onChange={(e) => {
                    setReactPORT(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {/* BACKEND */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">SPRING BOOT</label>
              <IconButton
                onClick={() => {
                  setHasSpring(!hasSpring);
                }}
              >
                {hasSpring ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
            {hasSpring && (
              <>
                <div className="flex">
                  <TextField
                    label="DOCKERFILE URL"
                    size="small"
                    value={springURL}
                    onChange={(e) => {
                      setSpringURL(e.target.value);
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      downloadFile(javaDockerfile, "dockerfile", "");
                    }}
                  >
                    <FileDownloadIcon sx={{ color: "white" }} />
                  </IconButton>
                </div>
                <TextField
                  label="PORT"
                  size="small"
                  value={sprintPORT}
                  onChange={(e) => {
                    setSpringPORT(e.target.value);
                  }}
                />
              </>
            )}
          </div>
          {/* JMETER */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">JMETER</label>
              <IconButton
                onClick={() => {
                  setHasJMeter(!hasJMeter);
                }}
              >
                {hasJMeter ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
            {hasJMeter && (
              <>
                {/* <TextField
                  label="BUILD URL"
                  size="small"
                  value={springURL}
                  onChange={(e) => {
                    setSpringURL(e.target.value);
                  }}
                />
                <TextField
                  label="PORT"
                  size="small"
                  value={sprintPORT}
                  onChange={(e) => {
                    setSpringPORT(e.target.value);
                  }}
                /> */}
              </>
            )}
          </div>
          {/* PORTAINER */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">PORTAINER</label>
              <IconButton
                onClick={() => {
                  setHasPortainer(!hasPortainer);
                }}
              >
                {hasPortainer ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
          </div>
          {/* JENKINS */}
          <div className="flex flex-col gap-4 bg-zinc-700 p-2 rounded-lg w-full">
            <div className="flex justify-between items-center">
              <label className="text-white">JENKINS</label>
              <IconButton
                onClick={() => {
                  setHasJenkins(!hasJenkins);
                }}
              >
                {hasJenkins ? (
                  <RemoveCircleIcon sx={{ color: "white" }} />
                ) : (
                  <AddCircleIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </div>
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
        build: ${reactURL}
        container_name: react_frontend
        ports:
        - "${reactPORT}:80"
        networks:
        - db_network
        restart: always`
        : ``
    }

    ${
      hasSpring
        ? `# Backend: Spring Boot
    backend:
        build:
            context: ${springURL}
            dockerfile: dockerfile
        environment:
        - SPRING_PROFILES_ACTIVE=dev
        - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/mydb
        - SPRING_DATASOURCE_USERNAME=admin
        - SPRING_DATASOURCE_PASSWORD=admin
        ports:
        - "${sprintPORT}:8080"
        networks:
        - app-network
        depends_on:
        - db
        - keycloak`
        : ``
    }

    ${
      hasJMeter
        ? `# JMeter: Para pruebas de carga
    jmeter:
        image: justb4/jmeter
        ports:
        - "60000:60000"
        networks:
        - app-network`
        : ``
    }

    ${
      hasKeycloak
        ? `# Keycloak Service
    keycloak:
        image: quay.io/keycloak/keycloak:latest
        command: start-dev
        container_name: keycloak
        environment:
        - KC_BOOTSTRAP_ADMIN_USERNAME=${keycloakUser}
        - KC_BOOTSTRAP_ADMIN_PASSWORD=${keycloakPassword}
        - DB_VENDOR=POSTGRES
        - DB_ADDR=db
        - DB_DATABASE=mydatabase
        - DB_USER=admin
        - DB_PASSWORD=secret  
        ports:
        - "${keycloakPort}:8080"
        depends_on:
        - db
        networks:
        - db_network
        restart: always`
        : ``
    }
    ${
      hasPortainer
        ? `# Portainer: Gestión de contenedores
    portainer:
        image: portainer/portainer-ce:latest
        container_name: portainer
        ports:
        - "9000:9000"
        volumes:
        - /var/run/docker.sock:/var/run/docker.sock
        - portainer-data:/data
        networks:
        - app-network
        restart: always`
        : ``
    }

    ${
      hasJenkins
        ? `# Jenkins: Integración continua
    jenkins:
        image: jenkins/jenkins:lts
        container_name: jenkins
        user: root
        environment:
        - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
        ports:
        - "8083:8080"
        - "50000:50000"
        volumes:
        - jenkins-data:/var/jenkins_home
        - /var/run/docker.sock:/var/run/docker.sock
        networks:
        - app-network
        restart: always`
        : ``
    }

networks:
    app-network:
        driver: bridge
    db_network:
        driver: bridge

volumes:
    postgres-data:
        driver: local
    postgres-backups:
        driver: local
    ${
      hasKeycloak
        ? `keycloak-data:
        driver: local`
        : ``
    }
    ${
      hasPortainer
        ? `portainer-data:
        driver: local`
        : ``
    }
    ${
      hasJenkins
        ? `jenkins-data:
        driver: local`
        : ``
    }
            `}
          />
        </div>
      </div>
    </div>
  );
}

export default Services;

const javaDockerfile = `
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
`;

const reactDockerfile = `
FROM node:18 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Creamos la versión optimizada para producción de la app
RUN npm run build

# Usamos una imagen de Nginx para servir la aplicación estática
FROM nginx:alpine

# Copiamos los archivos generados por React en la imagen Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponemos el puerto 80 para acceder al frontend
EXPOSE 80

# Iniciamos Nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]

`;
