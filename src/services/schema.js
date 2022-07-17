const joi = require("joi").extend(require('@joi/date'));;


exports.admin_schema = joi.object({
  start:joi.date().format('YYYY-MM-DD').required(),
  end: joi.date().format('YYYY-MM-DD').required(),
  limit: joi.number().integer(),
});

exports.deposit_schema = joi.object({
  userId: joi.number().integer().required(),
  amount: joi.number().required(),
});

exports.fetch_contract_schema = joi.object({
  id: joi
    .number()
    .integer()
    .messages({ "number.base": "id must be a number, check again." })
    .required(),
});


exports.pay_for_job_schema = joi.object({
    job_id: joi.number().integer().required(),
    amount: joi.number().required()
  });
  