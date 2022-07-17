const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { sequelize } = require("../model");
const { expect } = chai;
chai.use(chaiHttp);

describe("#Jobs", function () {
  describe("GET '/jobs/unpaid ", () => {
    it(" should return 200 and return all upaid jobs", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/jobs/unpaid")
        .set("profile_id", 1);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property(
        "message",
        "Upaid jobs successfully fetched"
      );
    });

    it(" should return 200 and return empty array if no jobs returned for profile", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/jobs/unpaid")
        .set("profile_id", 8);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property(
        "message",
        "Upaid jobs successfully fetched"
      );
      expect(response.body.data).to.be.an("array").that.is.empty;
    });
  });

  describe("POST 'jobs/:job_id/pay ", () => {
    it("should return 400 if amount is not passed", async () => {
      const response = await chai
        .request(server)
        .post(`/api/v1/jobs/1/pay`)
        .set("profile_id", 1);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"amount" is required');
    });

    it("should return 400 if amount is not a number", async () => {
      const response = await chai
        .request(server)
        .post(`/api/v1/jobs/1/pay`)
        .set("profile_id", 1)
        .send({ amount: "olufemi" });
      expect(response).to.have.status(400);
      expect(response.body).to.have.property(
        "message",
        '"amount" must be a number'
      );
    });

    it("should return 401 profile is not client", async () => {
      const response = await chai
        .request(server)
        .post(`/api/v1/jobs/1/pay`)
        .set("profile_id", 5)
        .send({ amount: 60 });
      expect(response).to.have.status(403);
      expect(response.body).to.have.property(
        "message",
        "Access Denied!. Only clients are allowed"
      );
    });
    it("should return 404 if clients wants to pay another job that is not associated to their profile", async () => {
        const response = await chai
          .request(server)
          .post(`/api/v1/jobs/1/pay`)
          .set("profile_id", 9)
          .send({ amount: 60 });
        expect(response).to.have.status(404);
        expect(response.body).to.have.property(
          "message",
          "Job does not exist"
        );
      });
    it("should return 400 if clients does not have sufficient balance", async () => {
      const client_profile = await sequelize.models.Profile.findByPk(1);
      const amount_to_pay = client_profile.balance + 1000;

      const response = await chai
        .request(server)
        .post(`/api/v1/jobs/1/pay`)
        .set("profile_id", 1)
        .send({ amount: amount_to_pay });
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Insufficient balance");
    });

    it("should return 200 and move funds from client to contractor", async () => {
      const contractor_job = await sequelize.models.Job.findOne({
        where: {
          id: 1,
        },
        include: [
          {
            model: sequelize.models.Contract,
          },
        ],
      });

      const contractor_id = contractor_job.Contract.ContractorId;

      const client_profile = await sequelize.models.Profile.findByPk(1);

      const contractor_profile = await sequelize.models.Profile.findByPk(
        contractor_id
      );
      const response = await chai
        .request(server)
        .post(`/api/v1/jobs/1/pay`)
        .set("profile_id", 1)
        .send({ amount: 10 });

      const clients_new_balance = client_profile.balance - 10;
      expect(response.body).to.have.property("message", "Payment successful");
      expect(response.body.data).to.have.property(
        "balance",
        clients_new_balance
      );
      const { balance } = await sequelize.models.Profile.findByPk(
        contractor_id
      );
      const contractor_new_balance = contractor_profile.balance + 10;
      expect(balance).to.equal(contractor_new_balance);

      //reverse afterwards
      client_profile.increment("balance", { by: 10 });
      contractor_profile.decrement("balance", { by: 10 });
    });
  });
});
