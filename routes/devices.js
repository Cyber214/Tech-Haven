import { Router } from "express"
import * as devicesCtrl from '../controllers/devices.js'
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js"

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken) 

router.post('/', checkAuth, devicesCtrl.create)

router.get('/', checkAuth, devicesCtrl.index)

router.get('/:deviceId', checkAuth, devicesCtrl.show)

router.put('/:deviceId', checkAuth, devicesCtrl.update)

router.delete('/:deviceId', checkAuth, devicesCtrl.delete)

// POST /devices/:deviceId/offers
router.post('/:deviceId/offers', checkAuth, devicesCtrl.createOffer)


export {
  router
}