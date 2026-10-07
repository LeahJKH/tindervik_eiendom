import sqlPromise from '../../config/ConnectDB.js'
import express from 'express'
import sql from 'mssql'
const router = express.Router()

router.post('/Key', async (req, res) => {
    const {key} = req.body

    try {
        const dbConnect = await sqlPromise;
        const result = await dbConnect
            .request()
            .input("key", sql.VarChar, key)
            .query('SELECT * FROM T_ApiKeys WHERE personKey = @key') 
        
        res.status(200).json(result.recordset[0])
        
    } catch (err) {  
        res.status(500).json({
            message: "Could not get cases"
        })
    }
})

export default router