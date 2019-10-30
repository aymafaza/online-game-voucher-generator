const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: "3.0.2",
    info: {
      title: "Online game voucher generator swagger documentation",
      description: `<img src="https://6.viki.io/image/686f944090c3407996e03a9715882f7d.jpeg?s=900x600&e=t"> <br /> Add stock and sell online game voucher or game key. By using generate system you can manage your selling to agent.`,
      termsOfService: "https://google.com",
      contact: {
        name: "Ahmad Yusqie Mafaza",
        url: "-",
        email: "yusqie@alterra.id"
      },
      license: {
        name: "MIT License  ",
        url: "https://opensource.org/licenses/MIT"
      },
      version: "1.0.0"
    },
    servers: [
      { url: "http://localhost:3000", description: "Development server" }
    ]
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
