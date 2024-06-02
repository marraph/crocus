import {useEffect, useState} from "react";
import {Acceptable} from "@/types/types";

const useDelete = (url: string, id: number) => {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<undefined | any>(undefined)
    const [wasSuccessful, setSuccessful] = useState<boolean>(false)

    const removeData = async () => {
        setLoading(true);

        try {

            const response = await fetch(`${url}/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) setSuccessful(true);
            else setSuccessful(false)

        } catch (error) {
            setError(error);
            setSuccessful(false);
        }

        setLoading(false);
    };

    useEffect(() => {
        removeData();
    }, [url, id]);

    return {isLoading, error, wasSuccessful};
}

const useGet = <T extends Acceptable>(url: string, id: number) => {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<undefined | any>(undefined)
    const [data, setData] = useState<undefined | T>(undefined)

    const fetchData = async () => {

        setLoading(true)

        try {
            const response = await fetch(`${url}/get/${id}`)
            const body = await response.json() as T
            setData(body)

        } catch (error) {
            setError(error)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [url])

    return {data, isLoading, error}
}

const usePost = <T extends Acceptable>(url: string, initialData: T) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<undefined | any>(undefined);
    const [data, setData] = useState<undefined | T>(undefined);

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

    useEffect(() => {
        postData()
    }, [url, initialData])

    return {isLoading, error, data};
}

const useUpdate = <T extends Acceptable>(url: string, id: number, newData: T) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<undefined | any>(undefined);
    const [data, setData] = useState<undefined | T>(undefined);

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


    useEffect(() => {
        updateData()
    }, [url, id, newData])

    return {data, isLoading, error};
}

export {
    useGet,
    usePost,
    useUpdate,
    useDelete
}