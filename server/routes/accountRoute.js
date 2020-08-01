const express = require("express");
const router = express.Router();
const {
  register,
  login,
  createProtest,
  getAllProtests,
  deleteProtest,
  reports
} = require("../controllers/accountController");

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/reports').post(reports);
router.route('/protest').post(createProtest);
router.route('/protests').get(getAllProtests);
router.route('/protest/:protestId').delete(deleteProtest);

module.exports = router;