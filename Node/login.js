"use strict"
const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")
const moment = require("moment-timezone")
const { v4: uuidv4 } = require("uuid")
const aws = require("aws-sdk")
aws.config.update({ region: process.env.AWS_REG })

const utility = require("./common/utility.js")
const mongoDBUtils = require("./common/mongodb.js")
const RESPONSE_MESSAGES = require("./common/constant.message.js").RESPONSE_MESSAGES
const { DB_CONSTANTS } = require("./common/constant.DB.js")
const { loginSchema } = require("./validator/login.js")
const { verifyOTPSchema } = require("./validator/verify_otp.js")

const ObjectId = mongoDBUtils.mongoDBObject.ObjectId

exports.login = async event => {
  try {
    console.log("Inside login: POST")
    await mongoDBUtils.mongoClientConnect()

    let eventBody = JSON.parse(event.body)
    const { error } = loginSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(1, error)
    }
    const country_code = eventBody.country_code.trim()
    const mobile_no = eventBody.mobile_no.trim()
    const first_name = eventBody.first_name.trim()
    const last_name = eventBody.last_name.trim()
    const campaign_id = eventBody.campaign_id.trim()

    let user = await mongoDBUtils.findOne("users", { country_code, mobile_no })
    let campaign = await mongoDBUtils.findOne("campaigns", { _id: new ObjectId(campaign_id) })
    console.log("campaign", campaign)
    let doc = {}
    if (user) {
      doc = {
        last_login: utility.getUTCDateTime(),
        modified_at: utility.getUTCDateTime()
      }
      await mongoDBUtils.updateOne("users", { _id: user._id }, { $set: doc })
    } else {
      doc = {
        first_name: first_name,
        last_name: last_name,
        country_code,
        mobile_no,
        tz: null,
        play_count: [],
        status: "ACTIVE",
        last_login: utility.getUTCDateTime(),
        created_at: utility.getUTCDateTime(),
        modified_at: utility.getUTCDateTime()
      }
      await mongoDBUtils.insertOne("users", doc)
    }

    let otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
    const temp_id = campaign.otp_template_id || "1207166244565930350"
    const otp_sms_content =
      campaign.otp_sms_content ||
      `Dear User,
    Your one time verification OTP : {var1}`

    const sendOTPRes = await utility.sendOTP(mobile_no, otp, campaign, temp_id, otp_sms_content)
    if (sendOTPRes["status"] !== "success") {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.ERRON_SENDING_SMS, 500)
    }
    const expiration_time = moment.utc().add(process.env.JWT_OTP_EXPIRATION_TIME, "seconds").format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    let otp_obj = {
      otp: otp,
      expiration_time: new Date(expiration_time),
      verified: false,
      user_identifier: country_code + mobile_no,
      event_type: "login",
      after_verified_actions: null,
      created_at: utility.getUTCDateTime(),
      modified_at: utility.getUTCDateTime()
    }
    const { result } = await mongoDBUtils.insertOne("otps", otp_obj)
    let data = {
      otp_id: result.insertedId,
      expires_in: expiration_time
    }
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, data)
  } catch (error) {
    console.error("Inside Login: POST", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.verifyOTP = async event => {
  try {
    console.log("Inside verifyOTP: POST")
    await mongoDBUtils.mongoClientConnect()

    let eventBody = JSON.parse(event.body)
    const { error } = verifyOTPSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(1, error)
    }
    const otp_id = eventBody.otp_id.trim()
    const otp = Number(eventBody.otp.trim())
    const country_code = eventBody.country_code.trim()
    const mobile_no = eventBody.mobile_no.trim()

    const validOTP = await utility.verifyOTP(otp_id, otp, country_code, mobile_no)
    if (validOTP) {
      let user = await mongoDBUtils.findOne("users", { country_code, mobile_no })
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.USER_JWT_EXPIRATION_TIME })
      Object.assign(user, { token: token })
      return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, user)
    } else {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.OTP_NOT_VALID, 200)
    }
  } catch (error) {
    console.error("Inside verifyOTP: POST", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}
