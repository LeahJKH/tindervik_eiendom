import style from './CaseListMain.module.css'
export default function CaseListMain() {
    return (
        <>
        <main className={style.Main}>
            <section className={style.CaseOptionsCont}>
                <p>saks liste</p>
                
                <label>
                    sorter prioritet
                    <select className={style.SelectCase}>
                        <option>--VELG--</option>
                        <option>Lav</option>
                        <option>middels</option>
                        <option>kritisk</option>
                    </select>
                </label>
            </section>
            <section className={style.CaseVeiw}>

            </section>
            <button className={style.Fler}>Se flere</button>
        </main>
        </>
    )
}