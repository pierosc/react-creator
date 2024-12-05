import React, { useState } from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { TextField } from "@mui/material";

function NetworkCommands() {
  const [networkName, setNetworkName] = useState("nombre-de-la-red");
  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <TextField
          label="Network Name"
          size="small"
          onChange={(e) => {
            setNetworkName(e.target.value);
          }}
        />
      </div>
      <label className="text-white">* Networks</label>
      <CodeEditor
        title="Create networks"
        padding="5px 25px"
        language="docker"
        codeString={`docker network create ${networkName}`}
      />
      <CodeEditor
        title="List networks"
        padding="5px 25px"
        language="cmd"
        codeString={`docker network ls`}
      />
      <CodeEditor
        title="Get network information"
        padding="5px 25px"
        language="cmd"
        codeString={`docker network inspect ${networkName}`}
      />
      <CodeEditor
        title="Remove a network"
        padding="5px 25px"
        language="cmd"
        codeString={`docker network rm ${networkName}`}
      />
      <CodeEditor
        title="Connect container to network"
        padding="5px 25px"
        language="cmd"
        codeString={`docker network connect ${networkName} nombre-del-contenedor`}
      />
      <CodeEditor
        title="Disconnect container from network"
        padding="5px 25px"
        language="cmd"
        codeString={`docker network disconnect ${networkName} nombre-del-contenedor`}
      />
    </div>
  );
}

export default NetworkCommands;
