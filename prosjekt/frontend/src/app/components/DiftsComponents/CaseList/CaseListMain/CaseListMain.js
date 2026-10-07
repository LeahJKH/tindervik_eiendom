"use client"
import style from './CaseListMain.module.css'
import { useState, useEffect } from 'react'

export default function CaseListMain() {
    const [cases, setCases] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/Cases');
                if (res.ok) {
                    const data = await res.json();
                    setCases(data); 
                }
            } catch (error) {
                console.error("Kunne ikke hente saker:", error);
            }
        };

        fetchCases();
    }, []);
    console.log(cases)
    return (
        <main className={style.Main}>
            <section className={style.CaseOptionsCont}>
                <p>Saksliste</p>
                
                <label>
                    Sorter prioritet
                    <select className={style.SelectCase}>
                        <option value="">--VELG--</option>
                        <option value="Lav">Lav</option>
                        <option value="middels">Middels</option>
                        <option value="kritisk">Kritisk</option>
                    </select>
                </label>
            </section>
            
            <section className={style.CaseVeiw}>
                {cases.length > 0 ? (
                    cases.map((sak) => (
                        <div key={sak.caseID} className={style.CaseCard}> 
                            <h3>Bygg {sak.buildingID} - Rom {sak.roomID}</h3>
                            <p>Prioritet: {sak.Seriousness}</p>
                            <p>Beskrivelse: {sak.description}</p>
                            <p>Meldt inn: {new Date(sak.CreatedDate).toLocaleDateString("no-NO")}</p> {/* This works with mmsql apperantly */}
                        </div>
                    ))
                ) : (
                    <p>Ingen saker funnet, eller laster data...</p>
                )} {/* Burde flyttest til et komponent */}
            </section>
            
            <button className={style.Fler}>Se flere</button>
        </main>
    )
}