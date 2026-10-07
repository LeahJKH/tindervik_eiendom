import Form from "next/dist/client/app-dir/form";
import style from './caseform.module.css'
export default function CaseForm() {

    return (
        <>
        <div className={style.container}>

        <form className={style.fullForm}>
            <label className={style.label}>
                Fult navn
            <input type="text" placeholder="John wick" className={style.input}/>
            </label>
            <label className={style.label}>
                Email
            <input type="email" placeholder="John.wick@gmail.com" className={style.input}/>
            </label>
            <label className={style.label}>
                telefon:
            <input type="tel" placeholder="+4784321922" className={style.input}/>
            </label>

            <label className={style.label}>
                forklar problemet*:
                <textarea required placeholder="vasken lekker..." className={style.textarea}></textarea>
            </label>

                <label className={style.label}>
                    prioritet?:
                    <select className={style.select}>
                        <option value="lav">Lav</option>
                        <option value="middels">middels</option>
                        <option value="kritisk">kritisk</option>
                    </select>
                </label>

            <button className={style.knapp}>Send inn</button>
        </form>
        </div>
        </>
    )
}