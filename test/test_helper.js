const mongoose = require("mongoose");

before(done => {
  mongoose.connect(process.env.DATABASE_CONNECTION_STRING_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection
    .once("open", () => {
      console.log("Connected!");
      mongoose.connection.db.dropDatabase(err => {
        if (err) console.log("Error dropping database", err);
        console.log("Clearing database");
        //this function runs after the drop is completed
      });
      done(); //go ahead everything is done now.
    })
    .on("error", error => {
      console.warn("Error : ", error);
    });
});

//Called hooks which runs before something.
afterEach(done => {
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.db.dropDatabase(err => {
      if (err) console.log("Error dropping database", err);
      console.log("Dropping database");
      //this function runs after the drop is completed
      done(); //go ahead everything is done now.
    });
  }
});
