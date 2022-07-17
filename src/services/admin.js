const { QueryTypes } = require("sequelize");
const { sequelize } = require("../model");
const { admin_schema } = require("./schema");
const { validator } = require("../utils/validator");
const { queries } = require("../utils/query");
const { padDate, isEndDateGreater, getMonthDifference} = require("../utils/date");
const { BadRequestError } = require("../utils/error");

exports.fetchBestProfessionService = async (req) => {
  const { start, end } = req.query;

  // Validate Query passed
  validator(admin_schema, { start, end });

  //Check that end_date >= start_date
  const isEndGreater = isEndDateGreater(`${start}`, `${end}`);

  if (!isEndGreater) {
    throw new BadRequestError(
      "End date must be greater than or equals to start date"
    );
  }

  const [start_date, end_date] = [padDate(start, "start"), padDate(end, "end")];

  // In instances that the query dates passed, the months difference is 6 months
  // This can take time to query and slow down the system
  // It's better to run a queue and send a CSV to download to user email e.g AWS SQS
  const month_difference = getMonthDifference(`${start}`, `${end}`);

  if (month_difference >= 6) {
    return "A copy of will be emailed to you for download";
  }

  const { best_professions_query } = queries;

  const best_professions = await sequelize.query(`${best_professions_query}`, {
    replacements: [start_date, end_date],
    type: QueryTypes.SELECT,
  });

  return best_professions;
};

exports.fetchBestClientsService = async (req) => {
  const { start, end, limit } = req.query;

  // Validate Query passed
  validator(admin_schema, { start, end, limit });
  //Check that end_date >= start_date
  const isEndGreater = isEndDateGreater(`${start}`, `${end}`);

  if (!isEndGreater) {
    throw new BadRequestError(
      "End date must be greater than or equals to start date"
    );
  }

  const [start_date, end_date] = [padDate(start, "start"), padDate(end, "end")];

  // In instances that the query dates passed, the months difference is 6 months
  // This can take time to query and slow down the system
  // It's better to run a queue and send a CSV to download to user email e.g AWS SQS
  const month_difference = getMonthDifference(`${start}`, `${end}`);

  if (month_difference >= 6) {
    return "A copy of will be emailed to you for download";
  }

  const { best_clients_query } = queries;

  const query_limit = limit || 2;

  const best_clients = await sequelize.query(`${best_clients_query}`, {
    replacements: [start_date, end_date, query_limit],
    type: QueryTypes.SELECT,
  });

  // Format response as seen in README
  // Also, it's okay for response to be empty, if query returns empty
  // One major reason to return the empty array and not error is if Fronted wants to display the response

  const response = best_clients.map((clients) => {
    return {
      id: clients.ClientId,
      fullname: `${clients.firstName}, ${clients.lastName}`,
      paid: `${clients.totalPricePaid}`,
    };
  });

  return response;
};
