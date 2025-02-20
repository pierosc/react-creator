import { CC, JoinNewLine, UCC } from "../../../../../StringFunctions";

export const usequery = (table) => `
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance';
import { useState } from "react";

const use${UCC(table.name)} = () => {
  const queryClient = useQueryClient()
  const [${CC(table.name)}List, set${UCC(table.name)}List] = useState([])
  ${getSingleUseState(table)}

  const handleChangeField = (e) =>{
    set${UCC(table.name)}({ ...${CC(table.name)}, [e.target.name]: e.target.value})
  }

  // GET ALL
  const getAll = useQuery({
    queryKey: ["${CC(table.name)}", "getAll"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/${CC(table.name)}/getAll");
      set${UCC(table.name)}List(data?.data)
      return data;
    },
    enabled: false, // No ejecutar automáticamente
  });

  // ADD
  const add = useMutation(
    {mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/${CC(table.name)}/add', payload)
      return data
    },
    onSuccess: () => {
      // Invalida la cache para refrescar la lista
      queryClient.invalidateQueries(['${CC(table.name)}', 'getAll'])
    }
    }
  )

  // EDIT
  const edit = useMutation(
  { mutationFn: async (payload) => {
      const { data } = await axiosInstance.put('/${CC(table.name)}/edit', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['${CC(table.name)}', 'getAll'])
    }
    }
  )

  // DELETE
  const eliminate = useMutation(
{  mutationFn:  async (payload) => {
     
      const { data } = await axiosInstance.delete('/${CC(table.name)}/delete', {
        data: payload
      })
      return data
    },
      onSuccess: () => {
        queryClient.invalidateQueries(['${CC(table.name)}', 'getAll'])
      }
    }
  )

  // FILTER
  const filter = useMutation(
    { mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/${CC(table.name)}/filter', payload)
      return data
    }}
  )

  // FILTER EXCEL
  const filterExcel = useMutation(
{    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/${CC(table.name)}/filterExcel', payload, {
        responseType: 'blob'
      })
      return data // data es un Blob
    }}
  )

  return {
    ${CC(table.name)},
    set${UCC(table.name)},
    ${CC(table.name)}List,
    handleChangeField,
    getAll,
    add,
    edit,
    eliminate,
    filter,
    filterExcel
  }
}

export default use${UCC(table.name)}
`;
const state = (attr) =>
  `  const [${CC(attr.name)}, set${UCC(attr.name)}] = useState(${varType(
    attr.type
  )});`;

const toObjectAttr = (attr) => `${CC(attr.name)} : ${varType(attr.type)},`;

const getUseStates = (table) => {
  let states = [];
  table.attributes.map((attr) => {
    if (!attr.pk) {
      states = [...states, state(attr)];
    }
  });
  return states;
};

const getSingleUseState = (table) => {
  let states = [];
  table.attributes.map((attr) => {
    if (!attr.pk) {
      states = [...states, toObjectAttr(attr)];
    }
  });

  return ` const [${CC(table.name)}, set${UCC(table.name)}] = useState({
  ${JoinNewLine(states)}
  })`;
};

const getExports = (table) => {
  let states = [];
  table.attributes.map((attr) => {
    if (!attr.pk) {
      states = [...states, `    ${CC(attr.name)}`, `    set${UCC(attr.name)}`];
    }
  });
  return states;
};

const varType = (value) => {
  if (Array.isArray(value)) {
    return [];
  } else {
    if (
      value == "date" ||
      value == "timestamp" ||
      value.split("(")[0] == "varchar" ||
      value == "timestamp" ||
      value == "uuid"
    ) {
      return '""';
    }
    if (value == "serial" || value == "int" || value.split("(")[0] == "float") {
      return 0;
    }
    if (value == "boolean" || value == "bool") {
      return "true";
    }
  }
};
