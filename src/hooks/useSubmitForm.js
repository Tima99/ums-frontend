import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { flushSync } from 'react-dom';

export default function useSubmitForm({apiRoute, $data, navigateRoute, options, validity, setDataTo, passState, cb, loadingText, btnText}) {
    const [err, setErr] = useState('')
    const navigate      = useNavigate()

    let timeout = null
    useEffect(() => {
        clearTimeout(timeout)
        timeout = setTimeout(setErr, 2500, '')
        return () => clearTimeout(timeout)
    }, [err])

    async function submitHandler(e) {
        e.preventDefault()
        
        try {
            validity && validity()
            if(loadingText){
                e.target.disabled = true
                e.target.innerText = loadingText
            }

            const res = await fetch(apiRoute, {
                method: "POST",
                body: JSON.stringify($data),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
            })
            const data = await res.json()

            if (res.status != 200) throw Error(data.message || data)

            setErr(`$ Sucess`)

            if(Array.isArray(setDataTo)){
                setDataTo.forEach(setData => {
                    flushSync(() => {
                        setData([...data])
                    })
                })
            }else{
                setDataTo && setDataTo(data)
            }
            

            if(cb) cb(data)
            
            if(navigateRoute && passState)
                navigate(navigateRoute, {replace: true, state: data})
            if (navigateRoute)
                navigate(navigateRoute, { replace: true, ...options })
        } catch (error) {
            // console.log(error)
            setErr(error.toString())
        }
        finally{
            if(btnText){
                e.target.disabled = false
                e.target.innerText = btnText
            }
        }
    }

    return [submitHandler, err, setErr]
}