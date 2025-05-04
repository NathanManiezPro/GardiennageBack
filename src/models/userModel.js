// src/models/usersModel.js
let users = [];

module.exports = {
  getAll: () => users,
  create: (user) => {
    user.id = users.length + 1;
    users.push(user);
    return user;
  },
  findByEmail: (email) => users.find(u => u.email === email)
};
