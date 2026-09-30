import express from 'express'

const router = express.Router()


router.get('/Cases', async (req, res) => {
    res.json({
        message: "testing",
    })
})

export default router