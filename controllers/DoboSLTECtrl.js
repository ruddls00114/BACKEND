'use strict';

const {DOBO_STATUS} = require('../Constant');
const userModel = require('../models/UserModel');
const doboSTLEModel = require('../models/DoboSTLEModel');


// 시민해설사 관광 등록
exports.register = async(req, res, next) => {


  try {

    const user = await userModel.getUserByIdx(req.userIdx);
    if (user.role !== 'SEOULITE') {
      return next(9402);
    }

    const tempCourse = [
      {
        category: 1,
        name: 'a'
      },
      {
        category: 2,
        name: 'b'
      },
      {
        category: 3,
        name: 'c'
      },
    ];

    const extraData = {
      bgi: [],
      tour: [],
      course: []
    };
    req.files.bgi ? req.files.bgi.map(file => extraData.bgi.push(file.location)) : extraData.bgi.push(null);
    req.files.tour ? req.files.tour.map((file, idx) => extraData.tour.push([file.location, req.body.tour_name[idx]])) : extraData.tour.push(null, null);
    // req.body.course ? req.body.course(item => extraData.course.push(item.category, item.name)) : extraData.course.push(null, null);
    tempCourse ? tempCourse.map(item => extraData.course.push([item.category, item.name])) : extraData.course.push(null, null);

    const reqData = {
      seoullight_idx: user.sIdx,
      title: req.body.title,
      content: req.body.content,
      lang: req.body.lang,
      min_people: req.body.min_people,
      max_people: req.body.max_people,
      category: req.body.category,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      due_date: req.body.due_date,
      status: DOBO_STATUS.WAITING,
      image: extraData.bgi[0]
    };


    await doboSTLEModel.register(reqData, extraData);


  } catch (error) {
    return next(error);
  }


  return res.r();

};


// 시민해설사 전체 리스트 조회
// TODO 인기순, 마감순 정렬 추가
exports.getList = async(req, res, next) => {
  let result;

  try {

    result = await doboSTLEModel.getList();

  } catch (error) {
    return next(error);
  }


  return res.r(result);
};


// 시민해설사 관광에 리뷰 작성
exports.createReview = async(req, res, next) => {

  try {

    const reqData = {
      user_idx: req.userIdx,
      citizen_dobo_idx: req.params.dobo_idx,
      content: req.body.content
    };

    await doboSTLEModel.createReview(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
};



exports.getDetail = async(req, res, next) => {
  let result = {};

  try {

    const doboIdx = req.params.dobo_idx;

    const temp = await doboSTLEModel.getDetail(doboIdx);

    const review = await doboSTLEModel.getReviewByDoboIdx(doboIdx);

    temp.map((item) => {
      const {idx, title, content, min_people, max_people, category, lang, start_date, end_date, due_date, status} = item;
      result.dobo = {idx, title, content, min_people, max_people, category, lang, start_date, end_date, due_date, status};

      const {seoulite_idx, user_idx, name, avatar, email, intro, birth} = item;
      result.dobo.seoulite = {seoulite_idx, user_idx, name, avatar, email, intro, birth};

      result.dobo.bgi = item.bgi.split(',');
      result.dobo.tourlist = item.tourlist.split(',');
      result.dobo.course = item.course.split(',');

      result.dobo.course.map((data, id) => {
        const name = data.split('|')[0];
        const category = data.split('|')[1];
        result.dobo.course[id] = {name, category};
      });

      result.dobo.tourlist.map((data, id) => {
        const name = data.split('|')[0];
        const image = data.split('|')[1];
        result.dobo.tourlist[id] = {name, image};
      });

      result.review = review;





    });





  } catch (error) {
    return next(error);
  }

  return res.r(result);
};
