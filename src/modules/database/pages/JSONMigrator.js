import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { Height } from "@mui/icons-material";

function JSONMigrator() {
  const [jsonData, setJsonData] = useState(null);
  const [table, setTable] = useState("");
  const [keys, setKeys] = useState("");
  const [output, setOutput] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);

  const migrate = (table, json, keys) => {
    let final = "";
    json.forEach((obj) => {
      const values = keys.map((key) => `"${obj[key]}"`);
      //   console.log(values);
      const line = `INSERT INTO ${table} (${keys.join()}) VALUES (${values.join()});`;
      //   console.log(line);
      final = `${final}${line}
`;
    });

    // console.log(final);
    return final;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsedJson = JSON.parse(e.target.result);
        setJsonData(parsedJson);

        // Obtener las claves del primer objeto del archivo JSON
        const keysFromJson = Object.keys(parsedJson[0]);
        setKeys(keysFromJson);
        setSelectedKeys(keysFromJson); // Por defecto, seleccionamos todas
      } catch (error) {
        alert("El archivo no es un JSON válido.");
      }
    };

    reader.readAsText(file);
  };

  const handleKeySelection = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key)); // Desmarcar
    } else {
      setSelectedKeys([...selectedKeys, key]); // Marcar
    }
  };

  function obtenerValoresUnicos(array, atributo) {
    // Usamos un Set para asegurar que los valores sean únicos
    const valoresUnicos = new Set();

    // Recorremos el array de objetos
    array.forEach((objeto) => {
      if (objeto.hasOwnProperty(atributo)) {
        // Añadimos el valor del atributo al Set
        valoresUnicos.add(objeto[atributo]);
      }
    });

    // Convertimos el Set de nuevo a un array y lo retornamos
    return [...valoresUnicos];
  }

  useEffect(() => {
    console.log(selectedKeys);
  }, [selectedKeys]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div>
          <label className="text-white">Nombre de la tabla: </label>
          <input
            type="text"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-white">Subir archivo JSON: </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            required
          />
        </div>
        {keys.length > 0 && (
          <div>
            <h3 className="text-white">
              Selecciona las claves para incluir en el SQL:
            </h3>
            <div className="grid gap-2">
              {keys.map((key) => (
                <div key={key}>
                  <label className="text-white">
                    <input
                      type="checkbox"
                      checked={selectedKeys.includes(key)}
                      onChange={() => handleKeySelection(key)}
                    />
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button
          onClick={() => {
            setOutput(migrate(table, jsonData, selectedKeys));
          }}
        >
          MIGRAR
        </Button>
        <Button
          onClick={() => {
            // console.log(table);
            console.log(jsonData);
            console.log(selectedKeys);
            selectedKeys.forEach((key) => {
              console.group(key);
              const unique = obtenerValoresUnicos(jsonData, key);
              if (unique.length < 20) {
                console.log(unique);
              }
              // jsonData.forEach((data) => {
              //   const unique = obtenerValoresUnicos(data, key);
              //   if (unique.length > 20) {
              //     console.log(unique);
              //   }
              // });
              console.groupEnd();
            });
            // obtenerValoresUnicos(array, atributo)
          }}
        >
          UNIQUE
        </Button>
      </div>
      <div style={{ height: "80vh" }} className="overflow-auto">
        <CodeEditor codeString={output} language="SQL" />
      </div>
    </div>
  );
}

export default JSONMigrator;
