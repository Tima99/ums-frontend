import React, { useEffect, useRef } from "react";

const useClickOutsideDom = (cb) => {
  const domRef = useRef();
  // console.count("log: ")

  function outsideDom(e) {
    let target = e.target
    do{
        if(target !== domRef.current){
            cb(domRef.current)
        }else break
        
        target = target.parentNode
    }while(target)

  }

  useEffect(() => {
    document.addEventListener("click", outsideDom);

    return () => document.removeEventListener("click", outsideDom);
  }, []);

  return domRef;
};

export default useClickOutsideDom;
