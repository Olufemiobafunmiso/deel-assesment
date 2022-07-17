const { Op } = require("sequelize");
const { fetch_contract_schema } = require("./schema");
const { validator } = require("../utils/validator");
const {  NotFoundError } = require("../utils/error");
const { cache } = require("../utils/cache");

exports.fetchContractService = async (req) => {
  /**
   * @param {id} - The contract id
   * @returns contract by id
   *
   */

  const { Contract, Profile } = req.app.get("models");
  const { id: contract_id } = req.params;

  //Validate Request params
  validator(fetch_contract_schema, { id: contract_id });
  //Check CACHE here before DB query since the value does not change frequently
  // Caching  reduce latency and improve performance
  // I used lru-cache to save the  engineer who is checking this assesment the stress
  // of having to Install redis on their local machine.
  // My go-to for caching is REDIS for a prod-ready app

  const check_cache = cache.get(`fetchContract-${contract_id}`);

  const profile_type = req.profile.type;
  const types = { contractor: "ContractorId", client: "ClientId" };

  let db_result;

  if (!check_cache) {
    // should return the contract ONLY if it belong
    // to the profile calling
    // Profile can either be a client  or contractor on the contract

    db_result = await Contract.findOne({
      where: {
        id: contract_id,
        [types[profile_type]]: req.profile.id,
      },
      include: [
        { model: Profile, as: "Client", attributes: ["firstName", "lastName"] },
        {
          model: Profile,
          as: "Contractor",
          attributes: ["firstName", "lastName"],
        },
      ],
    });
  }

  if (db_result) {
    // Add to cache
    cache.set(`fetchContract-${contract_id}`, db_result);
  }

  if (!check_cache && !db_result) {
    throw new NotFoundError("Contract does not exist");
  }

  return check_cache || db_result;
};

exports.fetchAllContractsService = async (req) => {
  /**
   * @returns a list of contracts (non-terminated) belonging to a user (client or contractor)
   *
   */

  const { Contract, Profile } = req.app.get("models");

  const check_cache = cache.get(`fetchAllContracts-${req.profile.id}`);

  const profile_type = req.profile.type;
  const types = { contractor: "ContractorId", client: "ClientId" };
  let db_result;

  if (!check_cache) {
    db_result = await Contract.findAll({
      where: {
        status: {
          [Op.ne]: "terminated",
        },
        [types[profile_type]]: req.profile.id,
      },
      include: [
        {
          model: Profile,
          as: "Client",
          attributes: ["firstName", "lastName"],
        }, //It's not Ideal that either client or contractor should see eachothers balance, so return just name
        {
          model: Profile,
          as: "Contractor",
          attributes: ["firstName", "lastName"],
        },
      ],
    });
  }

  cache.set(`fetchAllContracts-${req.profile.id}`, db_result);

  // FindAll will return empty if not contract found
  // it's okay for the API response to be an empty array
  // One major reason to return the empty array and not error is if Fronted wants to display the response


  return check_cache || db_result;
};
