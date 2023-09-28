import React, { useRef, useState } from 'react'
import { Navigate, Outlet } from "react-router-dom"
import Nav from "../componets/Nav";

export default function HomePage(){

  const [isUserAuth, setIsUserAuth] = useState(null)

  async function authUser(){
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASEURL}/auth`, { credentials: 'include'})
      if(res.status != 200) throw Error("Not authentic user")

      setIsUserAuth(await res.json())
    } catch (error) {
      fetch(`${process.env.REACT_APP_API_BASEURL}/authUser`, { credentials: 'include'})
      .then( res => res.json())
      .then( data => { 
        setIsUserAuth(data)
        if(!data.admin)
          setIsUserAuth(false)
        } )
      .catch(err => {
        // console.log(err)
        setIsUserAuth(false); 
      })

    }
  }

  React.useLayoutEffect(() => {
    authUser()
  }, [])

  if(isUserAuth == null) return <h3>Loading...</h3>

  if(isUserAuth == false) return <Navigate to={'/login'} replace={true}/>
  
  if(isUserAuth.admin) return <Navigate to={'/userHome'} replace={true} state={isUserAuth}/>

  return (
    <div>
      
      {/* Homepage */}
      <Nav admin={true}/>
      
      <Outlet  context={{isUserAuth}}/>

    </div>
  )
}
