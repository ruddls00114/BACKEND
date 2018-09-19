'use strict';

const imageUtil = require('../ImageUtil');

const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const seoulightCtrl = require('../controllers/SeoulightCtrl');
const doboSTLECtrl = require('../controllers/DoboSLTECtrl');

module.exports = (router) => {

  // USER
  router.route('/users/signup')
    .post(imageUtil.uploadSingle, userCtrl.signup);

  router.route('/users/signin')
    .post(userCtrl.signin);
   
  router.route('/users/pwd') //정보 수정
    .put(authCtrl.auth,userCtrl.editPwd);

  router.route('/users/avatar') //사진 수정
    .put(authCtrl.auth, imageUtil.uploadSingle, userCtrl.editAvatar);

  router.route('/seoulight/register') //시민해설사 신청
    .post(authCtrl.auth, seoulightCtrl.reqSeoulight);

  router.route('/users/feedback') //건의사항 
  .post(authCtrl.auth,userCtrl.addFeedback);

  // DOBO WITH SEOULITE
  router.route('/dobo/seoulite')
    .post(authCtrl.auth, imageUtil.uploadArray, doboSTLECtrl.register);




  return router;
};