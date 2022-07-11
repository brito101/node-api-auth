import { Router } from "express"
// import { Auth } from "../middleware/auth"
import { privateRoute } from "../config/passport"

import * as ApiController from "../controllers/apiController"

const router = Router()

router.post("/register", ApiController.register)
router.post("/login", ApiController.login)
// router.post("/login", privateRoute, ApiController.login)

// router.get("/list", Auth.private, ApiController.list)
router.get("/list", privateRoute, ApiController.list)

export default router
