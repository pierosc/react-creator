import { CC, JoinNewLine, UCC } from "../../../../../StringFunctions";

export const usequery = (table) => `
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL

const use${UCC(table.name)} = (token) => {
  const queryClient = useQueryClient()

${JoinNewLine(getUseStates(table))}
${getSingleUseState(table)}
  // Configuramos axios para usar la baseURL y el token
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: "Bearer " + token
    }
  })

  // GET ALL
  const getAllQuery = useQuery(['${CC(table.name)}', 'getAll'], async () => {
    const { data } = await axiosInstance.get('/${CC(table.name)}/getAll')
    return data
  })

  // ADD
  const addMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post('/${CC(table.name)}/add', payload)
      return data
    },
    {
      onSuccess: () => {
        // Invalida la cache para refrescar la lista
        queryClient.invalidateQueries(['${CC(table.name)}', 'getAll'])
      }
    }
  )

  // EDIT
  const editMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.put('/${CC(table.name)}/edit', payload)
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['${CC(table.name)}', 'getAll'])
      }
    }
  )

  // DELETE
  const deleteMutation = useMutation(
    async (payload) => {
     
      const { data } = await axiosInstance.delete('/${CC(table.name)}/delete', {
        data: payload
      })
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['${CC(table.name)}', 'getAll'])
      }
    }
  )

  // FILTER
  const filterMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post('/${CC(table.name)}/filter', payload)
      return data
    }
  )

  // FILTER EXCEL
  const filterExcelMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post('/${CC(table.name)}/filterExcel', payload, {
        responseType: 'blob'
      })
      return data // data es un Blob
    }
  )

  return {
${JoinNewLine(getExports(table), ",")},
    getAllQuery,
    addMutation,
    editMutation,
    deleteMutation,
    filterMutation,
    filterExcelMutation
  }
}

export default use${UCC(table.name)}Api
`;
const state = (attr) =>
  `  const [${CC(attr.name)}, set${UCC(attr.name)}] = useState(${varType(
    attr.type
  )});`;

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
      states = [...states, state(attr)];
    }
  });

  return ` const [${CC(table.name)}, set${UCC(table.name)}] = useState([])`;
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
    if (value == "boolean") {
      return false;
    }
  }
};
