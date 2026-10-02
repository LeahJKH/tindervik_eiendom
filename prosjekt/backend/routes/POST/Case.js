import sqlPromise from '../../config/ConnectDB.js'
import express from 'express'
import sql from 'mssql'

const router = express.Router()

router.post('/createCase', async (req, res) => {
    const {
        buildingID,
        roomID,
        description,
        seriousness = 'Lav', 
        namePerson = 'anonym',
        email = 'N/A',
        number = 'N/A',
        pictureUrl
    } = req.body;

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
            .input("pictureUrl", sql.VarChar(255), pictureUrl || null)
            .query(`
                INSERT INTO T_Tindvik_PersonInfo (
                    caseID, 
                    namePerson, 
                    email, 
                    number, 
                    pictureUrl
                )
                VALUES (
                    @caseID, 
                    @namePerson, 
                    @email, 
                    @number, 
                    @pictureUrl
                )
            `); // sql, sql, sql

        res.status(201).json({
            caseID: caseID,
            buildingID: buildingID,
            roomID: roomID,
            createdAt: newCase.CreatedDate,
            message: "Case was made!"
        });  // sends message back incase succesfull

    } catch (err) {
        console.error(err); // will make error customized
        res.status(500).json({
            message: 'Couldnt Create'
        });
    }
})

export default router