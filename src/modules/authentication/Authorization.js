import React from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { CC, JoinNewLine, UCC } from "../../StringFunctions";

function Authorization({ actualDb }) {
  console.log(actualDb);
  const db = actualDb?.json ?? [];
  console.log(db);
  const getResource = (table) => {
    return `{
      "name": "${UCC(table.name)}",
      "ownerManagedAccess": false,
      "displayName": "${UCC(table.name)}",
      "attributes": {},
      "uris": [],
      "scopes": [
        {
          "name": "get"
        },
        {
          "name": "add"
        },
        {
          "name": "edit"
        },
        {
          "name": "delete"
        },
        {
          "name": "filter"
        },
        {
          "name": "filterExcel"
        }
      ],
      "icon_uri": ""
    }
    `;
  };
  console.log(db.map((table) => getResource(table)));
  console.log(JoinNewLine(db.map((table) => getResource(table))));

  const getPermission = (table) => {
    return `{
      "name": "${CC(table.name)}-get-permission",
      "description": "",
      "type": "scope",
      "logic": "POSITIVE",
      "decisionStrategy": "UNANIMOUS",
      "config": {
        "resources": "[\"${CC(table.name)}\"]",
        "scopes": "[\"get\"]",
        "applyPolicies": "[\"new_poli\"]"
      }
    }`;
  };

  const getPolicy = (table) => {
    return `{
      "name": "${CC(table.name)}Policy",
      "description": "",
      "type": "role",
      "logic": "POSITIVE",
      "decisionStrategy": "UNANIMOUS",
      "config": {
        "fetchRoles": "false",
        "roles": "[{\"id\":\"backend/new_client_role\",\"required\":false}]"
      }
    }`;
  };

  return (
    <CodeEditor
      title="authorization.json"
      padding="0px 25px "
      language="json"
      fontSize="12px"
      codeString={`{
  "allowRemoteResourceManagement": true,
  "policyEnforcementMode": "ENFORCING",
  "resources": [
    {
      "name": "Default Resource",
      "type": "urn:backend:resources:default",
      "ownerManagedAccess": false,
      "attributes": {},
      "uris": [
        "/*"
      ]
    },
${JoinNewLine(
  db.map((table) => getResource(table)),
  ","
)}
  ],
  "policies": [
    {
      "name": "Default Policy",
      "description": "A policy that grants access only for users within this realm",
      "type": "js",
      "logic": "POSITIVE",
      "decisionStrategy": "AFFIRMATIVE",
      "config": {
        "code": "// by default, grants any permission associated with this policy\n$evaluation.grant();\n"
      }
    },
    ${JoinNewLine(
      db.map((table) => getPolicy(table)),
      ","
    )}
    {
      "name": "new_poli",
      "description": "",
      "type": "role",
      "logic": "POSITIVE",
      "decisionStrategy": "UNANIMOUS",
      "config": {
        "fetchRoles": "false",
        "roles": "[{\"id\":\"backend/new_client_role\",\"required\":false}]"
      }
    },
    {
      "name": "Default Permission",
      "description": "A permission that applies to the default resource type",
      "type": "resource",
      "logic": "POSITIVE",
      "decisionStrategy": "UNANIMOUS",
      "config": {
        "defaultResourceType": "urn:backend:resources:default",
        "applyPolicies": "[\"Default Policy\"]"
      }
    },
${JoinNewLine(
  db.map((table) => getPermission(table)),
  ","
)}
    {
      "name": "Customers-get-permission",
      "description": "",
      "type": "scope",
      "logic": "POSITIVE",
      "decisionStrategy": "UNANIMOUS",
      "config": {
        "resources": "[\"Customers\"]",
        "scopes": "[\"get\"]",
        "applyPolicies": "[\"new_poli\"]"
      }
    }
  ],
  "scopes": [
    {
        "name": "get",
        "iconUri": ""
    },
    {
        "name": "add",
        "iconUri": ""
    },
    {
        "name": "edit",
        "iconUri": ""
    },
    {
        "name": "delete",
        "iconUri": ""
    },
    {
        "name": "filter",
        "iconUri": ""
    },
    {
        "name": "filterExcel",
        "iconUri": ""
    }
  ],
  "decisionStrategy": "UNANIMOUS"
}
    `}
    />
  );
}

export default Authorization;
