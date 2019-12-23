const bcrypt = require('bcrypt');
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('12345', salt);
    //console.log(password);
    const admin = await queryInterface.bulkInsert('users', [
      { "id": "1", "firstName": "Admin", "lastName": "Account", "email": "admin@gmail.com", "password": password },
    ]);

  }
}
