const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");
const mongooseBcrypt = require("mongoose-bcrypt");

const vtcUser = new mongoose.Schema({
  local: {
    first_name: {
      type: String,

      trim: true,
      max: 30
    },
    surname: {
      type: String,

      trim: true,
      max: 30
    },
    email: {
      type: String,
      trim: true,
      unique: true,

      lowercase: true
    },
    password: {
      type: String,

      bcrypt: true
    }
  },
  social: {
    fb: {
      profileId: String,
      fullName: String,
      profilePic: String
    },
    google: {
      profileId: String,
      fullName: String,
      profilePic: String
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const reservation = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: "name is required",
    max: 20,
    trim: true
  },
  num_tel: {
    type: String,
    required: "phone number is required",
    max: 10
  },
  nombre_personne: {
    type: Number,
    required: "le nombre de voyageurs required",
    max: 3
  },
  addresse_depart: {
    type: String,
    required: "addresse is required",
    max: 20,
    trim: true
  },
  addresse_fin: {
    type: String,
    required: "addresse is required",
    max: 20,
    trim: true
  },
  date_depart: {
    type: String,
    required: "Day is required"
  },
  heure_depart: {
    type: String,
    required: "Day is required"
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

vtcUser.plugin(mongooseBcrypt);
vtcUser.plugin(passportLocalMongoose, { usernameField: "email" });

// Export models

let reservModel = mongoose.model("reservation", reservation);

let userModel = mongoose.model("vtcUser", vtcUser);

module.exports = {
  mongoose,
  userModel,

  reservModel
};
