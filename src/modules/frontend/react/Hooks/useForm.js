import React from "react";

function useForm() {
  const tableToForm = (table) => {
    let form = {
      name: table.name,
      content: [
        {
          group: table.name,
        },
      ],
    };
  };
  return {};
}

export default useForm;
