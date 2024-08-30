const express = require('express');
const upload = require('../middleware/multer');
const { SignUp, SignIn } = require('../controllers/userController');
const { ensureAuthorization, ensureAdmin } = require('../middleware/auth');
const { UpdateCategory, DeleteCategory, GetAllCategories, Createcategory } = require('../controllers/catagoryController');
const { CreateProduct, UpdateProduct, DeleteProduct, GetAllProducts, GetProductById, productCategoryController } = require('../controllers/ProductController');
const router = express.Router();

// User signup route
router.post("/signUp", SignUp);

// User signin route
router.post("/signIn", SignIn);

// Protected route accessible only to authorized users
router.get("/protected", ensureAuthorization, (req, res) => {
    res.status(200).json({ ok: true });
});

// Admin route accessible only to authorized admins
router.get("/admin", ensureAuthorization, ensureAdmin, (req, res) => {
    res.status(200).json({ ok: true });
});

// Create category route for admin with file upload
router.post("/create", upload.single('picture'), ensureAuthorization, ensureAdmin, Createcategory);
router.get("/get", ensureAuthorization, GetAllCategories);
router.put("/update/:id", upload.single('picture'), ensureAuthorization, ensureAdmin, UpdateCategory);
router.delete("/delete/:id", ensureAuthorization, ensureAdmin, DeleteCategory);

// Create a new product
router.post('/product/create', upload.single('picture'), ensureAuthorization, ensureAdmin, Createcategory);


router.post('/product', ensureAuthorization, CreateProduct);
router.get('/product/all', ensureAuthorization, GetAllProducts);

// Get a single product by ID
// router.get('/product/:id', ensureAuthorization, GetProductById);

// Update a product by ID
router.put('/product/:id', upload.single('picture'), ensureAuthorization, ensureAdmin, UpdateProduct);

// Delete a product by ID
router.delete('/product/:id', ensureAuthorization, ensureAdmin, DeleteProduct);

// router.get('/product/get', ensureAuthorization, productCategoryController);


module.exports = router;
