// migrations/2_deploy_contracts.js
const BookRegistry = artifacts.require("BookRegistry");

module.exports = function (deployer) {
  deployer.deploy(BookRegistry);
};