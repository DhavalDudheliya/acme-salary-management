import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as searchController from "./search.controller.js";

const router: IRouter = Router();

router.use(authMiddleware);
router.get("/", searchController.search);

export default router;
