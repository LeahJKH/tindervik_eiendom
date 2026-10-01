import Form from "next/dist/client/app-dir/form";

export default function CaseForm() {
    return (
        <>
        <form>
            <label>
            <input type="text" placeholder="John" />
            </label>
            <label>
            <input type="email" placeholder="John" />
            </label>
            <label>
            <input type="tel" placeholder="John" />
            </label>

            <label>
                <textarea></textarea>
            </label>

            <selection>
                <option></option>
                <option></option>
                <option></option>
                <option></option>
            </selection>

            <button>Send inn</button>
        </form>
        </>
    )
}