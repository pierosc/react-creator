import React from "react";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";
import { axiosInstance } from "./AxiosInstance";
import { queryClient } from "./QueryClient";
import { loginMutation } from "./LoginMutation";
import { loginExample } from "./LoginExample";

function Authentication() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <CodeEditor
        title="axiosInstance.js"
        codeString={axiosInstance}
        language="javascript"
      />
      <CodeEditor
        title="reactQueryClient.js"
        codeString={queryClient}
        language="javascript"
      />
      <CodeEditor
        title="App.jsx"
        codeString={`<QueryClientProvider client={queryClient}>
      <App />
</QueryClientProvider>`}
        language="jsx"
      />
      <CodeEditor
        title="useAuth.js"
        codeString={loginMutation}
        language="javascript"
      />
      <CodeEditor
        title="Login Component Example"
        codeString={loginExample}
        language="jsx"
      />
    </div>
  );
}

export default Authentication;
