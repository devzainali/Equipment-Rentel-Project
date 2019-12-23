module.exports = {
    async up(queryInterface) {
        const categories = await queryInterface.bulkInsert('subcategories', [
            { "id": "3", "name": "Air Compressor", "parentId": "4", "createdAt": "2019-11-12 09:55:11", "updatedAt": "2019-11-12 09:55:11" },
            { "id": "4", "name": "Articulated Truck", "parentId": "4", "createdAt": "2019-11-12 09:55:21", "updatedAt": "2019-11-12 09:55:21" },
            { "id": "5", "name": "Asphalt Paving Equipment", "parentId": "4", "createdAt": "2019-11-12 09:55:28", "updatedAt": "2019-11-12 09:55:28" },
            { "id": "6", "name": "Backhoe Loader", "parentId": "4", "createdAt": "2019-11-12 09:55:36", "updatedAt": "2019-11-12 09:55:36" },
            { "id": "7", "name": "Compactor", "parentId": "4", "createdAt": "2019-11-12 09:55:43", "updatedAt": "2019-11-12 09:55:43" },
            { "id": "8", "name": "Excavator", "parentId": "4", "createdAt": "2019-11-12 09:55:51", "updatedAt": "2019-11-12 09:55:51" },
            { "id": "9", "name": "Integrated Toolcarrier", "parentId": "4", "createdAt": "2019-11-12 09:56:00", "updatedAt": "2019-11-12 09:56:00" },
            { "id": "10", "name": "Load\/Haul\/Dump", "parentId": "4", "createdAt": "2019-11-12 09:56:08", "updatedAt": "2019-11-12 09:56:08" },
            { "id": "11", "name": "Masonry Breaker", "parentId": "4", "createdAt": "2019-11-12 09:56:15", "updatedAt": "2019-11-12 09:56:15" },
            { "id": "12", "name": "Masonry Drill", "parentId": "4", "createdAt": "2019-11-12 09:56:22", "updatedAt": "2019-11-12 09:56:22" },
            { "id": "13", "name": "Material Handler", "parentId": "4", "createdAt": "2019-11-12 09:56:28", "updatedAt": "2019-11-12 09:56:28" },
            { "id": "14", "name": "Mobile Crushers and Screen", "parentId": "4", "createdAt": "2019-11-12 09:56:34", "updatedAt": "2019-11-12 09:56:34" },
            { "id": "15", "name": "Motor Grader", "parentId": "4", "createdAt": "2019-11-12 09:56:40", "updatedAt": "2019-11-12 09:56:40" },
            { "id": "16", "name": "Multi Terrain Loader", "parentId": "4", "createdAt": "2019-11-12 09:56:50", "updatedAt": "2019-11-12 09:56:50" },
            { "id": "17", "name": "Off Highway Truck", "parentId": "4", "createdAt": "2019-11-12 09:56:59", "updatedAt": "2019-11-12 09:56:59" },
            { "id": "18", "name": "On-highway Vehicle", "parentId": "4", "createdAt": "2019-11-12 09:57:05", "updatedAt": "2019-11-12 09:57:05" },
            { "id": "19", "name": "Pipelayer", "parentId": "4", "createdAt": "2019-11-12 09:57:09", "updatedAt": "2019-11-12 09:57:09" },
            { "id": "20", "name": "Planer", "parentId": "4", "createdAt": "2019-11-12 09:57:15", "updatedAt": "2019-11-12 09:57:15" },
            { "id": "21", "name": "Rock Breaker", "parentId": "4", "createdAt": "2019-11-12 09:57:22", "updatedAt": "2019-11-12 09:57:22" },
            { "id": "22", "name": "Rock Drill", "parentId": "4", "createdAt": "2019-11-12 09:57:30", "updatedAt": "2019-11-12 09:57:30" },
            { "id": "23", "name": "Rotary Mixer", "parentId": "4", "createdAt": "2019-11-12 09:57:36", "updatedAt": "2019-11-12 09:57:36" },
            { "id": "24", "name": "Scraper", "parentId": "4", "createdAt": "2019-11-12 09:57:42", "updatedAt": "2019-11-12 09:57:42" },
            { "id": "25", "name": "Skid Steer Loader", "parentId": "4", "createdAt": "2019-11-12 09:57:51", "updatedAt": "2019-11-12 09:57:51" },
            { "id": "26", "name": "Surface Drill Rig", "parentId": "4", "createdAt": "2019-11-12 09:58:00", "updatedAt": "2019-11-12 09:58:00" },
            { "id": "27", "name": "Telehandler", "parentId": "4", "createdAt": "2019-11-12 09:58:10", "updatedAt": "2019-11-12 09:58:10" },
            { "id": "28", "name": "Track Loader", "parentId": "4", "createdAt": "2019-11-12 09:58:16", "updatedAt": "2019-11-12 09:58:16" },
            { "id": "29", "name": "Track-Type Tractors\/Bulldozer", "parentId": "4", "createdAt": "2019-11-12 09:58:23", "updatedAt": "2019-11-12 09:58:23" },
            { "id": "30", "name": "Underground Articulated Truck", "parentId": "4", "createdAt": "2019-11-12 09:58:29", "updatedAt": "2019-11-12 09:58:29" },
            { "id": "31", "name": "Underground Drills and Bolter", "parentId": "4", "createdAt": "2019-11-12 09:58:35", "updatedAt": "2019-11-12 09:58:35" },
            { "id": "32", "name": "Water Bowser", "parentId": "4", "createdAt": "2019-11-12 09:58:41", "updatedAt": "2019-11-12 09:58:41" },
            { "id": "33", "name": "Water Pump", "parentId": "4", "createdAt": "2019-11-12 09:58:46", "updatedAt": "2019-11-12 09:58:46" },
            { "id": "34", "name": "Wheel Dozer", "parentId": "4", "createdAt": "2019-11-12 09:58:52", "updatedAt": "2019-11-12 09:58:52" },
            { "id": "35", "name": "Wheel Loader", "parentId": "4", "createdAt": "2019-11-12 09:58:57", "updatedAt": "2019-11-12 09:58:57" },
            { "id": "36", "name": "Other", "parentId": "4", "createdAt": "2019-11-12 09:59:08", "updatedAt": "2019-11-12 09:59:08" },
            { "id": "37", "name": "Cutters and Shredder", "parentId": "7", "createdAt": "2019-11-12 10:01:00", "updatedAt": "2019-11-12 10:01:00" },
            { "id": "38", "name": "Harvesting Equipment", "parentId": "7", "createdAt": "2019-11-12 10:01:06", "updatedAt": "2019-11-12 10:01:06" },
            { "id": "39", "name": "Hay and Forage Equipment", "parentId": "7", "createdAt": "2019-11-12 10:01:14", "updatedAt": "2019-11-12 10:01:14" },
            { "id": "40", "name": "Planting Equipment", "parentId": "7", "createdAt": "2019-11-12 10:01:21", "updatedAt": "2019-11-12 10:01:21" },
            { "id": "41", "name": "Precision Agriculture Technology", "parentId": "7", "createdAt": "2019-11-12 10:01:26", "updatedAt": "2019-11-12 10:01:26" },
            { "id": "42", "name": "Scraper Systems", "parentId": "7", "createdAt": "2019-11-12 10:01:32", "updatedAt": "2019-11-12 10:01:32" },
            { "id": "43", "name": "Seeding Equipment", "parentId": "7", "createdAt": "2019-11-12 10:01:38", "updatedAt": "2019-11-12 10:01:38" },
            { "id": "44", "name": "Sprayers and Applicator", "parentId": "7", "createdAt": "2019-11-12 10:01:46", "updatedAt": "2019-11-12 10:01:46" },
            { "id": "45", "name": "Tillage Equipment", "parentId": "7", "createdAt": "2019-11-12 10:01:52", "updatedAt": "2019-11-12 10:01:52" },
            { "id": "46", "name": "Track Tractors", "parentId": "7", "createdAt": "2019-11-12 10:01:59", "updatedAt": "2019-11-12 10:01:59" },
            { "id": "47", "name": "Tractor Attachment", "parentId": "7", "createdAt": "2019-11-12 10:02:07", "updatedAt": "2019-11-12 10:02:07" },
            { "id": "48", "name": "Utility Vehicle", "parentId": "7", "createdAt": "2019-11-12 10:02:16", "updatedAt": "2019-11-12 10:02:16" },
            { "id": "49", "name": "Other", "parentId": "7", "createdAt": "2019-11-12 10:02:25", "updatedAt": "2019-11-12 10:02:25" },
            { "id": "50", "name": "Forest Machine", "parentId": "2", "createdAt": "2019-11-12 10:02:54", "updatedAt": "2019-11-12 10:02:54" },
            { "id": "51", "name": "Forwarder", "parentId": "2", "createdAt": "2019-11-12 10:03:00", "updatedAt": "2019-11-12 10:03:00" },
            { "id": "52", "name": "Skidder", "parentId": "2", "createdAt": "2019-11-12 10:03:04", "updatedAt": "2019-11-12 10:03:04" },
            { "id": "53", "name": "Wheel Loader", "parentId": "2", "createdAt": "2019-11-12 10:03:14", "updatedAt": "2019-11-12 10:03:14" },
            { "id": "54", "name": "Other", "parentId": "2", "createdAt": "2019-11-12 10:03:22", "updatedAt": "2019-11-12 10:03:22" },
            { "id": "55", "name": "Lifting Attachment", "parentId": "3", "createdAt": "2019-11-12 10:04:11", "updatedAt": "2019-11-12 10:04:11" },
            { "id": "56", "name": "Mobile Cranes", "parentId": "3", "createdAt": "2019-11-12 10:04:17", "updatedAt": "2019-11-12 10:04:17" },
            { "id": "57", "name": "Other", "parentId": "3", "createdAt": "2019-11-12 10:04:23", "updatedAt": "2019-11-12 10:04:23" },
            { "id": "58", "name": "Access Platform", "parentId": "8", "createdAt": "2019-11-12 10:05:08", "updatedAt": "2019-11-12 10:05:08" },
            { "id": "59", "name": "Forklift", "parentId": "8", "createdAt": "2019-11-12 10:05:14", "updatedAt": "2019-11-12 10:05:14" },
            { "id": "60", "name": "Order Picker", "parentId": "8", "createdAt": "2019-11-12 10:05:21", "updatedAt": "2019-11-12 10:05:21" },
            { "id": "61", "name": "Pallet Stacker", "parentId": "8", "createdAt": "2019-11-12 10:05:27", "updatedAt": "2019-11-12 10:05:27" },
            { "id": "62", "name": "Pallet Truck", "parentId": "8", "createdAt": "2019-11-12 10:05:33", "updatedAt": "2019-11-12 10:05:33" },
            { "id": "63", "name": "Telehandler", "parentId": "8", "createdAt": "2019-11-12 10:05:38", "updatedAt": "2019-11-12 10:05:38" },
            { "id": "64", "name": "Utility Vehicle", "parentId": "8", "createdAt": "2019-11-12 10:05:43", "updatedAt": "2019-11-12 10:05:43" },
            { "id": "65", "name": "Other", "parentId": "8", "createdAt": "2019-11-12 10:05:50", "updatedAt": "2019-11-12 10:05:50" },
            { "id": "66", "name": "Abnormal Loading Truck", "parentId": "6", "createdAt": "2019-11-12 10:07:15", "updatedAt": "2019-11-12 10:07:15" },
            { "id": "67", "name": "Bakkie", "parentId": "6", "createdAt": "2019-11-12 10:07:23", "updatedAt": "2019-11-12 10:07:23" },
            { "id": "68", "name": "Bulk Liquid Tanker", "parentId": "6", "createdAt": "2019-11-12 10:07:30", "updatedAt": "2019-11-12 10:07:30" },
            { "id": "69", "name": "Curtain-side Truck", "parentId": "6", "createdAt": "2019-11-12 10:07:37", "updatedAt": "2019-11-12 10:07:37" },
            { "id": "70", "name": "Delivery Van", "parentId": "6", "createdAt": "2019-11-12 10:07:43", "updatedAt": "2019-11-12 10:07:43" },
            { "id": "71", "name": "Dropside Truck", "parentId": "6", "createdAt": "2019-11-12 10:07:49", "updatedAt": "2019-11-12 10:07:49" },
            { "id": "72", "name": "End Tipper", "parentId": "6", "createdAt": "2019-11-12 10:07:55", "updatedAt": "2019-11-12 10:07:55" },
            { "id": "73", "name": "Refrigerated Truck", "parentId": "6", "createdAt": "2019-11-12 10:08:00", "updatedAt": "2019-11-12 10:08:00" },
            { "id": "74", "name": "Semi-truck and Trailer", "parentId": "6", "createdAt": "2019-11-12 10:08:09", "updatedAt": "2019-11-12 10:08:09" },
            { "id": "75", "name": "Side Tipper", "parentId": "6", "createdAt": "2019-11-12 10:08:15", "updatedAt": "2019-11-12 10:08:15" },
            { "id": "76", "name": "Other", "parentId": "6", "createdAt": "2019-11-12 10:08:24", "updatedAt": "2019-11-12 10:08:24" },
            { "id": "77", "name": "Bus", "parentId": "1", "createdAt": "2019-11-12 10:23:06", "updatedAt": "2019-11-12 10:23:06" },
            { "id": "78", "name": "Mini-bus", "parentId": "1", "createdAt": "2019-11-12 10:23:19", "updatedAt": "2019-11-12 10:23:19" },
            { "id": "79", "name": "Motorbike", "parentId": "1", "createdAt": "2019-11-12 10:23:28", "updatedAt": "2019-11-12 10:23:28" },
            { "id": "80", "name": "Passenger Car", "parentId": "1", "createdAt": "2019-11-12 10:23:37", "updatedAt": "2019-11-12 10:23:37" },
            { "id": "81", "name": "Scooter", "parentId": "1", "createdAt": "2019-11-12 10:23:42", "updatedAt": "2019-11-12 10:23:42" },
            { "id": "82", "name": "Other", "parentId": "1", "createdAt": "2019-11-12 10:24:34", "updatedAt": "2019-11-12 10:24:34" },
            { "id": "83", "name": "Boat", "parentId": "9", "createdAt": "2019-11-12 10:25:27", "updatedAt": "2019-11-12 10:25:27" },
            { "id": "84", "name": "Camper", "parentId": "9", "createdAt": "2019-11-12 10:25:33", "updatedAt": "2019-11-12 10:25:33" },
            { "id": "85", "name": "Jetski", "parentId": "9", "createdAt": "2019-11-12 10:25:38", "updatedAt": "2019-11-12 10:25:38" },
            { "id": "86", "name": "Light-vehicle Trailer", "parentId": "9", "createdAt": "2019-11-12 10:25:46", "updatedAt": "2019-11-12 10:25:46" },
            { "id": "87", "name": "Motorbike", "parentId": "9", "createdAt": "2019-11-12 10:25:52", "updatedAt": "2019-11-12 10:25:52" },
            { "id": "88", "name": "Off-road Buggie", "parentId": "9", "createdAt": "2019-11-12 10:25:59", "updatedAt": "2019-11-12 10:25:59" },
            { "id": "89", "name": "Off-road Trailer", "parentId": "9", "createdAt": "2019-11-12 10:26:07", "updatedAt": "2019-11-12 10:26:07" },
            { "id": "90", "name": "Quadcycle", "parentId": "9", "createdAt": "2019-11-12 10:26:11", "updatedAt": "2019-11-12 10:26:11" },
            { "id": "91", "name": "Safari Vehicle", "parentId": "9", "createdAt": "2019-11-12 10:26:17", "updatedAt": "2019-11-12 10:26:17" },
            { "id": "92", "name": "Other", "parentId": "9", "createdAt": "2019-11-12 10:26:43", "updatedAt": "2019-11-12 10:26:43" },
            { "id": "93", "name": "Power Generators", "parentId": "5", "createdAt": "2019-11-12 13:19:38", "updatedAt": "2019-11-12 13:19:38" },
            { "id": "94", "name": "Other", "parentId": "5", "createdAt": "2019-11-12 13:19:43", "updatedAt": "2019-11-12 13:19:43" },
            { "id": "95", "name": "sdfdsf", "parentId": "1", "createdAt": "2019-11-12 23:06:32", "updatedAt": "2019-11-12 23:06:32" }
        ]);


    }
}