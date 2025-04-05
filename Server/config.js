import dotenv from "dotenv";
const configObj = {}
const username = 'koyal_user_admin'
const password = 'admin_koyal_pass'
const dbName = 'koyalDb'
configObj.conn =`mongodb://${username}:${password}@147.93.43.33:27017/${dbName}?authSource=admin`
export const config = configObj
export const audioFileTypes = ['audio/mpeg', 'audio/wav'];