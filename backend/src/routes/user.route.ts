import { Router } from "express";
import * as UserController from "../controllers/user.controller";

const router = Router();

router.get("/all", UserController.getAll);

router.get("/by/:id", UserController.getById);

router.post("/create", UserController.create);

router.put("/update/:id", UserController.update);

router.delete("/delete/:id", UserController.remove);

export default router;