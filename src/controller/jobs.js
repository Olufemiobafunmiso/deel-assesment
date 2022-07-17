const { fetchAllUpaidJobsService, payForJobService } = require("../services/jobs");
const { SuccessResponseObject } = require("../utils/response");

exports.fetchAllUpaidJobsController = async (req, res) => {
  const response = await fetchAllUpaidJobsService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject("Upaid jobs successfully fetched", response)
    );
};

exports.payForJobController = async (req, res) => {
  const response = await payForJobService(req);
  return res
    .status(200)
    .json(
      new SuccessResponseObject("Payment successful", response)
    );
};
