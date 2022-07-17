const { Op } = require("sequelize");
const { sequelize } = require("../model");
const { pay_for_job_schema } = require("./schema");
const { validator } = require("../utils/validator");
const { NotFoundError, BadRequestError } = require("../utils/error");
const { cache } = require("../utils/cache");

exports.fetchAllUpaidJobsService = async (req) => {
  /**
   * @returns all unpaid jobs for a user (either a client or contractor),
   * for active contracts only.
   *
   */

  const { Contract, Job } = req.app.get("models");
  //Since cache refreshe every 1hr, i think it'a okay to use cache for this
  const check_cache = cache.get(`fetchAllUpaidJobs-${req.profile.id}`);

  let db_result;

  if (!check_cache) {
    db_result = await Job.findAll({
      where: {
        paid: {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Contract,
          where: {
            status: "in_progress",
            [Op.or]: [
              { ContractorId: req.profile.id },
              { ClientId: req.profile.id },
            ],
          },
        },
      ],
    });
  }

  // Add to cache

  cache.set(`fetchAllUpaidJobs-${req.profile.id}`, db_result);
  // FindAll will return empty if not contract found
  // it's okay for the API response to be an empty array
  // One major reason to return the empty array and not error is if Fronted wants to display the response

  return check_cache || db_result;
};

exports.payForJobService = async (req) => {
  /**
   * @param {job_id} - the id of the job the client want's to pay for
   * @param {amount} - amount client is paying to contractor
   *  @returns Pay contractor by moving funds from clients balance
   *
   */

  const transaction = await sequelize.transaction();
  try {
    const jobId = req.params.job_id;
    const amountToPay = req.body.amount;

    // Validate Request params
    validator(pay_for_job_schema, {
      job_id: jobId,
      amount: amountToPay,
    });

    const client_profile = req.profile;

    const { Contract, Job, Profile } = req.app.get("models");

    // Check if client has enough balance for the transaction
    if (client_profile.balance < amountToPay) {
      throw new BadRequestError("Insufficient balance");
    }

    // check if job_id exist
    const contractor_job = await Job.findOne({
      where: {
        id: jobId,
      },
      include: [
        {
          model: Contract,
          where:{ ClientId:client_profile.id} 
        },
      ],
    });

    if (!contractor_job) {
      throw new NotFoundError("Job does not exist");
    }

    const contractor_id = contractor_job.Contract.ContractorId;
    contractor_job.paid = 1;
    contractor_job.paymentDate = Date.now();

    const contractor_profile = await Profile.findByPk(contractor_id);

    // run queries in parallel using promise.all() to perform concurrent asynchronous operations
    const [update_client_profile, update_contractor_profile, update_job] =
      await Promise.all([
        // Remove amountToPay contractor from client's balance
        client_profile.decrement("balance", { by: amountToPay }, transaction),
        // Pay contractor
        contractor_profile.increment(
          "balance",
          { by: amountToPay },
          transaction
        ),
        //Update job
        contractor_job.save(transaction),
      ]);
    const client_new_balance = await update_client_profile.reload(); // sequelize.reload() returns up-to-date data
    await transaction.commit();

    return client_new_balance;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};
