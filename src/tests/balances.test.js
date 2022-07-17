const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { sequelize } = require("../model");
const { expect } = chai;
chai.use(chaiHttp);

describe("#Balances", function () {
  describe("POST '/balances/deposit/:userId", () => {
    it(" should return 400 if amount is not passed", async () => {
      const response = await chai
        .request(server)
        .post("/api/v1/balances/deposit/1")
        .set("profile_id", 1);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"amount" is required');
    });

    it("should return 400 if no job in progress for client to deposit", async () => {
      // Create a profile;
      const new_profile = await sequelize.models.Profile.create({
        firstName: "olufemi",
        lastName: "obafunmiso",
        type: "client",
        balance: "900",
        profession: "Dev",
      });
      const response = await chai
        .request(server)
        .post("/api/v1/balances/deposit/9")
        .set("profile_id", new_profile.id)
        .send({ amount: 400 });

      expect(response).to.have.status(404);
      expect(response.body).to.have.property(
        "message",
        "No job in progress to deposit for."
      );

      await new_profile.destroy();
    });

    it("should return 400 if deposit is greater than 25% of total jobs", async () => {
      const db_result = await sequelize.models.Job.findAll({
        attributes: [sequelize.fn("SUM", sequelize.col("price"))],
        include: [
          {
            model: sequelize.models.Contract,
            where: {
              status: "in_progress", // I assume clients will only need to deposit to pay for  Active contracts
              ClientId: 1,
            },
          },
        ],
        raw: true,
      });
      const client_total_balance_for_jobs = db_result[0]["SUM(`price`)"];
      const response = await chai
        .request(server)
        .post("/api/v1/balances/deposit/1")
        .set("profile_id", 1)
        .send({ amount: client_total_balance_for_jobs + 200 });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property(
        "message",
        "can't deposit more than 25% the total of jobs to pay (at the deposit moment)."
      );
    });

    it("should return 200 and make deposit", async () => {
      const client_profile = await sequelize.models.Profile.findByPk(1);
      const db_result = await sequelize.models.Job.findAll({
        attributes: [sequelize.fn("SUM", sequelize.col("price"))],
        include: [
          {
            model: sequelize.models.Contract,
            where: {
              status: "in_progress", // I assume clients will only need to deposit to pay for  Active contracts
              ClientId: 1,
            },
          },
        ],
        raw: true,
      });
      const client_total_balance_for_jobs = db_result[0]["SUM(`price`)"];
      const twenty_percent = (25 / 100) * client_total_balance_for_jobs;
      const response = await chai
        .request(server)
        .post("/api/v1/balances/deposit/1")
        .set("profile_id", 1)
        .send({ amount: twenty_percent });

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("message", "Deposit successful");

      // reverse
      await client_profile.decrement("balance", { by: twenty_percent });
    });
  });
});
