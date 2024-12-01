import { Sequelize } from "sequelize";
import { form_write_logs } from "@/winston/form/logger";

export const connectToDB = async () => {
  try {
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
      }
    );

    await sequelize.authenticate();
    form_write_logs({
      message: `MySQL database connected successfully.`,
      log_type: "info",
    });

    return sequelize;
  } catch (error) {
    form_write_logs({
      message: `Database connection failed: ${error.message}`,
      log_type: "error",
    });
    throw new Error(error);
  }
};
