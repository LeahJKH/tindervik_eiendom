import QRCode from 'qrcode';
import fs from 'fs';

//CHANGE BASED ON YOURS
const FrontendUrl = "http://localhost:3000/Report"
const apiUrl = "http://localhost:3200"
// CHANGE BASED ON YOURS

async function getRoomFromFDV() {
    let allRooms = [];
    let side = "/api/v1/rom"
    try {
        while (side) { // runs as long as we have a page
            const response = await fetch(`${apiUrl}${side}`, {
                method: 'GET',
                headers: {
                    'X-API-Key': 'tindvik-test-2026',
                    'Content-Type': 'application/json' 
                } // sends in the api key !NOTE: move this too env leah
            });

            if (!response.ok) {
                throw new Error(`error: ${response.status}`);
            }
            
            const data = await response.json();
            const roomOnSite = data.data; 

            allRooms = allRooms.concat(roomOnSite); // puts all rooms in one 

            side = data.paginering.neste;
        }
        
        return allRooms;
    } catch (err) {
        console.error("could not process", err);
    }
}

if (!fs.existsSync('../qrcodes')) {
    fs.mkdirSync('../qrcodes'); // creates a qr code folder if u dont have one just a double check
}

async function generateAllCodes() {
    console.log("Starting creating qr codes");
    let roomlistings = await getRoomFromFDV()


    roomlistings.forEach((item) => {
        let byggData;
        
  
            let res = await fetch(`${apiUrl}/api/v1/bygg/${item.byggId}`, {
                    method: 'GET',
                    headers: {
                        'X-API-Key': 'tindvik-test-2026',
                        'Content-Type': 'application/json' 
                    } // sends in the api key !NOTE: move this too env leah
                })
            let data = await res.json() 
            let finished = await data // need too find a way too async display the data
        
        byggData = getBuildingData()
        console.log(byggData)
        const url = `${FrontendUrl}?building=${byggData.navn}&room=${item.navn}`;
        const fileName = `../qrcodes/${byggData.navn}_${item.navn}.png`.replace(/\s/g, '_');

        try {
            QRCode.toFile(fileName, url, {
                width: 600,  
                margin: 6    
            });
        } catch (err) {
            console.error(`Was not able too save \nbuilding: ${item.bygg}\nroom:${item.rom}:`, err);
        }
    })
    
}

generateAllCodes();

console.log("Done You can close this window now!");