import express from 'express'
import cors from 'cors'
// IMPORTS

//ROUTE IMPORTS
import Cases from './routes/GET/cases.js'
import Case from './routes/POST/Case.js'


// starting api under 5000 
const app = express()
const port = 5000
//

let allRoutes;
// routes
try {
     allRoutes = [Case, Cases]
} catch {
console.log("halla")
}
//

app.use(cors())
app.use(express.json())

allRoutes.forEach((route) => {
    try {
        app.use('/api', route)
    } catch (err) {
        console.warn('error: M.1 \nCheck the docs for fixes')
    }
})

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})

server.on('error', (err) => {
    console.log(err) // temp for now will change too an actuall checker
})