import React from "react";
import Mermaid from "../../components/Mermaid/Mermaid";

function Diagram() {
  const flowchart = `
graph TB
    subgraph Services
        DB[PostgreSQL Database]
        Adminer[Adminer]
        Frontend[React Frontend]
        Backend[Spring Boot Backend]
        JMeter[JMeter for Load Testing]
        Keycloak[Keycloak Authentication Server]
    end

    subgraph Networks
        AppNetwork[app-network]
        DBNetwork[db-network]
    end

    subgraph Volumes
        PostgresData[postgres-data]
        PostgresBackups[postgres-backups]
        KeycloakData[keycloak-data]
    end

    %% Connections
    DB -->|"Connected via db_network"| DBNetwork
    Adminer -->|"Connected via db_network"| DBNetwork
    Frontend -->|"Connected via db_network"| DBNetwork
    Backend -->|"Connected via app-network"| AppNetwork
    JMeter -->|"Connected via app-network"| AppNetwork
    Keycloak -->|"Connected via db_network"| DBNetwork
    Keycloak -->|"Connected via app-network"| AppNetwork

    %% Dependencies
    Backend -->|"Depends on"| DB
    Backend -->|"Depends on"| Keycloak
    Keycloak -->|"Depends on"| DB

    %% Volumes
    DB -->|"Uses volume"| PostgresData
    Keycloak -->|"Uses volume"| KeycloakData

    %% Notes
    NoteDB[PostgreSQL stores data in 'postgres-data']
    NoteAdminer[Adminer provides a UI for database management]
    NoteFrontend[React serves as the frontend for the application]
    NoteBackend[Spring Boot backend interacts with database and Keycloak]
    NoteKeycloak[Keycloak manages authentication using PostgreSQL]
    NoteJMeter[JMeter tests backend performance]

    NoteDB --> DB
    NoteAdminer --> Adminer
    NoteFrontend --> Frontend
    NoteBackend --> Backend
    NoteKeycloak --> Keycloak
    NoteJMeter --> JMeter

 

  `;
  return (
    <div className="col-span-5" style={{ height: "80vh" }}>
      <Mermaid chart={flowchart} />
    </div>
  );
}

export default Diagram;
