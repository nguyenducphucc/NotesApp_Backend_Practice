const config = require("./utils/config");
const logger = require("./utils/logger");

logger.error(`Server running on port ${config.PORT}`);
