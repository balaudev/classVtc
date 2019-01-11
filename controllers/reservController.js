const db = require("../models");

const querystring = require("querystring");

// exports.reservationPost = async (req, res, next) => {
//   try {
//     const reserv = new db.reservModel(req.body);
//     await reserv.save();
//     req.flash(
//       "success",
//       "Votre reservation a bien été enregistré nous vous recontactons"
//     );
//     res.redirect("/user");
//   } catch (error) {
//     next(error);
//   }
// };

exports.adminPageGet = (req, res) => {
  res.render("admin", { title: "ADMIN" });
};

exports.adminPageOrders = async (req, res, next) => {
  // res.render("admin", { title: "ADMIN" });
  try {
    const allOrders = await db.reservModel.find({}).sort({
      createdOn: "desc"
    });
    res.render("orders", { title: "ADMIN", allOrders });
    // res.json(allOrders);
  } catch (error) {
    next(error);
  }
};

exports.reservationGet = (req, res) => {
  res.render("user", { title: "Réservez une course", user: req.user });
};

exports.userPageOrders = async (req, res, next) => {
  try {
    const orders = await db.reservModel.find({ user_id: req.user._id });
    res.render("user_account", {
      title: "Résumé des courses précédentes",
      orders
    });
  } catch (error) {
    next(error);
  }
};

// exports.reservationPost = (req, res, next) => {
//   const data = req.body;
//   res.render("confirmation", {
//     title: "confirm your booking",

//     data
//   });
// };

exports.bookingConfirmation = (req, res) => {
  const data = req.body;
  res.render("confirmation", {
    title: "confirmer votre réservation",

    data
  });
};

exports.orderPlaced = async (req, res, next) => {
  try {
    const data = req.params.data;
    const parsedData = querystring.parse(data);
    // res.json(parsedData);
    const order = new db.reservModel({
      user_id: req.user._id,
      name: parsedData.name,
      num_tel: parsedData.num_tel,
      nombre_personne: parsedData.nombre_personne,
      addresse_depart: parsedData.addresse_depart,
      addresse_fin: parsedData.addresse_fin,
      date_depart: parsedData.date_depart,
      heure_depart: parsedData.heure_depart
    });

    await order.save();
    req.flash("info", "Votre réservation a bien été enregistrée!");
    res.redirect("/user");
  } catch (error) {
    next(error);
  }
};

exports.editRemoveGet = (req, res) => {
  res.render("edit-remove", {
    title: "Trouvez une Course"
  });
};

exports.editRemovePost = async (req, res, next) => {
  try {
    const name = req.body.name || null;
    const phoneNumber = req.body.num_tel || null;

    const courseData = await db.reservModel
      .find({
        $or: [{ name: name }, { num_tel: phoneNumber }]
      })
      .collation({
        locale: "en",
        strength: 2
      });

    if (courseData.length > 0) {
      // res.json(data);
      res.render("course-detail", {
        title: "Détails de la Reservation",
        courseData
      });
      return;
    } else {
      req.flash("info", "Aucune course ne correspond ....");
      res.redirect("/admin/edit-remove");
    }
  } catch (error) {
    next(error);
  }
};

exports.updateCourseGet = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const courseData = await db.reservModel.findOne({
      _id: req.params.courseId
    });
    res.render("updateForm", {
      title: "Mettre à jour ",
      courseData
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCoursePost = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const course = await db.reservModel.findByIdAndUpdate(courseId, req.body, {
      new: true
    });
    req.flash("success", `La course N°:${course._id} a bien été  mise à jour`);
    res.redirect("/admin/orders");
  } catch (error) {
    next(error);
  }
};

exports.deleteCourseGet = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const courseData = await db.reservModel.findOne({ _id: courseId });
    res.render("updateForm", { title: "Effacer une course", courseData });
  } catch (error) {
    next(error);
  }
};

exports.deleteCoursePost = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await db.reservModel.findByIdAndRemove({ _id: courseId });
    req.flash("info", `La course N°: ${courseId} a bien été supprimer`);
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
};
