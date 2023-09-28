import React, { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useBackShortCut(){
    const navigate = useNavigate()
    function close(e){
        if(e.keyCode == 27)
        navigate(-1)
    }
    useLayoutEffect(() => {
        document.addEventListener('keyup', close)
        return () => document.removeEventListener('keyup', close)
      }, [])
    
}

export default useBackShortCut;