import {Acceptable} from "@/types/types";
import {useEffect, useState} from "react";

function useDelete(url: string, id: number) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<undefined | any>(undefined);
    const [wasSuccessful, setSuccessful] = useState<boolean>(false);

    useEffect(() => {
        const deleteData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/delete/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) setSuccessful(true);
                else setSuccessful(false);
            } catch (error) {
                setError(error);
                setSuccessful(false);
            } finally {
                setLoading(false);
            }
        };

        deleteData();
    }, [url, id]);

    return { wasSuccessful, isLoading, error };
}

function useGet<T extends Acceptable>(url: string, id: number) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<undefined | any>(undefined);
    const [data, setData] = useState<undefined | T>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/get/${id}`);
                const responseBody = (await response.json()) as T;
                setData(responseBody);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, id]);

    return { data, isLoading, error };
}

function usePost<T extends Acceptable>(url: string, initialData: T) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<undefined | any>(undefined);
    const [data, setData] = useState<undefined | T>(undefined);

    useEffect(() => {
        const postData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(initialData),
                });

                const responseBody = (await response.json()) as T;
                setData(responseBody);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        postData();
    }, [url, initialData]);

    return { data, isLoading, error };
}

function useUpdate<T extends Acceptable>(url: string, id: number, newData: T) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<undefined | any>(undefined);
    const [data, setData] = useState<undefined | T>(undefined);

    useEffect(() => {
        const updateData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newData),
                });

                const responseBody = (await response.json()) as T;
                setData(responseBody);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        updateData();
    }, [url, id, newData]);

    return { data, isLoading, error };
}

export {
    useGet,
    usePost,
    useUpdate,
    useDelete
}