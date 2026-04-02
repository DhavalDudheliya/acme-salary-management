import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as ticketController from "./ticket.controller.js";

const router: IRouter = Router();

router.use(authMiddleware);

router.post("/", ticketController.create);
router.get("/", ticketController.list);
router.get("/:id", ticketController.get);
router.patch("/:id", ticketController.update);
router.delete("/:id", ticketController.remove);
router.post("/:id/comments", ticketController.addComment);

export default router;
