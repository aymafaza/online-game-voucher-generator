//inside create_test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcrypt");
const server = require("../server");
const User = require("../api/models/users"); //imports the mongoose User model.

const should = chai.should();

chai.use(chaiHttp);

describe("Creating User (signup)", () => {
  it("creates a user", done => {
    const user = {
      username: "garudamalang@gmail.com",
      email: "garudamalang@gmail.com",
      name: "Yusqie Mafaza",
      password: "password123"
    };

    chai
      .request(server)
      .post("/users/signup")
      .send(user)
      .end((err, res) => {
        const { username, email, name } = res.body.data;
        if (err) console.log(res.body); // print response body when error
        res.should.have.status(200);
        username.should.equal(user.username);
        email.should.equal(user.email);
        done();
      });
  });

  it("fail because generating duplicate user", done => {
    const user = {
      username: "garudamalang@gmail.com",
      email: "garudamalang@gmail.com",
      name: "Yusqie Mafaza",
      password: "password123"
    };

    // First insert should be success
    chai
      .request(server)
      .post("/users/signup")
      .send(user)
      .end((err, res) => {
        const { username, email, name } = res.body.data;
        if (err) console.log(res.body); // print response body when error
        res.should.have.status(200);
        username.should.equal(user.username);
        email.should.equal(user.email);

        // Second insert should return error, because the user was already generated
        chai
          .request(server)
          .post("/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.be.a("string");
            done();
          });
      });
  });

  it("fail because email not valid", done => {
    const user = {
      username: "garudamalang@gmail.com",
      email: "garudamalang-gmail.com",
      name: "Yusqie Mafaza",
      password: "password123"
    };

    chai
      .request(server)
      .post("/users/signup")
      .send(user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.message.should.be.a("string");
        res.body.message.should.equal("Email not valid");
        done();
      });
  });
});

describe("User login test", () => {
  beforeEach(async () => {
    const user = {
      username: "garudamalang@gmail.com",
      email: "garudamalang@gmail.com",
      name: "Yusqie Mafaza",
      password: "password123"
    };

    // Encrypt password using hash function
    user.password = await bcrypt.hash(user.password, 10);

    // Create user
    await User.create(user);
  });

  it("Login success", done => {
    chai
      .request(server)
      .post("/users/login")
      .send({
        username: "garudamalang@gmail.com",
        password: "password123"
      })
      .end((err, res) => {
        const { token } = res.body;
        res.should.have.status(200);
        token.should.be.a("string");
        done();
      });
  });

  it("Login fail (wrong password)", done => {
    chai
      .request(server)
      .post("/users/login")
      .send({
        username: "garudamalang@gmail.com",
        password: "password1234"
      })
      .end((err, res) => {
        const { message } = res.body;
        res.should.have.status(500);
        message.should.equal("Wrong password");
        done();
      });
  });

  it("Login fail (wrong username)", done => {
    chai
      .request(server)
      .post("/users/login")
      .send({
        username: "garudamalank@gmail.com",
        password: "password123"
      })
      .end((err, res) => {
        const { message } = res.body;
        res.should.have.status(500);
        message.should.equal("Invalid username or email");
        done();
      });
  });
});
