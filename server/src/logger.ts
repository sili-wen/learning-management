const logger = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};

export default logger;
