"use client"

import { useSearchParams } from 'next/navigation'
import SideMenu from '@/app/components/UserComponents/SideMenu/SideMenu.js'
import CaseForm from '@/app/components/UserComponents/CaseForm/CaseForm.js'

export default function Report() {

    const params = useSearchParams()

    const chosenBuilding = params.get("building")   
    const chosenRoom = params.get("room")
    const rD = params.get("rD")
    const bD = params.get("bD")
    
    return (
        <>
        <SideMenu chosenBuilding={chosenBuilding} chosenRoom={chosenRoom} rD={rD} bD={bD}></SideMenu>
        <CaseForm></CaseForm>
        </>
    )
}