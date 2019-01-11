var express = require("express");

var router = express.Router();
var renderController = require("../controllers/renderController");
var reservController = require("../controllers/reservController");

/* GET home page. */
router.get("/", renderController.homePageGet);

/* REGISTER page. */
router.get("/register", renderController.registerGet);
router.post(
  "/register",
  renderController.registerPost,
  renderController.loginGet
);

/* LOGIN page. */
router.get("/login", renderController.loginGet);
router.post("/login", renderController.loginPost);
router.get("/auth/twitter", renderController.loginGetTwitter);
router.get("/auth/twitter/callback", renderController.logTwitterCallback);

router.get("/auth/google", renderController.loginGetGoogle);
router.get("/auth/google/callback", renderController.logGoogleCallback);

router.get("/logout", renderController.logout);

/* GET USER page. */
router.get("/user", reservController.reservationGet);
router.get("/user/orders", reservController.userPageOrders);
// router.post("/user", reservController.bookingConfirmation);

router.post("/confirmation", reservController.bookingConfirmation);
router.get("/order-placed/:data", reservController.orderPlaced);

router.get("/current", (req, res) => {
  res.send(req.user);
  console.log("current user :", req.user);
});

/* GET ADMIN page. */
router.get("/admin", renderController.isAdmin, reservController.adminPageGet);

router.get("/admin/*", renderController.isAdmin);

router.get("/admin/orders", reservController.adminPageOrders);

router.get("/admin/edit-remove", reservController.editRemoveGet);
router.post("/admin/edit-remove", reservController.editRemovePost);

router.get("/admin/:courseId/update", reservController.updateCourseGet);
router.post("/admin/:courseId/update", reservController.updateCoursePost);

router.get("/admin/:courseId/delete", reservController.deleteCourseGet);
router.post("/admin/:courseId/delete", reservController.deleteCoursePost);

module.exports = router;
