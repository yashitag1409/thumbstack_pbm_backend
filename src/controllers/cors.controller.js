const CORSMODEL = require("../database/model/cors.model");

module.exports.addOrigin = async (req, resp) => {
  try {
    // console.log(req.body);
    const { origin, status } = req.body;
    const userId = req.user._id;
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
      status: status || "active",
      addedBy: userId,
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
    const { origin, status } = req.body;
    const userId = req.user._id;

    const update_origin = await CORSMODEL.findOneAndUpdate(
      { _id: id },
      {
        $set: { origin, status },
        $push: { updateHistory: { user: userId } }, // Tracking changes
      },
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
      // 1. Define Local Development Origins
      // const localOrigins = [
      //   "http://localhost:3000",
      //   "http://localhost:5173",
      //   "http://127.0.0.1:3000",
      //   "http://127.0.0.1:5173",
      //   "http://192.168.0.207:3000",
      //   "http://192.168.1.50:3000",
      // ];

      // // 2. Handle cases where origin is missing (Postman/Mobile)
      // ❌ Block requests with no origin (Postman, curl, bots)

      console.log("origin", origin);
      if (!origin) {
        console.warn("Blocked request: origin is ", origin);
        return callback(null, false);
      }
      // // 3. Check if origin is a local development URL first
      // if (localOrigins.includes(origin)) {
      //   return callback(null, true);
      // }

      // 4. Fetch ALL active authorized origins from MongoDB
      const dbOrigins = await CORSMODEL.find({ status: "active" }).distinct(
        "origin",
      );
      console.log("dbOrigins", dbOrigins);
      // 5. Validation Logic
      if (dbOrigins.includes(origin)) {
        consoel.log("Allowed CORS request from authorized origin:", origin);
        callback(null, true);
      } else {
        console.error(
          `Blocked CORS request from unauthorized origin: ${origin}`,
        );
        return callback(
          { message: "Unauthorized CORS request", status: "error" },
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
  optionsSuccessStatus: 200,
};
