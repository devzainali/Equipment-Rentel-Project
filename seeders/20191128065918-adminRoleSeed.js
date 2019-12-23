module.exports = {
  async up(queryInterface) {
    const adminrole = await queryInterface.bulkInsert('userroles', [
      { "id": "1", "userID": 1, "roleID": 3 },
    ]);

  }
}