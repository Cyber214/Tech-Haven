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

async function index(req, res) {
  try {
    const devices = await Device.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(devices)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const device = await Device.findById(req.params.deviceId)
      .populate(['author', 'offers.author'])
    res.status(200).json(device)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const deviceToCheck = await Device.findById(req.params.deviceId)
    // this protects devices to make sure the user is the creater
    if (deviceToCheck.author.equals(req.user.profile)) {
      console.log('author is a match')
      const device = await Device.findByIdAndUpdate(
        req.params.deviceId,
        req.body,
        {new: true}
      ).populate('author')
      res.status(200).json(device)
    } else {
      res.status(401).json({error: 'Not Authorized'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
export{
  create,
  index,
  show,
  update,
}