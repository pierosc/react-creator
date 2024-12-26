import React from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";

function Realm() {
  return (
    <CodeEditor
      title="mi-realm.json"
      padding="0px 25px "
      language="json"
      fontSize="12px"
      codeString={`{
  "realm": "mi-realm",
  "enabled": true,
  "displayName": "Mi Realm de Ejemplo",
  "sslRequired": "none",
  "registrationAllowed": false,
  "loginWithEmailAllowed": true,
  "duplicateEmailsAllowed": false,
  "resetPasswordAllowed": true,
  "internationalizationEnabled": true,
  "supportedLocales": ["en", "es"],
  "defaultLocale": "es",
  "users": [
    {
      "username": "usuario.admin",
      "enabled": true,
      "emailVerified": true,
      "email": "admin@example.com",
      "credentials": [
        {
          "type": "password",
          "value": "Admin123$",
          "temporary": false
        }
      ],
      "realmRoles": ["admin"]
    }
  ],
  "roles": {
    "realm": [
      {
        "name": "admin",
        "description": "Rol con privilegios administrativos en mi-realm"
      },
      {
        "name": "user",
        "description": "Rol básico de usuario"
      }
    ]
  },
  "clients": [
    {
      "clientId": "mi-cliente-seguro",
      "name": "Mi Cliente con Authorization",
      "enabled": true,
      "protocol": "openid-connect",
      "publicClient": false,
      "secret": "12345678-xxxx-xxxx-xxxx-xxxxxxxx",
      "authorizationServicesEnabled": true,
      "authorizationSettings": {
        "policyEnforcementMode": "ENFORCING",
        "decisionStrategy": "UNANIMOUS",
        "allowRemoteResourceManagement": false,
        "resources": [
          {
            "name": "ResourceA",
            "type": "urn:miapp:resourcea",
            "ownerManagedAccess": false,
            "uris": ["/api/resourcea/*"],
            "scopes": [
              {
                "name": "read"
              },
              {
                "name": "write"
              }
            ]
          }
        ],
        "scopes": [
          {
            "name": "read"
          },
          {
            "name": "write"
          }
        ],
        "policies": [
          {
            "id": "f32b6578-9a09-4ff5-8dcf-3c59fe000000",
            "name": "Only Admin Policy",
            "type": "role",
            "logic": "POSITIVE",
            "decisionStrategy": "UNANIMOUS",
            "config": {
              "roles": "[{\"id\":\"admin\",\"required\":true}]"
            }
          }
        ]
      }
    }
  ]
}
`}
    />
  );
}

export default Realm;
