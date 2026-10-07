"use client"

import style from './login.module.css'
import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function Login() {
    const [key, setkey] = useState("")

    const router = useRouter() // init the router

    async function login() {
        try {

        const response = await fetch("http://localhost:5000/api/Key", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            key: key,
            })
        })
        
        const data = await response.json() // wait for data
        
        if (!response.ok) {
            console.log(data.message) // send error msg from backend
            return
        }
        console.log(data)
        router.push("/dashboard")
        } catch (err) {
        console.error(err)
        }
        }
    return (
        <>
        <div className={style.LoginCont}>
            <div className={style.labelCont}>
                <label className={style.inputLabel}>
                    Key:
                    <input type="text" placeholder="" className={style.Input} value={key} onChange={(e) => setkey(e.target.value)} />
                </label>
            </div>
            <button className={style.loginBtn} onClick={login}>Logg inn</button>
        </div>
        </>
    )
}