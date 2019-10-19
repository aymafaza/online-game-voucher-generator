const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: "3.0.2",
    info: {
      title: "Online game voucher generator swagger documentation",
      description:
        "Add stock and sell online game voucher or game key. By using generate system you can manage your selling to agent.",
      termsOfService: "https://google.com",
      contact: {
        name: "Ahmad Yusqie Mafaza",
        url: "-",
        email: "yusqie@alterra.id"
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html"
      },
      version: "1.0.0"
    },
    servers: [
      { url: "http://localhost:3000", description: "Development server" }
    ]
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ["endpoints.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
