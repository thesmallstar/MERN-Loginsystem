const User = require("../../models/User");
const userSession = require("../../models/Usersession");

module.exports = app => {
  //   app.get("/api/counters", (req, res, next) => {
  //     Counter.find()
  //       .exec()
  //       .then(counter => res.json(counter))
  //       .catch(err => next(err));
  //   });
  //   app.post("/api/counters", function(req, res, next) {
  //     const counter = new Counter();
  //     counter
  //       .save()
  //       .then(() => res.json(counter))
  //       .catch(err => next(err));
  //   });

  app.post("/api/account/signup", (req, res, next) => {
    console.log(req.body);
    const { body } = req;
    const { firstname, lastname, password } = body;
    let { email } = body;

    //return res.send("i");
    if (!firstname) {
      return res.send({
        success: false,
        messege: "Error First name is req."
      });
    }
    if (!lastname) {
      return res.send({
        success: false,
        messege: "Error Last name is req."
      });
    }
    if (!email) {
      return res.send({
        success: false,
        messege: "Error email name is req."
      });
    }
    if (!password) {
      return res.send({
        success: false,
        messege: "Error password name is req."
      });
    }

    email = email.toLowerCase();

    //steps
    //1. Verify User dont exist first

    //2. Save

    //THIS IS MAKING ERROR OF DUPLCATE REQUEST
    User.find(
      {
        email: email
      },
      (err, prevousUsers) => {
        if (err) {
          return res.send({ success: false, messege: "Error: Server Error " });
        }
        if (prevousUsers.length > 0) {
          res.send({ success: false, messege: "Error: Account Exist" });
          return;
        }
      }
    );

    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstname;
    newUser.lastName = lastname;
    newUser.password = newUser.generateHash(password);

    newUser.save((err, user) => {
      if (err) {
        return res.send({ success: false, messege: "Error: Server Error " });
      } else {
        return res.send({ success: true, messege: "Account Created " });
      }
    });
  });

  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!password) {
      return res.send({
        success: false,
        messege: "Password is required"
      });
    }

    if (!email) {
      return res.send({
        success: false,
        messege: "Email is required"
      });
    }

    User.find({ email: email }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          messege: "Error! occured"
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          messege: "Email not found!"
        });
      }

      const user = users[0];

      if (user.validPassword(password)) {
        const usersession = new userSession();
        usersession.userId = user._id;
        usersession.save((err, doc) => {
          return res.send({
            success: true,
            messege: "Successful Sign in ",
            token: doc._id
          });
        });
      } else {
        return res.send({
          success: false,
          messege: "Invalid Password"
        });
      }
    });
  });

  app.get("/api/account/logout", (req, res) => {
    const { query } = req;
    const { token } = query;

    userSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true
        }
      },
      null,
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            messege: "Server Error"
          });
        } else {
          return res.send({
            success: true,
            messege: "SuccessFully Logged Out!"
          });
        }
      }
    );
  });

  app.get("/api/account/verify", (req, res) => {
    const { query } = req;
    const { token } = query;

    userSession.find(
      {
        _id: token,
        isDeleted: false
      },
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            messege: "Server Error"
          });
        } else if (sessions.length == 1) {
          return res.send({
            success: true,
            messege: "Valid!"
          });
        } else {
          return res.send({
            success: false,
            messege: "Invalid!"
          });
        }
      }
    );
  });
};
