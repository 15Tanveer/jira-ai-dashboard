import { Router } from "express";
import { chatController, chatStreamController } from "../controllers/chatController";

export const chatRouter = Router();
chatRouter.post("/", chatController);
chatRouter.post("/stream", chatStreamController);
