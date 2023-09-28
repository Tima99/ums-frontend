import { useState } from "react"

let selectStart = false
function $selectedRows(e, setSelectedRows, setSelect, isInputSelection, selectedRows){
    if(isInputSelection) return
    if(e.type === "mousedown"){
        const tr = getEle(e.target)
        if(tr && isAlreadySelected(selectedRows, tr)){
            setSelect(false)
            setSelectedRows([])
            return
        } 
        selectStart = true
    }
    
    if(e.type === "mousemove" && selectStart){
        select(e.target, setSelectedRows, setSelect)
    }
    
    if(e.type === "mouseup"){
        selectStart = false
    }
}

function isAlreadySelected(rows, tr){
    return rows.some(row => row == tr.getAttribute('data'))
}

function select(target, setSelectedRows, setSelect){
    
        const tr = getEle(target)
        if(!tr) return

        setSelect(true)

        setSelectedRows(prev => {
            const isExist = prev.some(i => i  === tr.getAttribute('data'))
            if(isExist) return prev
            return [...prev, tr.getAttribute('data')]
        })
}

function getEle(target){
    let tr = null
        if(target.matches('td') || target.matches('input'))
            tr = target.parentElement
        if(target.matches('label')){
            tr = target.parentElement.parentElement.parentElement  
        }
        else if(target.matches('div') && target.className.includes('td-select')){
            tr = target.parentElement.parentElement  
        }

        if(!tr || tr.getAttribute('data') === null) return null

        return tr
}

export default $selectedRows