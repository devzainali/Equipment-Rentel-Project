const auth = require('../../../../middleware/auth');
const admin = require('../../../../middleware/admin');
const { validate, validateCategory, validateDelete } = require('../../../../src/validations/admin/category/category');

var fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/category/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);

    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


const express = require('express');
const router = express.Router();

const Category = require('../../../../src/models/admin/categories/categories');
const SubCategory = require('../../../../src/models/admin/categories/subcategories');
//Category.belongsTo(Category,{foreignKey: 'id'});
Category.hasMany(SubCategory, { foreignKey: 'parentId' });

router.get('/categories/all', async (req, res) => {
    Category.
        findAndCountAll()
        .then(function (Category) {
            res.status(200).json({
                message: "categories",
                data: Category,
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });
});

router.get('/subcategories/all', async (req, res) => {
    if (!req.query.ID) {

        res.status(403).json({
            error: 'Validation Error Occur',
            message: "ID is required"
        })

    }
    SubCategory.
        findAndCountAll({
            where: {
                parentId: req.query.ID
            }
        })
        .then(function (SubCategory) {
            res.status(200).json({
                message: "SubCategories",
                data: SubCategory,
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });
});


router.get('/', async (req, res) => {

    Category.findAndCountAll({
        include: [{ model: SubCategory, }]
    }).then(Category => {
        res.status(200).json({
            message: "Categories",
            data: Category
        });
    }).catch(function (err) {
        res.status(500).json({
            message: "Some error occur",
            data: err.message
        });
    });



});

// add category
router.post('/', upload.single('Image'), [auth, admin], async (req, res) => {

    //console.log(req.file);
    let image = '';

    if (!req.file) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: "Image is required"
        })
    } else {
        let name = req.file.path;
        image = name.replace("uploads/", "");
    }


    let output
    var category = {
        "name": req.body.name,
        //  "Image":req.file
    }

    const { error } = validate(category);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })

        if (req.file) {
            //delete recently uploaded file
            if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                // delete file named 
                fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }

        }


    } else {

        Category.findOrCreate({
            where: {
                name: req.body.name.trim(),
            },
            defaults: { // set the default properties if it doesn't exist
                name: req.body.name.trim(),
                Image: image
            }
        }).then(function (result) {
            var categoryObject = result[0], // the instance of the author
                created = result[1]; // boolean stating if it was created or not

            if (!created) { // false if author already exists and was not created.
                res.status(302).json({
                    message: "Category is already exist with same name ",
                    data: categoryObject
                });
                if (req.file) {
                    //delete recently uploaded file
                    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                        // delete file named 
                        fs.unlink(req.file.path, function (err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('File deleted!');
                        });
                    }

                }

            }

            res.status(200).json({
                message: "Category is added successfully",
                data: categoryObject
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });
    }




});


//update category
router.put('/', upload.single('Image'), [auth, admin], async (req, res) => {
    let image = '';

    var category = {
        "name": req.body.name,
    }

    const { error } = validate(category);

    if (error) {

        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })

        if (req.file) {
            //delete recently uploaded file
            if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                // delete file named 
                fs.unlink(req.file.path, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }

        }



    } else {

        //inserting data in db
        Category.findOne({ where: { id: req.body.ID, } })
            .then(function (Category) {

                if (!Category) {
                    res.status(404).json({
                        message: "No such Category Exist to update",
                        data: []
                    });
                }

                // Check if record exists in db
                if (Category) {

                    if (!req.file) {
                        //console.log('file not comes');
                        image = Category.image;
                    } else {
                        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
                            let name = req.file.path;
                            image = name.replace("uploads/", "");
                            // delete file named 
                            fs.unlink('uploads/' + Category.image, function (err) {
                                console.log('uploads/' + Category.image);
                                if (err) {
                                    console.log('File NOT deleted!');
                                }
                                // if no error, file has been deleted successfully
                                console.log('File deleted!');
                            });
                        } else {
                            res.status(403).json({
                                message: "Validation error occur",
                                error: 'only These Types of images accepted here( jpeg|png|jpg )'
                            });
                        }

                    }




                    //check for images comes or not
                    //check for images comes or not
                    Category.update({
                        "name": req.body.name,
                        "Image": image
                    })
                        .then(function (Category) {
                            res.status(200).json({
                                message: "Category is Successfully updated",
                                data: Category
                            });

                        })
                }
            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });

    }


});




//add sub category
router.post('/subcategory', [auth, admin], async (req, res) => {

    let output
    var subcategory = {
        "name": req.body.name,
        "parentId": req.body.parentId,
    }

    const { error } = validateCategory(subcategory);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        SubCategory.findOrCreate({
            where: {
                name: req.body.name.trim(),
                parentId: req.body.parentId.trim(),
            },
            defaults: { // set the default properties if it doesn't exist
                name: req.body.name.trim(),
                parentId: req.body.parentId.trim(),
            }
        }).then(function (result) {
            var subcategories = result[0], // the instance of the author
                created = result[1]; // boolean stating if it was created or not

            if (!created) { // false if author already exists and was not created.
                res.status(302).json({
                    message: "subCategory is already exist with same same parent and name",
                    data: subcategories
                });
            }

            res.status(200).json({
                message: "subCategory is added successfully",
                data: subcategories
            });

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                data: err.message
            });
        });
    }
});

//update subcategory
router.put('/subcategory', async (req, res) => {


    var subcategory = {
        "name": req.body.name,
    }

    const { error } = validate(subcategory);

    if (error) {

        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {

        //inserting data in db
        SubCategory.findOne({ where: { id: req.body.ID, } })
            .then(function (SubCategory) {

                if (!SubCategory) {
                    res.status(404).json({
                        message: "No such Category Exist to update",
                        data: []
                    });
                }

                // Check if record exists in db
                if (SubCategory) {
                    //check for images comes or not
                    //check for images comes or not
                    SubCategory.update({
                        "name": req.body.name,
                    })
                        .then(function (SubCategory) {
                            res.status(200).json({
                                message: "subcategory is Successfully updated",
                                data: SubCategory
                            });

                        })
                }
            }).catch(function (err) {
                res.status(500).json({
                    message: "Some error occur",
                    data: err.message
                });
            });

    }


});


//deleting record
router.delete('/subcategories/delete', [auth, admin], async (req, res) => {

    var sub = {
        "ID": req.body.ID,
    }

    const { error } = validateDelete(sub);
    if (error) {
        res.status(403).json({
            error: 'Validation Error Occur',
            message: error.details[0].message
        })
    } else {


        SubCategory.destroy({
            where: {
                id: req.body.ID,
            }
        }).then(function (SubCategory) {
            if (SubCategory === 1) {

                res.status(200).json({
                    message: "Deleted Successfully",
                    data: true
                });
            } else {
                res.status(404).json({
                    message: "No Such Faq Exist to delete",
                    data: false
                });

            }

        }).catch(function (err) {
            res.status(500).json({
                message: "Some error occur",
                error: err.message
            });
        });

    }

});


module.exports = router; 