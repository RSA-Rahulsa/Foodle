// Load models and auth middleware
const Item = require("../models/item.model");
const Buyer = require("../models/buyer.model");
const Order = require("../models/order.model");

// Set up multer
// const multer = require("multer");
// const upload = multer({ dest: "./public/images/" }).single("image");

// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Get all the items for a specific vendor
exports.getItemsByVendor = async (req, res) => {
    try {
        const items = await Item.find({
            vendor_id: req.user
        });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Add an item to the database
exports.addItem = async (req, res) => {
    try {
        // Verify that the vendor hasn't already added an item with the same name
        const item = await Item.findOne({
            vendor_id: req.user,
            name: req.body.name
        });

        if (item) {
            return res.status(409).json({
                error: "Item has already been added by this vendor",
            });
        }

        // If an image file was uploaded, save it to the server
        let image = "";
        if (req.file) {
            image = req.file.filename;
        } else {
            image = "default.jpg";
        }

        // Create a new item
        const new_item = new Item({
            name: req.body.name,
            image: image,
            vendor_id: req.user,
            price: req.body.price,
            category: req.body.category,
            tags: req.body.tags.split(","),
        });

        // Save the item
        const saved_item = await new_item.save();
        return res.status(201).json(saved_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

exports.editItem = async (req, res) => {
    try {
        const item = await Item.findOne({
            vendor_id: req.user,
            name: req.body.original_name
        });

        if (!item) {
            return res.status(404).json({
                error: "Item not found",
            });
        }

        const duplicate_item = await Item.findOne({
            vendor_id: req.user,
            name: req.body.name
        });

        if (duplicate_item && req.body.original_name !== req.body.name) {
            return res.status(409).json({
                error: "Item with same name has already been added by this vendor",
            });
        }

        item.name = req.body.name;
        item.price = req.body.price;
        item.category = req.body.category;
        item.tags = req.body.tags.split(",");

        // If an image file was uploaded, save it to the server
        if (req.file) {
            item.image = req.file.filename;
        }

        const saved_item = await Item.findByIdAndUpdate(item._id, item, {
            new: true
        });

        return res.status(200).json(saved_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Remove an item from the database
exports.deleteItem = async (req, res) => {
    try {
        const orders = await Order.find({
            item_id: req.body.item_id,
            state: { $in: ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP"] } 
        });
        if(orders.length>0) {
            return res.status(409).json({
                error: "Item is currently a part of a placed order. Delete once the order is 'COMPLETED', or 'REJECTED'",
            });
        }
        else{
            const item = await Item.findByIdAndDelete(req.body.item_id);
            const order = await Order.deleteMany({
                item_id: req.body.item_id
            });
            const buyer = await Buyer.updateMany({
                favourite_items: {
                    $in: [req.body.item_id]
                }
            }, {
                $pull: {
                    favourite_items: req.body.item_id
                }
            });

            return res.status(200).json(item);
        }
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// Updating the rating of the item
exports.updateRating = async (req, res) => {
    try {
        const item = await Item.findById(req.body.item_id);

        item.rating.ratings.push(req.body.rating);
        item.rating.count++;

        const updated_item = await Item.findByIdAndUpdate(req.body.item_id, {
            $set: {
                rating: item.rating
            }
        }, {
            new: true
        });

        const updated_order = await Order.findByIdAndUpdate(req.body.order_id, {
            $set: {
                rating: req.body.rating
            }
        }, {
            new: true
        });

        return res.status(200).json({
            item: updated_item,
            order: updated_order
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}
