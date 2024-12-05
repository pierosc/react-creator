import React, { useState } from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { TextField } from "@mui/material";

function VolumeCommands() {
  const [topic, setTopic] = useState("{topic-name}");
  const [host, setHost] = useState("{host}");
  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <TextField
          label="TOPIC"
          size="small"
          onChange={(e) => {
            setTopic(e.target.value);
          }}
        />
        <TextField
          label="HOST"
          size="small"
          defaultValue={host}
          onChange={(e) => {
            setHost(e.target.value);
          }}
        />
      </div>
      <label className="text-white">* Volumes for data persistence</label>
      <CodeEditor
        title="Create volume"
        padding="5px"
        language="docker"
        codeString={`docker volume create nombre-del-volumen`}
      />
      <CodeEditor
        title="List volumes"
        padding="5px"
        language="cmd"
        codeString={`docker volume ls`}
      />
      <CodeEditor
        title="Get volume information"
        padding="5px"
        language="cmd"
        codeString={`docker volume inspect nombre-del-volumen`}
      />
      <CodeEditor
        title="Remove a volume"
        padding="5px"
        language="cmd"
        codeString={`docker volume rm nombre-del-volumen`}
      />
    </div>
  );
}

export default VolumeCommands;
