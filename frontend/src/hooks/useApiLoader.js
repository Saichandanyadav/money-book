import { useEffect, useState } from "react";
import api from "../api/api";

let activeRequests = 0;
let setLoadingGlobal = () => {};

export function useApiLoader() {
  const [loading, setLoading] = useState(false);
  setLoadingGlobal = setLoading;

  useEffect(() => {
    // request started
    const req = api.interceptors.request.use((config) => {
      activeRequests++;
      setLoadingGlobal(true);
      return config;
    });

    // request finished
    const res = api.interceptors.response.use(
      (response) => {
        activeRequests--;
        if (activeRequests === 0) setLoadingGlobal(false);
        return response;
      },
      (error) => {
        activeRequests--;
        if (activeRequests === 0) setLoadingGlobal(false);
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(req);
      api.interceptors.response.eject(res);
    };
  }, []);

  return loading;
}
