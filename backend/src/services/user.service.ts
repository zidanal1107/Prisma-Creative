import * as UserRepository from "../repositories/user.repository";
import { CreateUser, UpdateUser } from "../interfaces/user.interface";

export async function getAll() {
    return await UserRepository.findAll();
}

export async function getById(id: number) {
    return UserRepository.findById(id);
}

export async function create(data: CreateUser) {
    return await UserRepository.create(data);
}

export async function update(id: number, data: UpdateUser) {
    return await UserRepository.update(id, data);
}

export async function remove(id: number) {
    return await UserRepository.remove(id);
}