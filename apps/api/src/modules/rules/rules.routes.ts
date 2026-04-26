/**
 * Assignment Rules — Routes
 *
 * Admin-only routes for managing ticket assignment rules.
 * Protected by auth + admin middleware.
 */

import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import * as rulesController from "./rules.controller.js";

const router: IRouter = Router();

router.use(authMiddleware);
router.use(adminOnly);

router.get("/", rulesController.list);
router.post("/", rulesController.create);
router.patch("/reorder", rulesController.reorder);
router.get("/:id", rulesController.get);
router.put("/:id", rulesController.update);
router.patch("/:id/toggle", rulesController.toggle);
router.delete("/:id", rulesController.remove);

export default router;
