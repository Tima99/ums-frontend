import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Nav = ({ admin }) => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(1)

  useEffect(() => {
    if(window.location.href.includes('/users'))
      setIsActive(prev => 2)
  }, [])

  function Logout(e) {
    fetch(`${process.env.REACT_APP_API_BASEURL}/logout`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        navigate('/login', { replace: true })
      })
      .catch(err => {
        console.log(err)
        alert("We not able to logout you. Try Again.")
      })
  }

  return (
    <div className='nav flex'>
      <input type="radio" name="select-nav" id="select-nav-home" checked={isActive === 1} onChange={() => {}}/>
      <label htmlFor="select-nav-home"
        onClick={e => {
          setIsActive(1)
          navigate('/')
        }}
      >
          Home
      </label>
      <input type="radio" name="select-nav" id="select-nav-users" checked={isActive === 2} onChange={() => {}}/>
      {
        admin && (
          <label htmlFor="select-nav-users"
            onClick={e => {
              setIsActive(2)
              navigate('/users')
            }}
          >
            Users
          </label>
        )
      }

      <div
        style={{
          color: 'white',
          fontSize: '.8rem',
          textAlign: 'right',
          flex: 1,
          justifyContent: "flex-end"
        }}
        className="flex r-v-end"
      >
        <span onClick={Logout} style={{cursor: 'pointer'}}>Logout</span>
      </div>
    </div>
  )
}

export default Nav