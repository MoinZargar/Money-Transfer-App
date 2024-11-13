import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
         //authentication is required but user is not authenticated
        if(authentication && authStatus !== authentication){
            navigate("/signin")
        }
        //authentication is not required but user is authenticated
        else if(!authentication && authStatus !== authentication){
            navigate("/dashboard")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? <h1>Loading...</h1> : <>{children}</>
}
