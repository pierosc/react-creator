import { createContext, useState, useRef } from "react";
import useDatabase from "../modules/database/CustomHooks/useDatabase";
const DatabaseContext = createContext();

function DatabaseProvider({ children }) {
  const database = useDatabase();
  return (
    <DatabaseContext.Provider
      value={{
        database,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}
export { DatabaseProvider };
export default DatabaseContext;
