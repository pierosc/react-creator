import React, { useState } from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { TextField } from "@mui/material";

function Commands() {
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
      <label className="text-white">
        * Open the console on your kafka path, exmpl C:\Kafka
      </label>
      <CodeEditor
        title="Iniciar Zookeeper"
        padding="5px"
        language="cmd"
        codeString={`.\\bin\\windows\\zookeeper-server-start.bat .\\config\\zookeeper.properties`}
      />
      <CodeEditor
        title="Iniciar Kafka"
        padding="5px"
        language="cmd"
        codeString={`.\\bin\\windows\\kafka-server-start.bat .\\config\\server.properties`}
      />
      <CodeEditor
        title="Crea un nuevo topic en el servidor de kafka"
        padding="5px"
        language="cmd"
        codeString={`.\\bin\\windows\\kafka-topics.bat --create --topic ${topic} --bootstrap-server ${host}:9092`}
      />
      <CodeEditor
        title="Decribir los detalles de un topic"
        padding="5px"
        language="cmd"
        codeString={`.\\bin\\windows\\kafka-topics.bat --describe --topic ${topic} --bootstrap-server ${host}:9092`}
      />
      <CodeEditor
        title="List all topics inside a broker"
        padding="5px"
        language="cmd"
        codeString={`.\\bin\\windows\\kafka-topics.bat --list --bootstrap-server ${host}:9092`}
      />
      <CodeEditor
        title="Inicia una consola para ver mensajes de un topic específico"
        padding="5px"
        language="cmd"
        codeString={`.\\bin\\windows\\kafka-console-consumer.bat --topic ${topic} --bootstrap-server ${host}:9092`}
      />
      <CodeEditor
        title="Inicia una consola para enviar mensajes a un topic específico"
        padding="5px"
        language="javascript"
        codeString={`.\\bin\\windows\\kafka-console-producer.bat --broker-list ${host}:9092 --topic ${topic}`}
      />
    </div>
  );
}

export default Commands;
