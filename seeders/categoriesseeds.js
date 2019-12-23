module.exports = {
    async up(queryInterface) {
        const categories = await queryInterface.bulkInsert('categories', [
            { "id": "1", "name": "Passenger Transport", "Image": "category\/bus.png", "createdAt": null, "updatedAt": null },
            { "id": "2", "name": "Forestry", "Image": "category\/forest.png", "createdAt": null, "updatedAt": null },
            { "id": "3", "name": "Lifting Equipment", "Image": "category\/lifting.png", "createdAt": null, "updatedAt": null },
            { "id": "4", "name": "Mining & Construction", "Image": "category\/mining.png", "createdAt": null, "updatedAt": null },
            { "id": "5", "name": "Power Generators", "Image": "category\/power-generator.png", "createdAt": null, "updatedAt": null },
            { "id": "6", "name": "Road Freight Transport", "Image": "category\/tank-truck.png", "createdAt": null, "updatedAt": null },
            { "id": "7", "name": "Farming", "Image": "category\/tractor.png", "createdAt": null, "updatedAt": null },
            { "id": "8", "name": "Warehouse & Factory", "Image": "category\/warehouse.png", "createdAt": null, "updatedAt": null },
            { "id": "9", "name": "Leisure", "Image": "category\/yatch.png", "createdAt": null, "updatedAt": null }
        ]);


    }
}