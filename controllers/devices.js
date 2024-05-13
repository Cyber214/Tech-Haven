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
    // protect devices by making sure the user is the owner
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

async function deleteDevice(req, res) {
  try {
    const device = await Device.findById(req.params.deviceId)
    if (device.author.equals(req.user.profile)) {
      await Device.findByIdAndDelete(req.params.deviceId)
      const profile = await Profile.findById(req.user.profile)
      profile.devices.remove({ _id: req.params.deviceId })
      await profile.save()
      res.status(200).json(device)
    } else {
      res.status(500).json({error: 'Not Authorized'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function createOffer(req, res) {
  try {
    // set the author as the profile user
    req.body.author = req.user.profile
    //find the device by Id
    const device = await Device.findById(req.params.deviceId)
    //push new offer
    device.offers.push(req.body)
    await device.save()
    // Find the newly created offers
    // send back that new offer without updating whole page
    const newOffer= device.offers[device.offers.length - 1]
    // find & append profile object to newOffer.author
    const profile = await Profile.findById(req.user.profile)
    newOffer.author = profile
    // Respond with the newOffer
    res.status(201).json(newOffer)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateOffer= async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId)
    const offer = device.offers.id(req.body._id)
    offer.comment = req.body.comment
    await device.save()
    res.status(200).json(device)
  } catch (err) {
    res.status(500).json(err)
  }
}

export{
  createOffer,
  updateOffer,

  //Device controller functions
  create,
  index,
  show,
  update,
  deleteDevice as delete,
}