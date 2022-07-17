const { fetchBestProfessionService, fetchBestClientsService } = require("../services/admin");
const { SuccessResponseObject } = require("../utils/response");

exports.fetchBestProfessionController = async (req, res) => {
  const response = await fetchBestProfessionService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject(
        "best professions successfully fetched",
        response
      )
    );
};

exports.fetchBestClientsController = async (req, res) => {
  const response = await fetchBestClientsService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject("best clients successfully fetched", response)
    );
};
