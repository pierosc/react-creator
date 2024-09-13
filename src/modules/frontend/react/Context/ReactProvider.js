import { createContext } from "react";
import useReactProject from "../Hooks/useReactProject";

const ReactContext = createContext();
function ReactProvider({ children }) {
  const reactPJ = useReactProject();
  return (
    <ReactContext.Provider
      value={{
        reactPJ,
      }}
    >
      {children}
    </ReactContext.Provider>
  );
}

export { ReactProvider };
export default ReactContext;
