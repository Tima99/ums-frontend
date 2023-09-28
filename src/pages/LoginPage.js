import React, { useState } from 'react'
import useSubmitForm from '../hooks/useSubmitForm'
import { GrFormClose } from "react-icons/gr"
import { useLocation } from 'react-router-dom'

export default function LoginPage() {

  const {state} = useLocation()
  const [userEntry, setUserEntry] = React.useState({ email: '', password: '' })
  const [submitHandler, err, setErr] = useSubmitForm({ apiRoute: `${process.env.REACT_APP_API_BASEURL}/login`, $data: userEntry, navigateRoute: '/' })
  const [userLoginSubmitHandler, userErr, setUserErr] = useSubmitForm({ apiRoute: `${process.env.REACT_APP_API_BASEURL}/userlogin`, $data: userEntry, navigateRoute: '/userHome', passState: true })
  const [userlogin, setUserlogin] = useState(state ? state.userlogin : false)

  return (
    <>
      <div className='header-entry' >
        <h3 className='pd-h-1'>{userlogin ? 'User Login' : 'Admin Login'}</h3>
        <div onClick={e => setUserlogin(prev => !prev)} className={'user-login'}>{!userlogin ? 'User Login' : 'Admin Login'}</div>
      </div>
      <form className="flex-col" onSubmit={userlogin ? userLoginSubmitHandler : submitHandler} key="admin-entry-form-email">
        <div className={err[0] == '$' ? "sucess" : "error"}>
          &nbsp;{err || userErr}&nbsp;
          <span className='close-error' onClick={() => {setErr(''); setUserErr('')}}>
            {err || userErr ? <GrFormClose color='red' /> : <>&nbsp;</>}
          </span>
        </div>
        {/* {
          userlogin && (
            <div className="input-group first-input-group">
              <label htmlFor="admin-email">Admin Email</label>
              <input type="email" name="adminEmail" id="admin-email" value={userEntry.adminEmail || ''} onChange={changeHandler} required />
            </div>
          )
        } */}
        <div className={`input-group first-input-group`}>
          <label htmlFor="email">{userlogin ? 'User Email' :'Email'}</label>
          <input type="email" name="email" id="email" value={userEntry.email} onChange={changeHandler} required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" value={userEntry.password} onChange={changeHandler} required />
        </div>

        <button>Submit</button>
      </form>
    </>

  );



  function changeHandler(e) {
    setUserEntry(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }


  function EntryForm({ submitHandler, err, setErr, changeHandler, userEntry, key }) {
    console.count("render: ")
    return (<></>);
  }
}