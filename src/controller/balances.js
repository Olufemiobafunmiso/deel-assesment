const { depositService } = require("../services/balances");
const { SuccessResponseObject } = require("../utils/response");

exports.depositController = async (req, res) => {
  const response = await depositService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject("Deposit successful", response)
    );
};


