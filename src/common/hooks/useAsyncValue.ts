import { useCallback, useEffect, useState } from "react"

export default function useAsyncValue<T>(
    getData: () => Promise<T>,
    defaultValue: T,
) {
    const [data, setData] = useState<T>(defaultValue)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [trigger, setTrigger] = useState<number>(0)

    const fetchData = useCallback(async () => {
        try {
            const newData = await getData()
            setData(newData)
        } catch (e) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [getData, setLoading])

    useEffect(() => {
        if (!loading) return
        fetchData()
    }, [loading, fetchData])

    useEffect(() => {
        if (trigger === 0) return
        fetchData()
    }, [trigger, fetchData])

    function refresh() {
        setTrigger((trigger) => trigger + 1)
    }

    return { data, error, loading, refresh }
}
