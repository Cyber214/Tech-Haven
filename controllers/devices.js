import { Device } from "../models/device.js"
import { Profile } from "../models/profile.js"

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const device = await Device.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      // push into the device array, the new device i created
      { $push: { devices: device } },
      { new: true }
    )
    // setting the device's author to the profile 
    device.author = profile
    // respond with this error to the front end
    res.status(201).json(device)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export{
  create,
}