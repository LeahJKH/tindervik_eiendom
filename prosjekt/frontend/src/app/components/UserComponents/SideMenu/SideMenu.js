'use client'

import style from './sidemenu.module.css'
import { useState, useEffect } from 'react'
export default function SideMenu({chosenBuilding, chosenRoom, rD, bD}) {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 810);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    async function getData() {
            const response = await fetch(`http://localhost:3200/api/v1/bygg/${bD}/rom`, {
                method: 'GET',
                headers: {
                    'X-API-Key': 'tindvik-test-2026',
                    'Content-Type': 'application/json' 
                } 
            });
            let data = await response.json()
            console.log(response)
    }
    getData()
    return (
        <>
        <aside className={style.aside}>
            <section className={style.infosect}>
                <p className={style.pmain}>Nåværende bygg:</p>
                <p className={style.pside}>{chosenBuilding}</p>
                <p className={style.pmain}>Nåværende rom:</p>
                <p className={style.pside}>{chosenRoom}</p>
            </section>
            <hr className={style.splitter}></hr>
            <section className={style.listedCont}>

                <p className={style.pside}>Feil rom? klikk <span className={style.LinkBtn} onClick={handleOpen}>Her</span></p>
                 {isOpen?
                 <div className={isMobile? style.MobileRoomData: style.Roomcont}>
                    <button onClick={handleOpen}>X</button>
                    <div className={style.roomData}>
                    </div>
                </div>:<></>}
            </section>
        </aside>
        </>
    )
}