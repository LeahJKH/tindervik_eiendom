import QRCode from 'qrcode';
import fs from 'fs';

const FrontendUrl = "http://localhost:3000/Report"
const apiUrl = "http://localhost:3200"

async function getRoomFromFDV() {
    let allRooms = [];
    let side = "/api/v1/rom"
    try {
        while (side) { 
            const response = await fetch(`${apiUrl}${side}`, {
                method: 'GET',
                headers: {
                    'X-API-Key': 'tindvik-test-2026',
                    'Content-Type': 'application/json' 
                } 
            });

            if (!response.ok) {
                throw new Error(`error: ${response.status}`);
            }
            
            const data = await response.json();
            const roomOnSite = data.data; 

            allRooms = allRooms.concat(roomOnSite); 

            side = data.paginering.neste;
        }
        
        return allRooms;
    } catch (err) {
        console.error("could not process", err);
        return []
    }
}

if (!fs.existsSync('../qrcodes')) {
    fs.mkdirSync('../qrcodes'); 
}

async function getBuildingData(byggId) {
    let res = await fetch(`${apiUrl}/api/v1/bygg/${byggId}`, {
        method: 'GET',
        headers: {
            'X-API-Key': 'tindvik-test-2026',
            'Content-Type': 'application/json' 
        } 
    })
    let data = await res.json() 
    let finished = await data 
    return finished
}

async function generateAllCodes() {
    console.log("Starting creating qr codes");
    let roomlistings = await getRoomFromFDV()


    for (const item of roomlistings) {
        let byggData = await getBuildingData(item.byggId)

        const url = `${FrontendUrl}?building=${byggData.navn}&room=${item.navn}&BD=${item.byggId}&RD=${item.id}`; // her kaller jeg idene BD og RD så man ikke automatisk tenker dette er noe viktig men jeg er nødt til og sende id'ene til frontenden ikke bare for og spare tid men også for og lett indexsere i frontenden for og gi lettere brukeropplevelse
        const fileName = `../qrcodes/${byggData.navn}_${item.navn}.png`.replace(/\s/g, '_');

        try {
            await QRCode.toFile(fileName, url, {
                width: 600,  
                margin: 6    
            });
        } catch (err) {
            console.error(`Was not able too save \nbuilding: ${byggData.navn}\nroom:${item.navn}:`, err);
        }
    }
    
    console.log("Done You can close this window now!");
}

generateAllCodes();