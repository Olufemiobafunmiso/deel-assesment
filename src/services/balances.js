const { Op } = require("sequelize");
const { sequelize } = require("../model");
const { deposit_schema } = require("./schema");
const { validator } = require("../utils/validator");
const { BadRequestError, NotFoundError } = require("../utils/error");


exports.depositService = async (req) => {
  /**
   * @param {userId} - client's userId
   * @param {amount} - amount client's wants to deposit
   *  @returns - clients new balance
   *
   */

  const { userId } = req.params;
  const { amount: deposit_amount } = req.body;

  // Validate Request params
  validator(deposit_schema, { userId, amount: deposit_amount });

  const client_profile = req.profile;

  const { Contract, Job } = req.app.get("models");

  const db_result = await Job.findAll({
    attributes: [sequelize.fn("SUM", sequelize.col("price"))],
    include: [
      {
        model: Contract,
        where: {
          status: "in_progress", // I assume clients will only need to deposit to pay for  Active contracts
          ClientId: userId,
        },
      },
    ],
    raw: true,
  });

  if (!db_result[0]['Contract.id']) {
    throw new NotFoundError("No job in progress to deposit for.");
  }

  const { "SUM(`price`)": total_sum_jobs } = db_result[0];

  //Check if deposit > 25% of total_sum_jobs
  const depositIsGreater = isGreaterThanTwentyFivePercent(
    deposit_amount,
    total_sum_jobs
  );

  if (depositIsGreater) {
    throw new BadRequestError(
      "can't deposit more than 25% the total of jobs to pay (at the deposit moment)."
    );
  }

  //Make deposit
  const make_deposit = await client_profile.increment("balance", {
    by: deposit_amount,
    where: { id: userId },
  });
  const new_balance = await make_deposit.reload();

  return new_balance;
};

const isGreaterThanTwentyFivePercent = (deposit, total_fee) => {
  const calculate_percent = (25 / 100) * Number(total_fee);
  return deposit > calculate_percent;
};
