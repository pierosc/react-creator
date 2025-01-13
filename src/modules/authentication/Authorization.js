import React from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { UCC } from "../../StringFunctions";

function Authorization({ actualDb }) {
  console.log(actualDb);
  const db = actualDb?.json;

  const getResource = (table) => {
    return `{
      "name": "${UCC(table)}",
      "ownerManagedAccess": false,
      "displayName": "${UCC(table)}",
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

  const getPermission = (table) => {
    return `{
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
    }`;
  };

  const getPolicy = (table) => {
    return `{
      "name": "new_poli",
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
    {
      "name": "Customers",
      "ownerManagedAccess": false,
      "displayName": "Customers",
      "attributes": {},
      "uris": [],
      "scopes": [
        {
          "name": "get"
        }
      ],
      "icon_uri": ""
    }
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
