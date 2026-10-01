export default function SideMenu({chosenBuilding, chosenRoom}) {
    return (
        <>
        <aside>
            <section>
                <p>Nåværende bygg:</p>
                <p>{chosenBuilding}</p>
                <p>Nåværende rom:</p>
                <p>{chosenRoom}</p>
            </section>
            <hr></hr>
            <section>
                <p></p>
                <div>

                </div>
            </section>
        </aside>
        </>
    )
}