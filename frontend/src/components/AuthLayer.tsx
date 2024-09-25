import { ReactNode, useEffect } from "react"
import {useNavigate} from 'react-router-dom'
const AuthLayer = ({children}:{children:ReactNode}) => {
    const navigate = useNavigate()
    useEffect(()=>{
        function isLogin(){
            const token = localStorage.getItem('token')
            if(!token){
                navigate('/signin')
            }
        }
        isLogin()
    },[navigate])
  return (
    <div>
        {children}

    </div>
  )
}

export default AuthLayer