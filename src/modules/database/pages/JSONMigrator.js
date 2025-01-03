import React, { useState, useCallback, useEffect } from "react";
import Papa from "papaparse";
import { Button } from "@mui/material";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";

/** ==============================
 *  Utilidades
 *  ============================== */
function guessDataType(value) {
  if (value == null) return "VARCHAR(255)";

  if (!isNaN(value) && Number.isInteger(Number(value))) {
    return "INT";
  }
  if (!isNaN(value) && !Number.isInteger(Number(value))) {
    return "FLOAT";
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}/;
  if (typeof value === "string" && dateRegex.test(value)) {
    return "DATE";
  }
  return "VARCHAR(255)";
}

function shouldQuote(dataType) {
  switch (dataType) {
    case "INT":
    case "FLOAT":
    case "BOOLEAN":
      return false;
    default:
      return true;
  }
}

/** ==============================
 *  Componente hijo: FieldRow
 *  ============================== */
const FieldRow = React.memo(function FieldRow({
  originalKey,
  isSelected,
  renameValue,
  dataTypeValue,
  onToggleSelected,
  onRenameChange,
  onTypeChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "4px",
      }}
    >
      {/* Checkbox para activar/desactivar este campo */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelected(originalKey)}
      />

      {/* Input para renombrar el campo, precargado con el nombre original */}
      <input
        type="text"
        value={renameValue}
        onChange={(e) => onRenameChange(originalKey, e.target.value)}
        style={{ width: "120px" }}
      />

      {/* Select para tipo de dato */}
      <select
        value={dataTypeValue}
        onChange={(e) => onTypeChange(originalKey, e.target.value)}
      >
        <option value="VARCHAR(255)">VARCHAR(255)</option>
        <option value="INT">INT</option>
        <option value="FLOAT">FLOAT</option>
        <option value="DATE">DATE</option>
        <option value="DATETIME">DATETIME</option>
        <option value="BOOLEAN">BOOLEAN</option>
      </select>
    </div>
  );
});

/** ==============================
 *  Componente principal
 *  ============================== */
function JSONMigrator() {
  const [jsonData, setJsonData] = useState([]);
  const [table, setTable] = useState("");
  const [keys, setKeys] = useState([]);

  // Manejo de selección de campos (checkbox)
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Mapeo: key => tipo de dato
  const [keyDataTypes, setKeyDataTypes] = useState({});

  // Mapeo: key => nombreRenombrado
  const [keyRenames, setKeyRenames] = useState({});

  // Resultado final
  const [output, setOutput] = useState("");

  // Lista de migraciones previamente guardadas en localStorage
  const [savedMigrations, setSavedMigrations] = useState([]);
  // Identificador de la migración seleccionada (para recargar)
  const [selectedMigrationIdx, setSelectedMigrationIdx] = useState("");

  /** ==============================
   *  Cargar la lista de migraciones al montar
   *  ============================== */
  useEffect(() => {
    const stored = localStorage.getItem("migratedDB");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedMigrations(parsed);
        }
      } catch (err) {
        console.warn("Error leyendo migratedDB de localStorage", err);
      }
    }
  }, []);

  /** ==============================
   *  Guardar en localStorage
   *  ============================== */
  const saveToLocalStorage = useCallback(
    (newMigration) => {
      // newMigration contendrá: { table, keys, selectedKeys, keyDataTypes, keyRenames, output }
      const updatedList = [...savedMigrations, newMigration];
      setSavedMigrations(updatedList);
      localStorage.setItem("migratedDB", JSON.stringify(updatedList));
    },
    [savedMigrations]
  );

  /** ==============================
   *  Cargar un archivo (CSV o JSON)
   *  ============================== */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setTable(fileNameWithoutExt);

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error("Errores al parsear CSV:", results.errors);
            alert("Error al parsear el CSV, revisa la consola.");
            return;
          }
          const data = results.data;
          setJsonData(data);

          if (data.length > 0) {
            const firstKeys = Object.keys(data[0]);
            setKeys(firstKeys);
            setSelectedKeys(firstKeys);

            const initTypes = {};
            const initRenames = {};
            firstKeys.forEach((k) => {
              initTypes[k] = guessDataType(data[0][k]);
              initRenames[k] = k; // por defecto, igual que original
            });
            setKeyDataTypes(initTypes);
            setKeyRenames(initRenames);
          }
        },
      });
    } else if (ext === "json") {
      const reader = new FileReader();
      reader.onload = (e2) => {
        try {
          const parsed = JSON.parse(e2.target.result);
          setJsonData(parsed);

          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstKeys = Object.keys(parsed[0]);
            setKeys(firstKeys);
            setSelectedKeys(firstKeys);

            const initTypes = {};
            const initRenames = {};
            firstKeys.forEach((k) => {
              initTypes[k] = guessDataType(parsed[0][k]);
              initRenames[k] = k;
            });
            setKeyDataTypes(initTypes);
            setKeyRenames(initRenames);
          }
        } catch (err) {
          alert("El archivo no es un JSON válido.");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Formato de archivo no soportado. Usa CSV o JSON.");
    }
  };

  /** ==============================
   *  Toggle selección de un campo
   *  ============================== */
  const handleToggleSelected = useCallback((key) => {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  }, []);

  /** ==============================
   *  Cambiar el rename de un campo
   *  ============================== */
  const handleRenameChange = useCallback((originalKey, newName) => {
    setKeyRenames((prev) => ({
      ...prev,
      [originalKey]: newName,
    }));
  }, []);

  /** ==============================
   *  Cambiar el tipo de un campo
   *  ============================== */
  const handleTypeChange = useCallback((originalKey, newType) => {
    setKeyDataTypes((prev) => ({
      ...prev,
      [originalKey]: newType,
    }));
  }, []);

  /** ==============================
   *  Generar CREATE TABLE
   *  ============================== */
  const generateCreateTable = useCallback(
    (tableName, columns) => {
      if (!columns.length) return "";
      const defs = columns
        .map((col) => {
          const colName = keyRenames[col] || col;
          const colType = keyDataTypes[col] || "VARCHAR(255)";
          return `${colName} ${colType}`;
        })
        .join(",\n  ");
      return `CREATE TABLE ${tableName} (\n  ${defs}\n);`;
    },
    [keyDataTypes, keyRenames]
  );

  /** ==============================
   *  Generar INSERT
   *  ============================== */
  const generateInserts = useCallback(
    (tableName, data, columns) => {
      if (!data || !columns.length) return "";

      let final = "";
      for (const row of data) {
        const values = columns.map((col) => {
          const colType = keyDataTypes[col] || "VARCHAR(255)";
          const val = row[col] ?? "";
          return shouldQuote(colType) ? `"${val}"` : `${val}`;
        });

        const renamedCols = columns.map((col) => keyRenames[col] || col);
        final += `INSERT INTO ${tableName} (${renamedCols.join(
          ", "
        )}) VALUES (${values.join(", ")});\n`;
      }
      return final;
    },
    [keyDataTypes, keyRenames]
  );

  /** ==============================
   *  Botón MIGRAR
   *  ============================== */
  const handleMigrate = () => {
    if (!jsonData || !selectedKeys.length || !table) return;

    const createSql = generateCreateTable(table, selectedKeys);
    const insertSql = generateInserts(table, jsonData, selectedKeys);
    const fullOutput = createSql + "\n\n" + insertSql;
    setOutput(fullOutput);

    // Guardar esta migración en localStorage
    const newMigration = {
      date: new Date().toISOString(),
      table,
      keys,
      selectedKeys,
      keyDataTypes,
      keyRenames,
      output: fullOutput,
    };
    saveToLocalStorage(newMigration);
  };

  /** ==============================
   *  Mostrar valores únicos en consola
   *  ============================== */
  const handleUnique = () => {
    if (!jsonData || !selectedKeys.length) return;
    selectedKeys.forEach((key) => {
      const uniqueVals = new Set(
        jsonData.map((row) => (row[key] !== undefined ? row[key] : null))
      );
      console.group(key);
      const arr = [...uniqueVals];
      if (arr.length <= 20) {
        console.log(arr);
      } else {
        console.log(
          `Más de 20 valores, mostrando primeros 20:`,
          arr.slice(0, 20)
        );
      }
      console.groupEnd();
    });
  };

  /** ==============================
   *  Manejar selección de migración previa
   *  ============================== */
  const handleSelectMigration = (idxString) => {
    setSelectedMigrationIdx(idxString);
    if (!idxString) return; // si se deselecciona

    const idx = parseInt(idxString, 10);
    if (savedMigrations[idx]) {
      const mig = savedMigrations[idx];

      // Restaurar sus estados
      setTable(mig.table || "");
      setKeys(mig.keys || []);
      setSelectedKeys(mig.selectedKeys || []);
      setKeyDataTypes(mig.keyDataTypes || {});
      setKeyRenames(mig.keyRenames || {});
      setOutput(mig.output || "");
      setJsonData([]);
      // OJO: si quisieras volver a tener el JSON,
      // tendrías que también haber guardado "jsonData".
      // Aquí solo recuperamos la configuración, no los datos.
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        {/* Nombre de la tabla */}
        <div>
          <label style={{ color: "white" }}>Nombre de la tabla: </label>
          <input
            type="text"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          />
        </div>

        {/* Subir archivo CSV/JSON */}
        <div>
          <label style={{ color: "white" }}>Subir archivo (JSON o CSV): </label>
          <input type="file" accept=".json, .csv" onChange={handleFileUpload} />
        </div>

        {/* Seleccionar migraciones previas */}
        <div style={{ marginTop: "8px" }}>
          <label style={{ color: "white", marginRight: "4px" }}>
            Cargar migración previa:
          </label>
          <select
            value={selectedMigrationIdx}
            onChange={(e) => handleSelectMigration(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {savedMigrations.map((mig, idx) => (
              <option key={idx} value={idx}>
                {`${idx + 1}. ${mig.table} (${new Date(mig.date).toLocaleString()})`}
              </option>
            ))}
          </select>
        </div>

        {/* Listado de campos (FieldRow) */}
        {keys.length > 0 && (
          <>
            <h3 style={{ color: "white", marginTop: "10px" }}>
              Campos (checkbox para incluir, input para renombrar, select para
              tipo):
            </h3>
            {keys.map((k) => (
              <FieldRow
                key={k}
                originalKey={k}
                isSelected={selectedKeys.includes(k)}
                renameValue={keyRenames[k] || ""}
                dataTypeValue={keyDataTypes[k] || "VARCHAR(255)"}
                onToggleSelected={handleToggleSelected}
                onRenameChange={handleRenameChange}
                onTypeChange={handleTypeChange}
              />
            ))}
          </>
        )}

        {/* Botones de acción */}
        <div style={{ marginTop: "10px" }}>
          <Button onClick={handleMigrate}>MIGRAR</Button>
          <Button onClick={handleUnique} style={{ marginLeft: "6px" }}>
            UNIQUE
          </Button>
        </div>
      </div>

      {/* Panel de resultados */}
      <div style={{ height: "80vh" }} className="overflow-auto">
        <CodeEditor codeString={output} language="SQL" />
      </div>
    </div>
  );
}

export default JSONMigrator;
