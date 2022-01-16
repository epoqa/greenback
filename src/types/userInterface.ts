import { Request } from "express"
export interface userInterface extends Request {
    user: {
        _id: string,
        username: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date
        
    }
    token: string | undefined | object
    header: any
}