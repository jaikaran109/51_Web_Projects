import {neon} from '@neondatabase/serverless'

export const sql = neon(process.env.DBURI)

export const ConnectDB = async ()=>{
    try {
        const result = await sql`SELECT 1`
        console.log("Neon Connected..")
        return true
    } catch (error) {
        console.log(error)
        return false
        
    }
}