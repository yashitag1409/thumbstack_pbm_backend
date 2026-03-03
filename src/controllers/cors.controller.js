const CORSMODEL = require("../database/model/cors.model");

module.exports.addOrigin = async (req, resp) => {
  try {
    console.log(req.body);
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
      // 1. Define your Local Development Origins
      const localOrigins = [
        "http://localhost:5173", // Vite default
        "http://localhost:3000", // React default
        "http://192.168.1.50:3000",
      ];

      // 2. Handle cases where origin is missing (like Postman or mobile apps)
      // During development, we usually allow 'no origin'
      if (!origin) {
        return callback(null, true);
      }

      // 3. Fetch dynamic origins from MongoDB
      const dbOrigins = await CORSMODEL.find({ status: "active" }).distinct(
        "origin",
      );

      // 4. Merge Local and DB origins
      const allAllowedOrigins = [...localOrigins, ...dbOrigins];

      // 5. Check if the incoming origin is in the list
      if (allAllowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`), false);
      }
    } catch (error) {
      callback(error, false);
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
