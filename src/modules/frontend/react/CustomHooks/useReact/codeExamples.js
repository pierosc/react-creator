export const useAxios = `
import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

export interface UseAxiosOptions extends AxiosRequestConfig {
    useGlobalCache?: boolean;
    onCompleted?: (data: any) => void;
    onError?: (error: AxiosError) => void;
    onFinally?: () => void;
}

export interface UseAxiosReturn<T> {
    data: T | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: AxiosError | null;
    fetchData: () => Promise<void>;
}

const globalCache: { [key: string]: any } = {};

function useAxios<T = any>(initialOptions: UseAxiosOptions): UseAxiosReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const fetchData = useCallback(async () => {
        setStatus('loading');
        setData(null);
        setError(null);

        try {
            const response = await axios(initialOptions);
            if (initialOptions.useGlobalCache && response.data) {
                globalCache[initialOptions.url as string] = response.data;
            }
            setData(response.data);
            setStatus('success');
            initialOptions.onCompleted?.(response.data);
        } catch (err) {
            setError(err as AxiosError);
            setStatus('error');
            initialOptions.onError?.(err as AxiosError);
        } finally {
            initialOptions.onFinally?.();
        }
    }, [initialOptions]);

    return { data, status, error, fetchData };
}

export default useAxios;
`;

export const useCustomAxios = `
import useAxios, { UseAxiosOptions, UseAxiosReturn } from './useAxios';
import { toast } from 'react-toastify';
import useUser from './useUser';

interface UseCustomAxiosOptions extends UseAxiosOptions {}

interface UseCustomAxiosReturn<T> extends UseAxiosReturn<T> {}

function useCustomAxios<T = any>(options: UseCustomAxiosOptions): UseCustomAxiosReturn<T> {

    const user = useUser()

    const defaultAxiosOptions: UseAxiosOptions = {
        headers: {
            "Content-Type": "application/json",
          Authorization: "Bearer " + user.TOKEN,
        }
    };

    // Determine method based on initial options
    const method = options.method || (options.data ? 'POST' : 'GET');

    // Merge user options with default options, with user options taking precedence
    const finalOptions = { 
        ...defaultAxiosOptions,
        ...options,
        method // Ensure method is set here, after merging
    };

    const axiosResponse = useAxios<T>(finalOptions);

    if (axiosResponse.status === 'error') {
        toast.error(axiosResponse.error?.message || "Unknown error", { theme: "dark" });
    }

    if (axiosResponse.status === 'success' && hasMessage(axiosResponse.data)) {
        toast.success(axiosResponse.data?.message , { theme: "dark" });
    }

    return axiosResponse;
}

export default useCustomAxios;

// Type Guards

interface DataWithMessage {
    message: string;
    [key: string]: any;  // This allows for any number of additional properties of any type
}

function hasMessage(data: any): data is DataWithMessage {
    return data !== null && typeof data === 'object' && typeof data.message === 'string';
}

`;

export const useJWT = ``;
