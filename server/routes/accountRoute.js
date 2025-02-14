const express = require("express");
const router = express.Router();
const {
  register,
  login,
  createProtest,
  getAllProtests,
  deleteProtest,
  saveComments,
  displayComments,
  editComment,
  deleteComments,
  displayLikes,
  adjustLikes,
  displayAccount,
  sendId,
} = require("../controllers/accountController");

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/reports').post(saveComments);
router.route('/reports').put(displayComments);
router.route('/editcomment').put(editComment);
router.route('/reports').delete(deleteComments);
router.route('/likes').put(displayLikes);
router.route('/likes').post(adjustLikes);
router.route('/protest').post(createProtest);
router.route('/protests').get(getAllProtests);
router.route('/protest/:protestId').delete(deleteProtest);
router.route('/account').put(displayAccount);
router.route('/sendid').post(sendId);

module.exports = router;