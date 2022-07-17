const { fetchContractService, fetchAllContractsService } = require("../services/contracts");
const { SuccessResponseObject } = require("../utils/response");

exports.fetchContractController = async (req, res) => {
  const response = await fetchContractService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject("Contract successfully fetched", response)
    );
};

exports.fetchAllContractsController = async (req, res) => {
  const response = await fetchAllContractsService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject("Contract(s) successfully fetched", response)
    );
};
