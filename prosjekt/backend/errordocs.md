# Error handling

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