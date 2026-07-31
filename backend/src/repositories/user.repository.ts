import { ResultSetHeader } from "mysql2";
import { db } from "../config/db";
import * as inter from "../interfaces/user.interface";

export async function findAll() {
    const [result] = await db.execute(
        "SELECT * FROM data1"
    );
    const row = result as inter.UsersAll[];
    return row;
}

export async function findById(id: number) {
    const [result] = await db.execute(
        "SELECT * FROM data1 WHERE id = ?", [id]
    );
    const row = result as inter.User[];
    return row.length > 0 ? row[0] : null;
}

export async function create(data: inter.CreateUser) {
    const { nama_data } = data;
    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO data1 (nama_data) VALUES (?)", [nama_data]
    );
    return result;
}

export async function update(id: number, data: inter.UpdateUser) {
    const { nama_data } = data;
    const [result] = await db.execute<ResultSetHeader>(
        "UPDATE data1 SET nama_data = ? WHERE id = ?", [nama_data, id]
    );
    return result;
}

export async function remove(id: number) {
    const [result] = await db.execute<ResultSetHeader>(
        "DELETE FROM data1 WHERE id = ?", [id]
    );
    return result;
}