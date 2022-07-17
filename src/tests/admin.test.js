const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { sequelize } = require("../model");
const { expect } = chai;
chai.use(chaiHttp);

describe("#ADMIN", function () {
  describe("GET '/admin/best-profession ", () => {
    it("should return 403 if wrong admin_id is passed on the  header", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/admin/best-profession");
       
      expect(response).to.have.status(403);
      expect(response.body).to.have.property("message", 'Access Denied!. Only admins are allowed');
    });

    it("should return 400 is date format is wrong", async () => {
        const response = await chai
          .request(server)
          .get("/api/v1/admin/best-profession")
          .set('admin_id', 90901)
          .query({start:'01-02-5', end:'01-03-3'});
        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message", '"start" must be in YYYY-MM-DD format,"end" must be in YYYY-MM-DD format');
      });


    it("should return 400 is start is greater than end", async () => {
        const response = await chai
          .request(server)
          .get("/api/v1/admin/best-profession")
          .set('admin_id', 90901)
          .query({start:'2020-08-30', end:'2020-07-30'});
        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message", 'End date must be greater than or equals to start date');
      });


      it("should return 200 and return message that a copy will be sent", async () => {
        const response = await chai
          .request(server)
          .get("/api/v1/admin/best-profession")
          .set('admin_id', 90901)
          .query({start:'2020-01-30', end:'2020-08-30'});
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("message", 'best professions successfully fetched');
        expect(response.body.data).to.have.equal('A copy of will be emailed to you for download');
      });

      it("should return 200 and return best professions", async () => {
        const response = await chai
          .request(server)
          .get("/api/v1/admin/best-profession")
          .set('admin_id', 90901)
          .query({start:'2020-07-30', end:'2020-08-30'});
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("message", 'best professions successfully fetched');
        expect(response.body.data[0]).to.have.property('profession');
        expect(response.body.data[0]).to.have.property('total_amount_earned');
      });

  });






  describe("GET '/admin/best-clients ", () => {
    it(" should return 200 and response limit should be 2 if no limit is passed", async () => {
      const response = await chai
        .request(server)
        .get("/api/v1/admin/best-clients")
        .query({start:'2020-07-30', end:'2020-08-30'})
        .set("admin_id", 90901);
      expect(response).to.have.status(200);
      expect(response.body.data).to.have.lengthOf(2);
    });

    it(" should return 200 and length should be limit passed", async () => {
        const response = await chai
          .request(server)
          .get("/api/v1/admin/best-clients")
          .query({start:'2020-07-30', end:'2020-08-30', limit:1})
          .set("admin_id", 90901);
        expect(response).to.have.status(200);
        expect(response.body.data).to.have.lengthOf(1);
      });

    
  });
});
