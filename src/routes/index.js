const express = require("express");
const router = express.Router();

//=============MIDDLEWARES==============================//
const { getProfile, clientAuth, adminAuth } = require("../middleware/getProfile");
const { handleAsyncError } = require("../middleware/errorHandler");





//===============================CONTROLLERS==============================// 
const {fetchContractController, fetchAllContractsController} = require("../controller/contracts");
const { depositController } = require("../controller/balances");
const {fetchAllUpaidJobsController, payForJobController} = require("../controller/jobs");
const {fetchBestProfessionController, fetchBestClientsController} = require("../controller/admin")







//================================ROUTES====================================//
router.get("/contracts/:id", getProfile, handleAsyncError(fetchContractController));
router.get("/contracts", getProfile, handleAsyncError(fetchAllContractsController));
router.get('/jobs/unpaid', getProfile,handleAsyncError(fetchAllUpaidJobsController));
router.post('/jobs/:job_id/pay', getProfile,clientAuth, handleAsyncError(payForJobController));
router.post("/balances/deposit/:userId",getProfile,clientAuth, handleAsyncError(depositController));
router.get('/admin/best-profession', adminAuth, handleAsyncError(fetchBestProfessionController));
router.get('/admin/best-clients', adminAuth, handleAsyncError(fetchBestClientsController));



module.exports = router;
