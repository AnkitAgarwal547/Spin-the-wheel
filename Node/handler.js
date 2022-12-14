"use strict"
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const moment = require("moment-timezone")
const { v4: uuidv4 } = require("uuid")
const aws = require("aws-sdk")
aws.config.update({ region: process.env.AWS_REG })

const utility = require("./common/utility.js")
const mongoDBUtils = require("./common/mongodb.js")
const RESPONSE_MESSAGES = require("./common/constant.message.js").RESPONSE_MESSAGES
const { DB_CONSTANTS } = require("./common/constant.DB.js")
const { imageUploadSchema } = require("./validator/imageupload.js")
const { loginSchema } = require("./validator/login.js")
const { questionSchema } = require("./validator/questions.js")
const { changePasswordSchema } = require("./validator/change_password.js")
const { forgotPasswordSchema } = require("./validator/forgot_password.js")

const ObjectId = mongoDBUtils.mongoDBObject.ObjectId

exports.login = async event => {
  try {
    console.log("Inside Admin login: POST")
    await mongoDBUtils.mongoClientConnect()

    let eventBody = JSON.parse(event.body)
    const { error } = loginSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(1, error)
    }
    eventBody.password = crypto.createHash("md5").update(eventBody.password.trim()).digest("hex")
    const user = await mongoDBUtils.findOne("admin_users", { email: eventBody.email.trim(), password: eventBody.password, status: "ACTIVE" })
    console.log("user", user)
    if (user) {
      console.log("verfied", user)

      /** updating last_login  */
      await mongoDBUtils.updateOne(
        "admin_users",
        { _id: new ObjectId(user._id) },
        {
          $set: {
            last_login: utility.getUTCDateTime()
          }
        }
      )
      /** updating last_login  */

      const roleIds = user.roles.map(r => new ObjectId(r._id))
      const permissions = await mongoDBUtils.find("roles", { _id: { $in: roleIds } }, { projection: { _id: 0, permissions: 1 } })
      const uniquePermissions = []

      permissions.forEach(p => {
        console.log("p", p.permissions)
        p.permissions.forEach(per => uniquePermissions.push(per))
      })
      console.log("list", uniquePermissions)
      user.permissions = uniquePermissions
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })
      Object.assign(user, { token: token })
      return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, user)
    } else {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.EMAIL_OR_PASSWORD_NOT_EXISTS, 200)
    }
  } catch (error) {
    console.error("Inside Admin login: POST", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.getS3SignedURL = async event => {
  try {
    console.log("Inside getS3SignedURL: POST")
    let eventBody = utility.lamdaEventSource(event)
    const { error } = imageUploadSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(0, error, 400)
    }
    let token = event.headers["Authorization"] || event.headers["authorization"]
    if (token) token = token.trim()

    token = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded token", token)
    const s3 = new aws.S3({ apiVersion: "2006-03-01" })
    const randomImgName = uuidv4()
    const useCase = eventBody.usecase.trim()
    const file_ext = eventBody.file_ext.trim().toLowerCase()
    const contentType = utility.getContentType(file_ext)
    const folder = RESPONSE_MESSAGES["S3_FOLDERS"][useCase] || "default"
    const s3Params = {
      Bucket: process.env.BUCKET_FOR_IMAGES,
      Key: `${folder}/${randomImgName}.${file_ext}`,
      ContentType: contentType,
      Expires: 60 * 10
    }
    console.log("params", s3Params)
    let uploadURL = await s3.getSignedUrl("putObject", s3Params)
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, { aws_signed_url: uploadURL })
  } catch (error) {
    console.log("ERROR: Inside getS3SignedURL: POST: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  }
}

//question,type,options,answer
exports.addQuestions = async event => {
  try {
    console.log("Inside addQuestions: POST")
    await mongoDBUtils.mongoClientConnect()

    let token = ""
    const eventBody = utility.lamdaEventSource(event)
    const { error } = questionSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(0, error, 400)
    }
    token = event.headers["Authorization"] || event.headers["authorization"]
    if (token) token = token.trim()

    token = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded token", token)
    eventBody.question = eventBody.question.trim()
    const doc = {
      question: eventBody.question,
      type: eventBody.type,
      options: eventBody.options,
      answer: eventBody.answer,
      status: "ACTIVE",
      created_at: utility.getUTCDateTime(),
      modified_at: utility.getUTCDateTime(),
      created_by: new ObjectId(token._id),
      modified_by: null
    }
    const { result } = await mongoDBUtils.insertOne("questions", doc)
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, { id: result.insertedId })
  } catch (error) {
    console.log("ERROR: Inside addQuestions: POST: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.editQuestions = async event => {
  try {
    console.log("Inside editQuestions: PUT")
    await mongoDBUtils.mongoClientConnect()

    let token = ""
    const eventBody = utility.lamdaEventSource(event)
    token = event.headers["Authorization"] || event.headers["authorization"]
    if (token) token = token.trim()

    token = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded token", token)
    const question_id = event.pathParameters.ques_id || ""
    if (question_id === "") {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.QUESTION_ID_REQUIRED, 400)
    }

    eventBody.question = eventBody.question.trim()
    const doc = {
      question: eventBody.question,
      type: eventBody.type,
      options: eventBody.options,
      answer: eventBody.answer,
      status: eventBody.status,
      modified_at: utility.getUTCDateTime(),
      modified_by: new ObjectId(token._id)
    }
    await mongoDBUtils.updateOne("questions", { _id: new ObjectId(question_id.trim()) }, { $set: doc })
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200)
  } catch (error) {
    console.log("ERROR: Inside editQuestions: PUT: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.deleteQuestions = async event => {
  try {
    console.log("Inside deleteQuestions: DELETE")
    await mongoDBUtils.mongoClientConnect()

    let token = ""
    token = event.headers["Authorization"] || event.headers["authorization"]
    if (token) token = token.trim()

    token = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded token", token)
    const question_id = event.pathParameters.ques_id || ""
    if (question_id === "") {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.QUESTION_ID_REQUIRED, 400)
    }

    await mongoDBUtils.deleteOne("questions", { _id: new ObjectId(question_id.trim()) })
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200)
  } catch (error) {
    console.log("ERROR: Inside deleteQuestions: DELETE: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.getQuestions = async event => {
  try {
    console.log("Inside getQuestions: GET")
    await mongoDBUtils.mongoClientConnect()

    let token = ""
    const eventBody = utility.lamdaEventSource(event)
    token = event.headers["Authorization"] || event.headers["authorization"]
    if (token) token = token.trim()

    token = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded token", token)

    const result = await mongoDBUtils.find("questions", {}, { sort: { _id: -1 } })
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, result)
  } catch (error) {
    console.log("ERROR: Inside getQuestions: GET: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.changePassword = async event => {
  try {
    console.log("Inside changePassword: POST")
    await mongoDBUtils.mongoClientConnect()

    let token = ""
    const eventBody = utility.lamdaEventSource(event)
    const { error } = changePasswordSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(0, error, 400)
    }
    token = event.headers["Authorization"] || event.headers["authorization"]
    if (token) token = token.trim()

    token = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded token", token)

    const old_password = crypto.createHash("md5").update(eventBody.old_password.trim()).digest("hex")
    const new_password = crypto.createHash("md5").update(eventBody.new_password.trim()).digest("hex")

    const user = await mongoDBUtils.findOne("admin_users", { _id: new ObjectId(token._id) })
    if (user !== null) {
      if (user["password"] === old_password) {
        await mongoDBUtils.updateOne("admin_users", { _id: new ObjectId(token._id) }, { $set: { password: new_password } })
        return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.PASSWORD_UPDATED, 200)
      } else {
        return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.OLD_PASSWORD_NOT_MATCHED, 200)
      }
    } else {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.USER_NOT_FOUND, 200)
    }
  } catch (error) {
    console.log("ERROR: Inside changePassword: POST: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}

exports.forgotPassword = async event => {
  try {
    console.log("Inside forgotPassword: POST")
    await mongoDBUtils.mongoClientConnect()

    const eventBody = utility.lamdaEventSource(event)
    const { error } = forgotPasswordSchema.validate(eventBody, { abortEarly: false })
    if (error) {
      return utility.apiResponseWithValidationErrors(0, error, 400)
    }

    const email = eventBody.email.trim()
    const new_password = crypto.createHash("md5").update(eventBody.new_password.trim()).digest("hex")

    const user = await mongoDBUtils.findOne("admin_users", { email: email })
    if (user !== null) {
      await mongoDBUtils.updateOne("admin_users", { _id: new ObjectId(user._id) }, { $set: { password: new_password } })
      return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.PASSWORD_UPDATED, 200)
    } else {
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.USER_NOT_FOUND, 404)
    }
  } catch (error) {
    console.log("ERROR: Inside forgotPassword: POST: ", error.stack)
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500)
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection()
  }
}
