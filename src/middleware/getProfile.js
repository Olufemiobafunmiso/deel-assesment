require("dotenv").config();
const joi = require("joi");
const {UnauthorizedError, ForbiddenError} = require("../utils/error");
const { validator } = require("../utils/validator");

const schema = joi.object({
  profile_id: joi
    .number()
    .integer()
    .messages({ "any.required": "profile_id is required on the Header" })
    .required(),
});


const getProfile = async (req, res, next) => {
  try {
    const { Profile } = req.app.get("models");
    const profile_id = req.get("profile_id");

    // validate profiled_id is type Integer
    validator(schema, { profile_id });

    const profile = await Profile.findOne({ where: { id: profile_id || 0 } });
    if (!profile) throw new UnauthorizedError("Unauthorized");
    req.profile = profile;
    next();
  } catch (error) {
    next(error);
  }
};

const clientAuth = async (req, res, next) => {
  try {
    const { type } = req.profile;
    if (type !== "client") {
      throw new ForbiddenError("Access Denied!. Only clients are allowed");
    }
    next();
  } catch (error) {
    next(error);
  }
};


const adminAuth = async (req, res, next) => {
  try {
    const admin_id = req.get("admin_id");
    // For test sake use hardcoded number for admin_id but ensure to remove
    // before deployment
    const isAdmin =
      admin_id && (admin_id === process.env.ADMIN_ID || admin_id === "90901");
    if (!isAdmin) {
      throw new ForbiddenError("Access Denied!. Only admins are allowed");
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { getProfile, clientAuth, adminAuth};
