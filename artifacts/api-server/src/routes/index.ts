import { Router, type IRouter } from "express";
import healthRouter from "./health";
import joyestRouter from "./joyest";

const router: IRouter = Router();

router.use(healthRouter);
router.use(joyestRouter);

export default router;
