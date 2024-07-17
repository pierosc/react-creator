import { useState, useEffect } from "react";
import { useLocalStorage } from "../../../hooks/useStorage";
import { getDBDiagramStructure } from "./DBDiagram";

function useDatabase() {
  const [dataBases, setDataBases] = useLocalStorage("dataBases", []);

  const add = (db) => {
    setDataBases([...dataBases, db]);
  };

  const [selected, setSelected] = useState({});

  useEffect(() => {
    console.group("NEW DATABASE SELECTED");
    console.log(selected);
    console.groupEnd();
  }, [selected]);

  const select = (dbName) => {
    setSelected(dataBases.find((v) => v.name === dbName));
  };

  const findByName = (dbName) => {
    return dataBases.find((v) => v.name === dbName);
  };
  // const databaseStructure = {
  //   name: "",
  //   type: "postgres",
  //   syntax: "DbDiagram",
  //   josn: {},
  //   plainText: "",
  //   ambient: [
  //     {
  //       name: "desarrollo",
  //       location: "172.17.32.97:5432/yachayhuasi_db",
  //       username: "",
  //       password: "",
  //     },
  //   ],
  // };

  return {
    add,
    getDBDiagramStructure,
    dataBases,
    findByName,
    select,
    selected,
    setSelected,
  };
}

export default useDatabase;
