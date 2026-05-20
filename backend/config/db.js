const { Sequelize } = require("sequelize");

// PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL connected successfully");

    // Sync models
    await sequelize.sync({ alter: true });

    console.log("Database tables synced");
  } catch (err) {
    console.error("DB connection failed:", err);

    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};