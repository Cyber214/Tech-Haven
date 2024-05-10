import { Router } from "express"
import * as deviceCtrl from '../controllers/devices.js'
import { decodeUserFromToken, checkAuth } from "../middleware/auth"

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken) 

router.post('/', checkAuth, deviceCtrl.create)

export {
  router
}