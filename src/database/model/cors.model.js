const { model } = require("mongoose");

const CORSSCHEMA = require("../schema/cors.schema");
const CORSMODEL = model("cors", CORSSCHEMA);

module.exports = CORSMODEL;
