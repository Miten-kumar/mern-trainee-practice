import pool from "../config/database";
import { user } from "../models/userModel";

export const getUsers = async():Promise<user[]>=>{

    const result = await pool.query(
        "SELECT * FROM users"
    );
    return result.rows;
};