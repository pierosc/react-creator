export const usequery = (table) => `
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL

const usePersonalsDataApi = (token) => {
  const queryClient = useQueryClient()

  // Configuramos axios para usar la baseURL y el token
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: "Bearer " + token
    }
  })

  // GET ALL
  const getAllQuery = useQuery(['personalsData', 'getAll'], async () => {
    const { data } = await axiosInstance.get('/personalsData/getAll')
    return data
  })

  // ADD
  const addMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post('/personalsData/add', payload)
      return data
    },
    {
      onSuccess: () => {
        // Invalida la cache para refrescar la lista
        queryClient.invalidateQueries(['personalsData', 'getAll'])
      }
    }
  )

  // EDIT
  const editMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.put('/personalsData/edit', payload)
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['personalsData', 'getAll'])
      }
    }
  )

  // DELETE
  const deleteMutation = useMutation(
    async (payload) => {
     
      const { data } = await axiosInstance.delete('/personalsData/delete', {
        data: payload
      })
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['personalsData', 'getAll'])
      }
    }
  )

  // FILTER
  const filterMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post('/personalsData/filter', payload)
      return data
    }
  )

  // FILTER EXCEL
  const filterExcelMutation = useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post('/personalsData/personalsDataFilterExcel', payload, {
        responseType: 'blob'
      })
      return data // data es un Blob
    }
  )

  return {
    getAllQuery,
    addMutation,
    editMutation,
    deleteMutation,
    filterMutation,
    filterExcelMutation
  }
}

export default usePersonalsDataApi
`;
