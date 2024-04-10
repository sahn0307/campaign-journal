import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useFetchJSON from '../utils/helpers'
// import { useErrorAlerts } from './ErrorAlertsProvider'

export const UserContext = React.createContext()
// export const url = 'http://localhost:4000/records'

const AuthProvider = ({ children }) => {

    const { postJSON, patchJSON } = useFetchJSON()

    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider>
            {children}
        </UserContext.Provider>
    )
}



export default AuthProvider