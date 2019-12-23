module.exports = {
  async up(queryInterface) {
    const categories = await queryInterface.bulkInsert('pages', [
      { "id": "1", "pageTitle": "About Us", "content": "", "createdAt": null, "updatedAt": null },
      { "id": "2", "pageTitle": "Disclaimer", "content": "", "createdAt": null, "updatedAt": null },
    ]);


  }
}