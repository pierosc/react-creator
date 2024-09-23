import React from "react";

function useForm() {
  const tableToForm = (table) => {
    let form = {
      name: table.name,
      content: [
        {
          group: table.name,
          attr: table.attr,
        },
      ],
    };
  };
  return {};
}

export default useForm;
