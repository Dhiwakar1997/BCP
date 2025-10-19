class UserController {
    getAllUsers(req, res) {
      res.json({ message: "Returning all users" });
    }
  }

  module.exports = new UserController();
  