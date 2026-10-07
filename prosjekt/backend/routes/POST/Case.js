import sqlPromise from '../../config/ConnectDB.js'
import express from 'express'
import sql from 'mssql'
import multer from 'multer'

const router = express.Router()

// lagrer bilde i RAM med bruk av multer
const upload = multer({ storage: multer.memoryStorage() })

// for og få tak i bilde må vi bruke upload.single metoden så den kan hente på riktig måte ettersom den blir sendt som formData
router.post('/createCase', upload.single('bilde'), async (req, res) => {

    const {
        buildingID,
        roomID,
        description,
        seriousness = 'Lav', 
        namePerson = 'anonym',
        email = 'N/A',
        number = 'N/A'
    } = req.body;
    // bilde våres vil ikke være i req.body men heller file
    const bildeBuffer = req.file ? req.file.buffer : null;
    
    try {

        const dbConnect = await sqlPromise;

        const caseResult = await dbConnect.request()
            .input("buildingID", sql.VarChar(50), buildingID)
            .input("roomID", sql.VarChar(50), roomID)
            .input("description", sql.NVarChar(sql.MAX), description)
            .input("seriousness", sql.VarChar(20), seriousness)
            .query(`
                INSERT INTO T_Tindvik_Cases (
                    buildingID,
                    roomID,
                    description,
                    Seriousness
                )
                OUTPUT 
                    INSERTED.caseID,
                    INSERTED.CreatedDate
                VALUES (
                    @buildingID,
                    @roomID,
                    @description,
                    @seriousness
                )
            `);

        const newCase = caseResult.recordset[0];
        const caseID = newCase.caseID;


        await dbConnect.request()
            .input("caseID", sql.UniqueIdentifier, caseID)
            .input("namePerson", sql.VarChar(80), namePerson)
            .input("email", sql.VarChar(100), email)
            .input("number", sql.VarChar(100), number)
            .input("picture", sql.VarBinary(sql.MAX), bildeBuffer)
            .query(`
                INSERT INTO T_Tindvik_PersonInfo (
                    caseID, 
                    namePerson, 
                    email, 
                    number, 
                    picture
                )
                VALUES (
                    @caseID, 
                    @namePerson, 
                    @email, 
                    @number, 
                    @picture
                )
            `); 

        res.status(201).json({
            caseID: caseID,
            buildingID: buildingID,
            roomID: roomID,
            createdAt: newCase.CreatedDate,
            message: "Case was made!"
        });  

    } catch (err) {
        console.error(err); 
        res.status(500).json({
            message: 'Couldnt Create'
        });
    }
})

export default router