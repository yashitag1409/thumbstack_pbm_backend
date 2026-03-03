const { model } = require("mongoose");

const BOOKSCHEMA = require("../schema/book.schema");
const BOOKMODEL = model("books", BOOKSCHEMA);

module.exports = BOOKMODEL;
