const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const _extend = require('lodash/extend');
const { IncomingForm } = require('formidable');

const Product = require('../models/product.model');

// helper
const { BadRequest400 } = require('../helpers/bad-request.error');
const { Unauthorized401 } = require('../helpers/unauthorized.error');
const { Forbidden403 } = require('../helpers/forbidden.error');
const { NotFound404 } = require('../helpers/not-found.error');

const create = async (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    return next(new BadRequest400('invalid form @createProd'));
  }

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 // 2mb
  });

  return form.parse(req, async (err, fields, files) => {
    if (err) return next(err);

    try {
      const product = new Product(fields);
      product.shop = req.shop._id;

      if (files.image) {
        if (files.image?.size > 1000000) {
          return next(new BadRequest400('max 2mb image size '));
        }
        product.image.data = fs.readFileSync(files.image.path);
        product.image.contentType = files.image.type;
      }
      const result = await product.save();

      if (!result) {
        return next(new BadRequest400('invalid product @createProd'));
      }

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  });
};

const list = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.search) {
      query.name = {
        $regex: req.query.search,
        $options: 'i'
      };
    }
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    const products = await Product.find(query)
      .populate({ path: 'shop', select: 'name' })
      .select('-image')
      .lean()
      .exec();

    if (!products?.length) {
      return next(new NotFound404('no products @listProds'));
    }

    return res.json(products);
  } catch (err) {
    return next(err);
  }
};

const read = (req, res, next) => {
  const prod = req.product.toObject();

  prod.image = undefined;

  return res.json(prod);
};

const update = (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    return next(new BadRequest400('invalid form @createProd'));
  }

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 // 2mb
  });

  return form.parse(req, async (err, fields, files) => {
    if (err)
      return next(new BadRequest400('photo cant be uploaded @updateProd'));

    try {
      let prod = req.product;
      prod = _extend(prod, fields);

      if (files.image) {
        prod.image.data = fs.readFileSync(files.image.path);
        prod.image.contentType = files.image.type;
      }

      const result = await prod.save();

      if (!result) {
        return next(new BadRequest400('invalid update @updProd'));
      }

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });
};

const remove = async (req, res, next) => {
  try {
    const prod = req.product;

    if (!prod) return next(new NotFound404('no product @delProd'));

    const deletedProduct = await prod.deleteOne();

    return res.json(deletedProduct);
  } catch (err) {
    return next(err);
  }
};

const productById = async (req, res, next, prodId) => {
  try {
    if (!prodId || !mongoose.isValidObjectId(prodId)) {
      return next(new BadRequest400('valid id is required @prodById'));
    }

    // console.log(prodId)

    const product = await Product.findById(prodId)
      .populate({ path: 'shop', select: 'name' })
      .exec();

    if (!product) return next(new NotFound404('Product not found'));

    // mount
    req.product = product;
    // must
    return next();
  } catch (err) {
    return next(err);
  }
};

const listLatest = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate({ path: 'shop', select: '_id name' })
      .sort({ created: 'desc' })
      .limit(5)
      .lean()
      .exec();

    if (!products?.length) {
      return next(new NotFound404('no products @listLatest'));
    }

    return res.json(products);
  } catch (err) {
    return next(err);
  }
};

const listByShop = async (req, res, next) => {
  try {
    const products = await Product.find({ shop: req.shop._id })
      .populate({ path: 'shop', select: 'name' })
      .select('-image')
      .lean()
      .exec();

    if (!products?.length) {
      return next(new NotFound404('no products @listByShop'));
    }

    return res.json(products);
  } catch (err) {
    return next(err);
  }
};

const listCategories = async (req, res, next) => {
  try {
    const products = await Product.distinct('category', {})
      .lean()
      .exec();

    if (!products?.length) {
      return next(new NotFound404('no products @listCategories'));
    }

    return res.json(products);
  } catch (err) {
    return next(err);
  }
};

const listRelated = async (req, res, next) => {
  try {
    const products = await Product.find({
      _id: { $ne: req.product },
      category: req.product.category
    })
      .populate({ path: 'shop', select: 'name' })
      .limit(5)
      .lean()
      .exec();

    if (!products?.length) {
      return next(new NotFound404('no products @listRelated'));
    }

    return res.json(products);
  } catch (err) {
    return next(err);
  }
};

const photo = (req, res, next) => {
  const { image } = req.product;

  if (image?.data) {
    res.set('Content-Type', image.contentType);
    return res.send(image.data);
  }

  return next();
};

const defaultPhoto = (req, res, next) => {
  return res.sendFile(
    path.resolve(__dirname, '..', 'dist', 'img', 'default.jpg')
  );
};

const decreaseQuantity = async (req, res, next) => {
  console.log('dec');

  next();
};
const increaseQuantity = async (req, res, next) => {
  console.log('inc');

  next();
};

module.exports = {
  create,
  list,
  read,
  update,
  remove,
  listByShop,
  listLatest,
  listCategories,
  listRelated,
  productById,
  photo,
  decreaseQuantity,
  increaseQuantity,
  defaultPhoto
};
