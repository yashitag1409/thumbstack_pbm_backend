const CORSMODEL = require("../database/model/cors.model");

module.exports.addOrigin = async (req, resp) => {
  try {
    // console.log(req.body);
    const { origin } = req.body;

    if (!origin) {
      return resp.status(400).json({ error: "Origin is required." });
    }

    const existingOrigin = await CORSMODEL.findOne({ origin });
    if (existingOrigin) {
      return resp
        .status(400)
        .json({ message: "Origin already exists.", status: "failed" });
    }

    const add_origin = await CORSMODEL.create({
      origin,
    });

    if (!add_origin)
      return resp.status(500).json({ message: "Failed to add origin" });

    return resp.json({
      message: "Origin added successfully",
      status: "success",
      data: add_origin,
    });
  } catch (error) {
    return resp.status(500).json({
      data: null,
      message: error?.message || "Internal Server Error",
      status: "error",
    });
  }
};

module.exports.getAllOrigins = async (req, resp) => {
  try {
    const origins = await CORSMODEL.find({}).sort({ createdAt: -1 });
    return resp.status(200).json({
      data: origins,
      status: "success",
      message: "Origins fetched successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      data: null,
      message: error?.message || "Internal Server Error",
      status: "error",
    });
  }
};

module.exports.deleteOrigin = async (req, resp) => {
  try {
    const { id } = req.params;
    const remove_origin = await CORSMODEL.findOneAndDelete({
      _id: id,
    });
    if (!remove_origin)
      return resp
        .status(400)
        .json({ message: "Origin not found", status: "failed" });
    return resp
      .status(200)
      .json({ message: "Origin removed successfully", status: "success" });
  } catch (error) {
    return resp.status(500).json({
      data: null,
      message: error?.message || "Internal Server Error",
      status: "error",
    });
  }
};

// update origin
module.exports.updateOrigin = async (req, resp) => {
  try {
    const { id } = req.params;
    const { origin, credentials } = req.body;
    const update_origin = await CORSMODEL.findOneAndUpdate(
      { _id: id },
      { $set: { origin } },
      { new: true },
    );

    if (!update_origin)
      return resp
        .status(400)
        .json({ message: "Origin not found", status: "failed" });
    return resp.status(200).json({
      status: "success",
      message: "Origin updated successfully",
      data: update_origin,
    });
  } catch (error) {
    return resp.status(500).json({
      data: null,
      message: error?.message || "Internal Server Error",
      status: "error",
    });
  }
};

module.exports.corsOptions = {
  origin: async (origin, callback) => {
    try {
      // 1. Handle cases where origin is missing (Optional: Allow Postman/Mobile)
      // If you want to be extremely strict even for Postman, change this to:
      // if (!origin) return callback(new Error("Origin required"), false);
      if (!origin) {
        return callback(null, true);
      }

      // 2. Fetch ALL authorized origins from MongoDB
      // We only fetch origins where status is "active" to allow easy revoking
      const dbOrigins = await CORSMODEL.find({ status: "active" }).distinct(
        "origin",
      );

      // 3. Validation Logic
      // We check if the incoming request origin exists in our DB list
      if (dbOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log the unauthorized attempt for security auditing
        console.error(
          `Blocked CORS request from unauthorized origin: ${origin}`,
        );
        callback(
          new Error(`Security Restriction: Origin ${origin} not authorized.`),
          false,
        );
      }
    } catch (error) {
      console.error("CORS Middleware Error:", error);
      callback(error, false);
    }
  },
  credentials: true, // Required for JWT cookies/sessions
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200, // For legacy browser support
};
