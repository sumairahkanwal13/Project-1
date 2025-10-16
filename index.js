const express = require("express");
const app = express();
const cors = require("cors");

const Products = require("./models/product.models");
const Category = require("./models/category.models");
const Whishlist = require("./models/wishList.models")
const Cart = require("./models/cart.models");
const Address = require("./models/address.models");
const Order = require("./models/order.models")
const { initializeDatabase } = require("./DB/DB.Connect");
const { get } = require("http");


app.use(express.json())
initializeDatabase();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//1. Create new product
async function createNewProduct(newProduct) {
    try{
     const product = new Products(newProduct);
     const saveProduct = await product.save()
     return saveProduct;
    }catch(error){
        console.log(error)
    }
};

app.post("/api/products",async (req, res) => {
    try{
      const savedProduct = await createNewProduct(req.body)
      res.status(201).json({message: "Product added successfully.", data:savedProduct})
    }catch (error){
        res.status(500).json({error: "Failed to add new product."})
    }
});

//2. Get all products.
async function getAllProducts(){
    try{
     const allProduct = await Products.find().populate("category")
     return allProduct
    }catch(error){
        console.log(error)
    }
}

app.get("/api/products", async(req, res) => {
    try{
      const  product = await getAllProducts();
      if(product.length > 0){
        res.json(product)
      }else {
        res.status(404).json({message: "No product found."})
      }
    }catch(error){
        res.status(500).json({error: "Failed to get product."})
    }
});

//3. Get product By Id.
async function readProductById(productId){
  try{
   const productById = await Products.findById(productId).populate("category");
   return productById
  }catch(error){
    console.log(error)
  }
};

app.get("/api/products/:productId", async(req, res) => {
    try{
      const product = await  readProductById(req.params.productId);
      if(product){
        res.json(product)
      }else{
        res.status(404).json({message: "product not found."})
      }
    }catch(error){
        res.status(500).json({error: "Failed to get product by id."})
    }
})


// Category Routes//

// 1. create new category.

async function createNewCategory(newCategory) {
  try{
    const category = new Category(newCategory)
    const saveCategory =  await category.save();
    return saveCategory;
  }catch(error){
    console.log(error)
  }
};

app.post("/api/categories", async(req, res) => {
  try{
   const category = await createNewCategory(req.body);
   res.status(201).json({message: "Category added successfully.", data: category})
  }catch(error){
    res.status(500).json({error: "Failed to add new category."})
  }
});

//2. Get All Categories.
async function readAllCategories(){
  try{
   const allCategories = await Category.find()
   return allCategories
  }catch(error){
    console.log(error)
  }
};

app.get("/api/categories", async(req, res) => {
  try{
   const category = await readAllCategories();
   if(category.length > 0){
    res.json(category)
   }else{
    res.status(404).json({message: "No category found."})
   }
  }catch(error){
    res.status(500).json({error: "Failed to get all categories."})
  }
});

//3. Get category through id.
async function readCategoryById(categoryId){
  try{
    const categoryById = await Category.findById(categoryId)
    return categoryById;
  }catch(error){
    console.log(error)
  }
};

app.get("/api/categories/:categoryId", async(req,res) => {
  try{
   const category = await readCategoryById(req.params.categoryId);
   if(category){
     res.json(category)
   }else{
    res.status(404).json({message: "Category not found."})
   }
  }catch(error){
    res.status(500).json({error: "Failed to get category through id."})
  }
})

// ............... Whishlist Routes ..........//

//1. Create new wishlis.
async function createNewWishlist(newWishlist){
  try{
    const wishlist = new Whishlist(newWishlist);
    const saveWishlist = await wishlist.save()
    return saveWishlist
  }catch(error){
    console.log(error)
  }
};

app.post("/api/wishlist", async(req,res) => {
  try{
   const wishList = await createNewWishlist(req.body);
   res.status(201).json({message: "Wishlist created successfully", data:wishList })
  }catch(error){
    res.status(500).json({error: "Failed to create new wishlist."})
  }
})

//2. Get all wishlist items.
async function readAllWishlist() {
  try{
  const allWishlist = await Whishlist.find()
  return allWishlist;
  }catch(error){
    console.log(error)
  }
}

app.get("/api/wishlist", async(req, res) => {
  try{
   const wishlist = await readAllWishlist();
   if(wishlist.length > 0){
    res.json(wishlist)
   }else{
    res.status(404).json({message: "Wishlist not found."})
   }
  }catch(error){
    res.status(500).json({error: "Failed to get wishlist."})
  }
});

//3. Get wishlist through id.
async function getWishlistById(userId){
  try{
  const wishlisById = await Whishlist.findOne({userId}).populate("products");
  return wishlisById
  }catch(error){
    console.log(error)
  }
}

app.get("/api/wishlist/:userId", async(req,res) => {
  try{
    const wishlis = await getWishlistById(req.params.userId);
    if(wishlis){
     res.json(wishlis)
    }else{
      res.status(404).json({message: "Wishlist not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to get wishlist through id."})
  }
});


// --------------- Cart Routes ------------------

//1. create new cart.
async function createNewCart(newCart){
  try{
  const cart = new Cart(newCart);
  const saveCart = await cart.save();
  return saveCart;
  }catch(error){
    console.log(error);
  }
};

app.post("/api/carts", async(req, res) => {
  try{
   const cart = await createNewCart(req.body);
   res.status(201).json({message: "Cart created successfully.", data: cart})
  }catch(error){
    res.status(500).json({error: "Failed to create new cart."})
  }
});

//2. Get all Cart items;
async function readAllCartItems(){
  try{
  const allCart = await Cart.find();
  return allCart;
  }catch(error){
    console.log(error);
  }
};

app.get("/api/carts", async(req, res) => {
  try{
   const cart = await readAllCartItems()
   if(cart.length > 0){
    res.json(cart)
   }else{
    res.status(404).json({message: "Cart not found."})
   }
  }catch(error){
    res.status(500).json({message: "Failed to get all cart items."})
  }
})

//3. Get cart through id.
async function getCartById(userId){
  try{
    const cartById = await Cart.findOne({ userId }).populate("items.product");
    return cartById
  }catch(error){
    console.log(error)
  }
};

app.get("/api/carts/:userId", async(req, res) => {
  try{
   const cart = await getCartById(req.params.userId);
   if(cart){
    res.json(cart)
   }else{
    res.status(404).json({message: "item not found."})
   }
  }catch(error){
    console.log(error)
  }
})


// ---------------- Address Routes ------------

//1. Create new Address
async function createNewAddress(newAddress) {
  try{
   const address = new Address(newAddress);
   const saveAddress = await address.save();
   return saveAddress;
  }catch(error){
    console.log(error)
  }
};

app.post("/api/addresses", async(req,res) => {
  try{
   const address = await createNewAddress(req.body);
   res.status(201).json({message: "Address created successfully.", data: address})
  }catch(error){
    res.status(500).json({error: "Failed to create new address."})
  }
});

//2. Get all address.
async function readAllAddress(){
  try{
   const address = await Address.find()
   return address;
  }catch (error){
    console.log(error)
  }
};

app.get("/api/addresses", async(req,res) => {
  try{
    const address = await readAllAddress()
    if(address.length > 0){
      res.json(address)
    }else{
      res.status(404).json({message: "Address not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to get all addresses."})
  }
})

//3. Get Address through id.
async function getAddressById(userId){
  try{
   const addressById = await Address.findOne({userId})
   return addressById 
  }catch(error){
    console.log(error)
  }
}

app.get("/api/addresses/:userId", async(req, res) => {
  try{
  const address = await getAddressById(req.params.userId);
  if(address){
    res.json(address)
  }else {
    res.status(404).json({message: "Address not found."})
  }
  }catch(error){
    res.status(500).json({error: "Failed to get address through id."})
  }
});



//4. Delete by Id.
async function deleteAddress(addressId){
  try{
  const deletedAddress = await Address.findByIdAndDelete(addressId)
  return deletedAddress
  }catch(error){
    console.log(error)
  }
};

app.delete("/api/addresses/:addressId", async(req, res) => {
  try{
  const deletedAddress = await deleteAddress(req.params.addressId);
  if(deletedAddress){
    res.status(200).json({message: "Address deleted successfully."})
  }
  }catch(error){
    res.status(500).json({error: "Failed to delete the address."})
  }
})

// ---------------- Order Routes ----------------

//1. Create new order.
async function createNewOrder(newOrder){
  try{
   const order = new Order(newOrder)
   const saveOrder = await order.save();
   return saveOrder;
  }catch(error){
    console.log(error)
  }
};

app.post("/api/orders", async(req,res) => {
  try{
   const order = await createNewOrder(req.body);
   res.status(201).json({message: "Order created successfully.", data: order});
  }catch(error){
    res.status(500).json({error: "Failed to create new order."})
  }
});

//2. Get all Orders.
async function readAllOrder() {
  try{
  const allOrder = await Order.find()
  return allOrder;
  }catch(error){
    console.log(error)
  }
};

app.get("/api/orders", async(req,res) => {
  try{
    const order = await readAllOrder();
    if(order.length > 0){
      res.json(order)
    }else{
      res.status(404).json({message: "Order not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to get orders."})
  }
});

//3. Get Oders through id.
async function getOrderById(userId){
  try{
   const orderByUser = await  Order.findOne({userId}).populate("items.product");
   return orderByUser
  }catch(error){
    console.log(error)
  }
};

app.get("/api/orders/:userId", async(req,res) => {
  try{
  const order = await getOrderById(req.params.userId);
  if(order){
    res.json(order)
  }else{
    res.status(404).json({message: "Order not found."})
  }
  }catch(error){
    res.status(500).json({error: "Failed to get order through id."})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});