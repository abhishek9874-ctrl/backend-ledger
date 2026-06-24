const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const ledgerController = require("../controllers/ledger.controller");

const ledgerRoutes = Router();

ledgerRoutes.get(
  "/:accountId",
  authMiddleware.authMiddleware,
  ledgerController.getLedgerEntriesController
);

module.exports = ledgerRoutes;