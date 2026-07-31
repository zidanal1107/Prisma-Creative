import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export async function getAll(req: Request, res: Response) {
    try {
        const users = await UserService.getAll();
        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        const user = await UserService.getById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function create(req: Request, res: Response) {
    try {
        const user = await UserService.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Create user successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const nama_data = req.body;
        const user = await UserService.update(id, nama_data);
        if (user.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Update user successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }
        const user = await UserService.remove(id);
        if (user.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User delete successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}