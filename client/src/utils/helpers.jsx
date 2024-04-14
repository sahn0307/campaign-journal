import { v4 as uuidv4} from 'uuid'

export const useFetchJSON = () => {
    const handleRequest = async (url, method, body = null) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        const configObj = {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        }
        try {
            const res = await fetch(url, configObj)
            if (!res.ok) {
                throw new Error('Request Failed: status: ' + res.status)
            }
            return res.status === 204 ? res : await res.json()
        } 
        catch (error) {
            throw new Error('Failed to Fetch: Is the server running?')
        }
    }

    const postJSON = async (url, formData) => {
        return await handleRequest(url, 'POST', formData)
    }

    const patchJSON = async (url, idOrIdEditingMode, formData) => {
        return await handleRequest(`${url}/${idOrIdEditingMode}`, 'PATCH', formData)
    }

    const deleteJSON = async (url) => {
        return await handleRequest(`${url}`, 'DELETE')
    }

    return { postJSON, patchJSON, deleteJSON }
}

export const addIdPlusOneLastArrayToNewElement = (currentStateVariable, formData) => {
    const lastVariableArray = currentStateVariable.slice(-1)
    const id = lastVariableArray.length
        ? Number(lastVariableArray[0].id) + 1
        : uuidv4()
    return [...currentStateVariable, { id, ...formData }]
}

export default useFetchJSON