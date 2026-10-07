import style from './caseform.module.css'
import {useState} from 'react'

export default function CaseForm({ chosenBuilding, chosenRoom, rD, bD }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tlf, settlf] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("lav");
    
    const [bilde, setBilde] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("buildingID", bD);
        formData.append("roomID", rD);
        formData.append("namePerson", name);
        formData.append("email", email);
        formData.append("number", tlf); 
        formData.append("description", description);
        formData.append("seriousness", priority); 
        
        if (bilde) {
            formData.append("bilde", bilde); 
        }

        try {
            const res = await fetch('http://localhost:5000/api/createCase', {
                method: 'POST',
                body: formData 
            }); // her setter vi ikke content type til json dersom vi bruker formData og den vil ikke sende ut Json
            
            if(res.ok) {
                console.log("Sak sendt inn!");
            }
        } catch (error) {
            console.error("Feil ved innsending:", error);
        }
    }

    return (
        <div className={style.container}>
            <form className={style.fullForm} onSubmit={handleSubmit}>

                <label className={style.label}>
                    Fullt navn
                    <input type="text" placeholder="John Wick" className={style.input} value={name} onChange={e => setName(e.target.value)} />
                </label>
                
                <label className={style.label}>
                    Email
                    <input type="email" placeholder="John.wick@gmail.com" className={style.input} value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                
                <label className={style.label}>
                    Telefon:
                    <input type="tel" placeholder="+4784321922" className={style.input} value={tlf} onChange={e => settlf(e.target.value)} />
                </label>

                <label className={style.label}>
                    Forklar problemet*:
                    <textarea required placeholder="vasken lekker..." className={style.textarea} value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </label>

                <label className={style.label}>
                    Last opp bilde:
                    {/* sender heller bilde til databasen dersom det ikke blir tid til og gjøre noe annet. dette vil gjøre det tregere */}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className={style.input} 
                        onChange={(e) => setBilde(e.target.files[0])} 
                    />
                </label>

                <label className={style.label}>
                    Prioritet?*:
                    <select className={style.select} value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="lav">Lav</option>
                        <option value="middels">Middels</option>
                        <option value="kritisk">Kritisk</option>
                    </select>
                </label>

                <button type="submit" className={style.knapp}>Send inn</button>
            </form>
        </div>
    )
}