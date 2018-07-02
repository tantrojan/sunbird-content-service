/**
 * file: course-route.js
 * author: Anuj Gupta
 * desc: route file for course
 */

//Multer for multiform data
var multer  = require('multer');

// Multer Configuration 
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'service/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname );
  }
});

var upload = multer({ storage: storage });

// var courseService = require('../service/courseService')
// var requestMiddleware = require('../middlewares/request.middleware')

var BASE_URL = '/v1/course'
// tantrojan
var iitbx = require('../service/iitbx')
//

module.exports = function (app) {
  // app.route(BASE_URL + '/search')
  //   .post(requestMiddleware.createAndValidateRequestBody, requestMiddleware.addChannelFilters,
  //     courseService.searchCourseAPI)

  // app.route(BASE_URL + '/create')
  //   .post(requestMiddleware.createAndValidateRequestBody, courseService.createCourseAPI)

  // app.route(BASE_URL + '/update/:courseId')
  //   .patch(requestMiddleware.createAndValidateRequestBody, courseService.updateCourseAPI)

  // app.route(BASE_URL + '/review/:courseId')
  //   .post(requestMiddleware.createAndValidateRequestBody, courseService.reviewCourseAPI)

  // app.route(BASE_URL + '/publish/:courseId')
  //   .get(requestMiddleware.createAndValidateRequestBody, courseService.publishCourseAPI)

  // app.route(BASE_URL + '/read/:courseId')
  //   .get(requestMiddleware.createAndValidateRequestBody, courseService.getCourseAPI)

  // app.route(BASE_URL + '/read/mycourse/:createdBy')
  //   .get(requestMiddleware.createAndValidateRequestBody, courseService.getMyCourseAPI)

  // app.route(BASE_URL + '/hierarchy/:courseId')
  //   .get(requestMiddleware.createAndValidateRequestBody, courseService.getCourseHierarchyAPI)

  // app.route(BASE_URL + '/hierarchy/update')
  //   .patch(requestMiddleware.createAndValidateRequestBody, requestMiddleware.validateToken,
  //     requestMiddleware.hierarchyUpdateApiAccess, courseService.updateCourseHierarchyAPI)

  // tantrojan
  app.route(BASE_URL + '/iitbx/view').get(iitbx.getCoursesAPI)
  app.route(BASE_URL + '/iitbx/:course_name/view').get(iitbx.getObjectsAPI)
  app.route(BASE_URL + '/iitbx/:course_name/delete').get(iitbx.deleteCourseAPI)
  app.route(BASE_URL + '/iitbx/:course_name/:obj_name/view').get(iitbx.getParticularObjectAPI)
  app.route(BASE_URL + '/iitbx/:course_name/:obj_name/delete').get(iitbx.deleteParticularObjectAPI)
  app.use(upload.any())
  app.route(BASE_URL + '/iitbx/createcourse').post(iitbx.createCourseAPI)

  //

}
