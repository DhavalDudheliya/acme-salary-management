import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as customerController from "./customer.controller.js";

const router: IRouter = Router();

router.use(authMiddleware);

router.post("/", customerController.create);
router.get("/", customerController.list);
router.get("/:id", customerController.get);
router.patch("/:id", customerController.update);

export default router;
