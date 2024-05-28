import { useLocalStorage } from "../../../hooks/useStorage";
import { getDBDiagramStructure } from "./DBDiagram";

function useDatabase() {
  const [dataBases, setDataBases] = useLocalStorage("dataBases", []);

  const add = (db) => {
    setDataBases([...dataBases, db]);
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

  return { add, getDBDiagramStructure, dataBases };
}

export default useDatabase;
