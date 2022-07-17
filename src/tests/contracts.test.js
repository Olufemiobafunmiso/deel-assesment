const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { sequelize } = require("../model");
const { expect } = chai;
chai.use(chaiHttp);

describe("#Contracts", function () {
  describe("GET '/contracts/:id ", () => {
    it(" should return 400 if profile_id is not passed to the HEADER", async () => {
      const response = await chai.request(server).get("/api/v1/contracts/:id");
      expect(response).to.have.status(400);
      expect(response.body).to.have.property(
        "message",
        "profile_id is required on the Header"
      );
    });

    it("should return 400 if profile_id is not a number", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/contracts/:id")
        .set("profile_id", "olufemi");
      expect(response).to.have.status(400);
      expect(response.body).to.have.property(
        "message",
        '"profile_id" must be a number'
      );
    });

    it("should return 401 if profile_id does not exist on the DB", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/contracts/:id")
        .set("profile_id", 90);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Unauthorized");
    });

    it("should return 400 if id is not a number", async () => {
      const response = await chai
        .request(server)
        .get(`/api/v1/contracts/:${(id = "olufemi")}`)
        .set("profile_id", 1);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property(
        "message",
        "id must be a number, check again."
      );
    });

    it("should return 200 and fetch contract by id", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/contracts/1")
        .set("profile_id", 1);

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property(
        "message",
        "Contract successfully fetched"
      );
      expect(response.body.data).to.be.an("object");
      expect(response.body.data).to.have.property("terms");
      expect(response.body.data).to.have.property("ClientId");
      expect(response.body.data).to.have.property("ContractorId");
    });
  });

  describe("GET '/contracts ", () => {
    it("should return 200 and fetch all contracts non-terminated contracts for the profile", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/contracts")
        .set("profile_id", 1);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property(
        "message",
        "Contract(s) successfully fetched"
      );
      expect(response.body.data[0]).to.be.an("object");
      expect(response.body.data[0].status).to.not.equal("terminated");
    });

    it("should return 200 and return empty array if profile does not have active contracts", async () => {
      // Create a profile;
      const new_profile = await sequelize.models.Profile.create({
        firstName: "olufemi",
        lastName: "obafunmiso",
        type: "contractor",
        balance: "900",
        profession: "Dev",
      });
      const response = await chai
        .request(server)
        .get("/api/v1/contracts")
        .set("profile_id", new_profile.id);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property(
        "message",
        "Contract(s) successfully fetched"
      );
      expect(response.body.data).to.be.an("array").that.is.empty;

      await new_profile.destroy();
    });
  });
});
