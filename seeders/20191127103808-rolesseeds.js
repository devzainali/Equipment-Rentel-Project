module.exports = {
  async up(queryInterface) {
    const categories = await queryInterface.bulkInsert('roles', [
      { "id": "1", "name": "owner" },
      { "id": "2", "name": "renter" },
      { "id": "3", "name": "admin" },
    ]);


  }
}