"use strict";
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const { v4: uuidv4 } = require("uuid");
const aws = require("aws-sdk");
aws.config.update({ region: process.env.AWS_REG });

const utility = require("./common/utility.js");
const mongoDBUtils = require("./common/mongodb.js");
const RESPONSE_MESSAGES = require("./common/constant.message.js").RESPONSE_MESSAGES;
const { DB_CONSTANTS } = require("./common/constant.DB.js");
//const { campaignUpdateSchema } = require("./validator/updatecampaign.js");



const ObjectId = mongoDBUtils.mongoDBObject.ObjectId;

exports.getCampaignDetail = async (event) => {
  try {
    console.log("Inside GET getCampaignDetail");
    const campaign_id = event.pathParameters.camp_id || "";
    if(campaign_id.trim() === ''){
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.INVALID_CAMP_ID, 200, campaign);
    }
    /* let token = "";
    token = event.headers["Authorization"] || event.headers["authorization"];
    if (token) token = token.trim();
    token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token", token); */

    await mongoDBUtils.mongoClientConnect();
    const campaign = await mongoDBUtils.findOne("campaigns", { _id: new ObjectId(campaign_id.trim()) });
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, campaign);
  } catch (error) {
    console.error("Inside GET getCampaignDetail", error.stack);
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500);
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection();
  }
};


exports.updateCampaign = async (event) => {
  try {
    console.log("Inside PATCH updateCampaign");
    const campaign_id = event.pathParameters.camp_id || "";
    const eventBody = utility.lamdaEventSource(event);

    if(campaign_id.trim() === ''){
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.INVALID_CAMP_ID, 400);
    }

    const action = eventBody?.action || "";
    if(action.trim() === ''){
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.INVALID_ACTION, 400);
    }


    await mongoDBUtils.mongoClientConnect();
    switch (action) {

      case 'UPDATE_CAMPAIGN_CLICKCOUNT': {
        const user_id = eventBody.user_id || ""; 
        await mongoDBUtils.updateOne('campaigns', { _id: new ObjectId(campaign_id.trim()) }, {$inc : {click_count:1} });
        const u = await mongoDBUtils.findOne('users', {_id: new ObjectId(user_id.trim()) });
        await mongoDBUtils.insertOne('campaign_clicks', { camp_id: new ObjectId(campaign_id.trim()), user_id: new ObjectId(user_id.trim()), first_name: u?.first_name,
         last_name: u?.last_name, country_code: u?.country_code, mobile_no: u?.mobile_no, created_at: utility.getUTCDateTime() });
        return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200);
      }

      case 'UPDATE_CAMPAIGN_WINNINGVALUE': {

        const winninglabel_key = eventBody.winninglabel_key || ""; //Later(if required): need to replace winning_values.key with mongo autoincrement ID
        if(winninglabel_key.trim() === ''){
          return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.INVALID_WINNING_LABELKEY, 400);
        }
        await mongoDBUtils.updateOne('campaigns', { _id: new ObjectId(campaign_id.trim()), "winning_values.key": winninglabel_key }, {$inc : {"winning_values.$.day_count":1} });
        return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200);
      }

      case 'UPDATE_USER_PLAYEDGAME': {
        const user_id = eventBody.user_id || ""; 
        let token = eventBody.access_token || ""; 
        if (token) token = token.trim();
        token = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token", token); 
    
        if(user_id.trim() === ''){
          return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.USERID_REQUIRED, 400);
        }
        let played_count = 0;
        //const user_campaign = await mongoDBUtils.findOne('users', { _id: new ObjectId(user_id.trim()), "play_count.campaign_id" : new ObjectId(campaign_id.trim()) });
        //await mongoDBUtils.updateOne('users', { _id: new ObjectId(user_id.trim()), "play_count.campaign_id": new ObjectId(campaign_id.trim()) }, {$inc : {"play_count.$.campaign_id":1} });
        const user_campaign = await mongoDBUtils.findOne('users', { _id: new ObjectId(user_id.trim())});
        console.log('usercampaign', user_campaign);
        if(user_campaign !== null){
            const i = user_campaign.play_count.findIndex(pc => {
              if(pc.campaign_id.toString() === campaign_id.trim() )
                return true;
              else
                return false;
            });
            if (i > -1) {
              user_campaign.play_count[i] = { campaign_id: new ObjectId(campaign_id.trim()),  
              played_today: Number(user_campaign.play_count[i]['played_today']) + 1};
            }else{
              user_campaign.play_count.push({"campaign_id": new ObjectId(campaign_id.trim()), played_today:1 });
            } 
            await mongoDBUtils.updateOne('users', { _id: new ObjectId(user_id.trim()) }, { $set : {"play_count": user_campaign.play_count  } } );
        }else{
          return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.USER_NOT_FOUND, 400);
        }
        return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200);
      }

      default:{
        return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.ACTIONNAME_NOT_VALID, 400);
      }


      //TODO: 
      //getuserDetail() ->  played count detail or return whole user detail
      //getRandom question based on campaign_id type:difficult,easy,moderate -> whole question / answers
      //submitdetail() -> all steps data including submitted detail with time as campaign_users (some field will be empty or simply save all detail)

    }//end switch


    /* let token = "";
    token = event.headers["Authorization"] || event.headers["authorization"];
    if (token) token = token.trim();
    token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token", token); */

//    const campaign = await mongoDBUtils.findOne("campaigns", { _id: new ObjectId(campaign_id.trim()) });
//    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, campaign);
  } catch (error) {
    console.error("Inside PATCH updateCampaign", error.stack);
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500);
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection();
  }
};


//URL: GET url/campid/questions
exports.getQuestion = async (event) => {
  try {
    console.log("Inside GET getQuestion");
    const campaign_id = event.pathParameters.camp_id || "";
    if(campaign_id.trim() === ''){
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.INVALID_CAMP_ID, 200, campaign);
    }

    let token = "";
    token = event.headers["Authorization"] || event.headers["authorization"];
    if (token) token = token.trim();
    token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token", token);
    await mongoDBUtils.mongoClientConnect();
    const campaign = await mongoDBUtils.findOne('campaigns', {_id: new ObjectId(campaign_id), status:'ACTIVE'});
    let viewed_questions = await mongoDBUtils.find('user_viewedquestions', {user_id: new ObjectId(token._id) }, { projection: {_id:0,ques_id:1} });
    console.log('user viewed questions 1', viewed_questions);
    if(viewed_questions){
      viewed_questions  = viewed_questions.map(vq => vq.ques_id);
    }
    console.log('user viewedquestions 2', viewed_questions);
    let question;
    let noQuestionLeft = false;
    if(campaign){
      if(viewed_questions.length > 0){
        console.log('inside viewed question');
        question = await mongoDBUtils.aggregateCollection('questions', [
          { $match:  { _id: { $nin: viewed_questions }, status: 'ACTIVE', type: campaign['difficulty'] } },
          { $sample: { size: 1 } }
        ]);
        if(question.length  === 0){
          noQuestionLeft = true;
          console.log('no question left');
          question = await mongoDBUtils.aggregateCollection('questions', [
            { $match:  {  status: 'ACTIVE', type: campaign['difficulty'] } },
            { $sample: { size: 1 } }
          ]);
        }
      }else{
        question = await mongoDBUtils.aggregateCollection('questions', [
          { $match:  {  status: 'ACTIVE', type: campaign['difficulty'] } },
          { $sample: { size: 1 } }
        ]);
      }
      console.log('question', question);
      if(question.length > 0 && !noQuestionLeft){
        await mongoDBUtils.insertOne('user_viewedquestions', { "user_id": new ObjectId(token._id), "ques_id":  question[0]._id });
      }
      return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, question);
    }else{
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.CAMP_NOT_FOUND, 404);
    }
  } catch (error) {
    console.error("Inside GET getQuestion", error.stack);
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500);
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection();
  }
};

//URL: GET url/campid/submitdetail
exports.submitDetail = async (event) => {
  try {
    console.log("Inside POST submitDetail");
    const campaign_id = event.pathParameters.camp_id || "";
    if(campaign_id.trim() === ''){
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.INVALID_CAMP_ID, 200, campaign);
    }

    let token = "";
    token = event.headers["Authorization"] || event.headers["authorization"];
    if (token) token = token.trim();
    token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token", token); //will throw on error
    
    let eventBody = JSON.parse(event.body);

    await mongoDBUtils.mongoClientConnect();
    const campaign = await mongoDBUtils.findOne('campaigns', {_id: new ObjectId(campaign_id), status:'ACTIVE'});
    if(campaign === null){
      return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.CAMP_NOT_FOUND, 404);
    }
    const is_correct_answer = Number(eventBody.is_correct_answer);
    const doc = {
      "camp_id": new ObjectId(campaign_id.trim()),
      "user_id": new ObjectId(token._id),
      "gift_unlock_key": eventBody.gift_unlock_key,
      "gift_unlock_text": eventBody.gift_unlock_text,
      "game_played": 1,
      "game_played_at": utility.getUTCDateTime(),
      "ques_id": new ObjectId(eventBody.ques_id),
      "answer_text": eventBody.answer_text,
      "answer_selected": eventBody.answer_selected,        //1 or 2 ( answer options )
      "answer_timetaken": eventBody.answer_timetaken,      //in miliseconds
      "is_correct_answer": is_correct_answer,    //0 or 1
      "submitted_detail_name": eventBody.name || "",
      "submitted_detail_email": eventBody.email || "",
      "submitted_detail_mobileno": eventBody.mobileno || "",
      "submitted_detail_comments": eventBody.comments || "",
      "created_at": utility.getUTCDateTime(),
      "modified_at": utility.getUTCDateTime()
    }
    await mongoDBUtils.insertOne('campaign_users', doc);
    await mongoDBUtils.updateOne('campaigns', { _id: new ObjectId(campaign_id.trim()) }, {$inc : {submitteddetail_count:1, attempt_count: 1} });
    //if correct answer: increase winner count
    if(is_correct_answer === 1){
      await mongoDBUtils.updateOne('campaigns', { _id: new ObjectId(campaign_id.trim()) }, {$inc : {winner_count:1} });
      //await utility.sendRedeemCode(token.mobile_no); //if needed to send from submitted mobileno -> ask FE to pass without country_code or send country_code in seperate field.

      const found = campaign.winning_values.find(wv => {
        if(wv.key === eventBody?.gift_unlock_key.trim()){
          return true;
        }else{
          return false;
        }
      });
      console.log('found sms content', found);
      console.log('campaign sender', campaign);

      if(found !== undefined){
        await utility.sendRedeemCodeV2(token.mobile_no, found.template_id, found.sms_content, found.coupon_code, campaign?.coupon_code_sender_id); //if needed to send from submitted mobileno -> ask FE to pass without country_code or send country_code in seperate field.
      }
    }else{
      //uncorrect answer: use hardcode sms content or get from admin panel
    }
    return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200);
  } catch (error) {
    console.error("Inside POST submitDetail", error.stack);
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500);
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection();
  }
};

exports.getUser = async (event) => {
  try {
    console.log("Inside GET getUser");
    let token = "";
    token = event.headers["Authorization"] || event.headers["authorization"];
    if (token) token = token.trim();
    token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token", token);
    await mongoDBUtils.mongoClientConnect();
    const user = await mongoDBUtils.findOne('users', {_id: new ObjectId(token._id) });
     return utility.apiResponse(1, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, RESPONSE_MESSAGES.SUCCESS, 200, user);
  } catch (error) {
    console.error("Inside GET getUser", error.stack);
    return utility.apiResponse(0, DB_CONSTANTS.MESSAGE.BACK_COLOR, DB_CONSTANTS.MESSAGE.FORE_COLOR, DB_CONSTANTS.MESSAGE.MESSAGE_TIME, error.message, 500);
  } finally {
    await mongoDBUtils.viaHandlerCloseConnection();
  }
};
