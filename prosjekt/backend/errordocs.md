# Error handling

## D
### D.1
this error is when you cant connect too your database because either the database does not exist and or the env variables is wrong. 

if the db dont exist? 
download the db files from the sql databases. latest version will be supported so if you see more versions always take the latest

if your env variables is wrong:
please delete your .env file and supply the correct information. rmember case sensitivity. after deletion just restart the start script
## M
### M.1
this error happens when mounting wasnt correct. this stems from the routes not having an export

common error here would be lacking these lines

```js
import express from 'express'

const router = express.Router()

// rest of code

export default router
```
as then you don't send out the right routes and it wont be able too mount