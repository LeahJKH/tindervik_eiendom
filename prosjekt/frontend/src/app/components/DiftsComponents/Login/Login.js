import style from './login.module.css'
export default function Login() {
    return (
        <>
        <div className={style.LoginCont}>
            <div className={style.labelCont}>
                <label className={style.inputLabel}>
                    Key:
                    <input type="text" placeholder="" className={style.Input}/>
                </label>
            </div>
            <button className={style.loginBtn}>Logg inn</button>
        </div>
        </>
    )
}