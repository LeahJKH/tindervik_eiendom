import style from './StatHeader.module.css'
export default function StatHeader() {
    return (
        <>
        <header className={style.Header}>
            <section className={style.GraphMenu}>
                <div className={style.GraphCont}>
                    <p>Antall</p>
                </div>

                <div className={style.GraphCont}>
                    <p>Antall</p>
                </div>

                <div className={style.GraphCont}>
                    <p>Antall</p>
                </div>
            </section>
            <button className={style.moreBtn}>Se flere</button>
        </header>
        </>
    )
}