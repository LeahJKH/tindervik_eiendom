import sqlPromise from '../../config/ConnectDB.js'
import express from 'express'

const router = express.Router()

router.get('/Cases', async (req, res) => {
    try {
        const dbConnect = await sqlPromise;
        const result = await dbConnect
            .request()
            .query('SELECT * FROM T_Tindvik_Cases') 
        
        res.status(200).json(result.recordset)
        
    } catch (err) {  
        res.status(500).json({
            message: "Could not get cases"
        })
    }
})

export default router