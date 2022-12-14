const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const _extend = require('lodash/extend');
const { IncomingForm } = require('formidable');

const Shop = require('../models/shop.model');
const Product = require('../models/product.model')

// const defaultImage = require('../dist/img/default.jpg')
// import defaultImage from '../dist/img/default.jpg';

// helper
const { BadRequest400 } = require('../helpers/bad-request.error');
const { Unauthorized401 } = require('../helpers/unauthorized.error');
const { Forbidden403 } = require('../helpers/forbidden.error');
const { NotFound404 } = require('../helpers/not-found.error');
const { isMongoObj } = require('../helpers/is-mongo-obj')

const list = async (req, res, next) => {
  try {
    const shops = await Shop.find()
      .lean()
      .exec();

    if (!shops) return next(new NotFound404('no shops @list-shop'));

    return res.json(shops);
  } catch (err) {
    return next(err);
  }
};

const listByOwner = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.profile._id })
      .populate({ path: 'owner', select: 'name' })
      .lean()
      .exec();

    if (!shops) return next(new NotFound404('no shops @list-by-owner'));

    return res.json(shops);
  } catch (err) {
    return next(err);
  }
};

const read = (req, res, next) => {
  if (!req.shop) return next(new NotFound404('no shop'));

  const shop = req.shop

  shop.image = undefined;

  return res.json(shop);
};

const create = (req, res, next) => {
  // only allowed 'multipar/form-data' (formidable)
  // reject 'json' and 'form-urlencoded'
  console.log(req.body)

  if (!req.is('multipart/form-data')) {
    return next(new BadRequest400('invalid form'));
  }

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 // 2mb
  });

  return form.parse(req, async (err, fields, files) => {
    if (err) return next(err);
    console.log({files}) // image
    console.log({fields}) // name, desc
    try {
      const shop = new Shop(fields);

      shop.owner = req.profile._id;

      if (files.image) {
        if (files.image?.size > 1000000) {
          return next(new BadRequest400('max 2mb image size '));
        }

        if(!files.image.filepath || !files.image.mimetype){
          return next(new BadRequest400('lack image info @createShop-file-image'))
        }

        shop.image.data = fs.readFileSync(files.image.filepath); // 'path' to 'filepath'
        shop.image.contentType = files.image.mimetype; // 'type' to 'mimetype'
      }

      const result = await shop.save();
      // console.log(isMongoObj(result))

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  });
};

const update = async (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    return next(new BadRequest400('invalid form @updShop'));
  }

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 // 2mb
  });

  return form.parse(req, async (err, fields, files) => {
    if (err) return next(err);

    try {
      let { shop } = req;

      shop = _extend(shop, fields);

      if (files.image) {
  
        if (files.image?.size > 1000000) {
          return next(new BadRequest400('max 2mb image size '));
        }

        if(!files.image.filepath || !files.image.mimetype){
          return next(new BadRequest400('lack image info @updShop-file-image'))
        }

        shop.image.data = fs.readFileSync(files.image.filepath); // 'path' to 'filepath'
        shop.image.contentType = files.image.mimetype; // 'type' to 'mimetype'
      }


      const result = await shop.save();

      if (!result) {
        return next(new BadRequest400('invalid update @updShop'));
      }

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });
};

const remove = async (req, res, next) => {
  try {
    const { shop } = req;

    if (!shop) return next(new NotFound404('shop not found @delShop'));
    // add cannot delete if has product
    // return 
    const product = await Product.findOne({shop: shop._id}).lean().exec()

    if(product){
      return next(new BadRequest400('shop has product'));
    }

    const deletedShop = shop.deleteOne();

    return res.json(deletedShop);
  } catch (err) {
    return next(err);
  }
};

const isOwner = (req, res, next) => {
  const { shop, auth } = req

  const isOwner = shop && auth && String(shop.owner?._id) === String(auth._id)

   if(!isOwner){
     return next(new Forbidden403('forbidden! not owner'))
   }

  // console.log('isOwner');
  return next();
};

const shopById = async (req, res, next, shopId) => {
  try {
    if (!shopId || !mongoose.isValidObjectId(shopId)) {
      return next(new BadRequest400('valid id is required @shopById'));
    }

    const shop = await Shop.findById(shopId)
      .populate({ path: 'owner', select: 'name' })
      .exec();

    if (!shop) return next(new NotFound404('Shop not found'));

    // mount
    req.shop = shop;
    // must
    return next();
  } catch (err) {
    return next(err);
  }
};

const photo = (req, res, next) => {
  const { image } = req.shop;

  if (image?.data) {
    res.set('Content-Type', image.contentType);
    return res.send(image.data);
  }

  console.log('no-photo');

  return next();
};

const defaultPhoto = async (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'img', 'default.jpg'));
};

module.exports = {
  list,
  listByOwner,
  read,
  create,
  update,
  remove,
  photo,
  defaultPhoto,
  isOwner,
  shopById
};
