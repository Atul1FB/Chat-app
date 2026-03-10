// import jwt from "jsonwebtoken"

// // function to generate a token for a user

// export const generateToken = (userId)=>{
//     const token = jwt.sign({userId},process.env.JWT_SECRET);
//     return token  
// }

class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        statck="",
    ){
        super(message)
        this.statusCode=  statusCode
        this.data = null
        this.message = message
        this.success= false
        this.errors= errors
    }

}
export{ApiError}