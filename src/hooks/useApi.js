import { useState, useCallback } from "react";

/**
 * useApi — generic hook wrapping any API call.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(studentsApi.getAll);
 *   useEffect(() => { execute({ page: 1 }); }, []);
 *
 * @param {Function} apiFunc — async function returning an axios response
 * @param {*}        initialData — default value for `data` before first call
 */
export function useApi(apiFunc, initialData = null) {
  const [data, setData]       = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err.message || "Something went wrong.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, loading, error, execute, reset };
}

/**
 * useMutation — for create / update / delete calls.
 * Doesn't store data locally; caller handles state.
 *
 * Usage:
 *   const { mutate, loading, error } = useMutation(studentsApi.create);
 *   const handleSubmit = async (formData) => {
 *     const result = await mutate(formData);
 *     // result is response.data
 *   };
 */
export function useMutation(apiFunc) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);
        return response.data;
      } catch (err) {
        setError(err.message || "Something went wrong.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { mutate, loading, error };
}
