"use client"

import { useSearchParams } from 'next/navigation'
import SideMenu from '@/app/components/UserComponents/SideMenu/SideMenu.js'
import CaseForm from '@/app/components/UserComponents/CaseForm/CaseForm.js'

export default function Report() {

    const params = useSearchParams()

    const chosenBuilding = params.get("building")   
    const chosenRoom = params.get("room")
    
    return (
        <>
        <SideMenu chosenBuilding={chosenBuilding} chosenRoom={chosenRoom}></SideMenu>
        <CaseForm></CaseForm>
        </>
    )
}