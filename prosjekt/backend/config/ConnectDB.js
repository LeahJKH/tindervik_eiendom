import sql from 'mssql'
import 'dotenv/config'

// DATABASE LOGIN INFO
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME
const dbServer = 'localhost' // we use local host here as it will automatically get the ip of the user so that we dont have too insert our own ip each time we switch computers
// DATABASE LOGIN INFO


// config files for microsoft sql database
const config = {
    user: dbUsername,
    password: dbPassword,
    server: dbServer,
    database: dbName,
    options: {
        trustServerCertificate: true, 
        instanceName: 'TINDERVIK'
    },
};
// config files for microsoft sql database

const sqlPromise = new sql.ConnectionPool(config) //why is it call pool?
    .connect()
    .then(sql => {
        console.log("successfull conection too SQL server")
        return sql // returns our promise
    })
    .catch(err => {
        console.error("Errorcode: D.1")
        process.exit(1) // exits if not connected
    })

    export default sqlPromise