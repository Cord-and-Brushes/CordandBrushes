const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
   pageName: {
      type: String,
      required: true,
      enum: ['HomePage', 'BlogPage', 'ExhibitionPage', 'WorkshopPage', 'Offers'],
      message: 'Page name must be one of the following: Homepage, BlogPage, ExhibitionPage, WorkshopPage, Offers'
   },
   urls: [{
      type: String,
      required: true
   }]
});

module.exports = mongoose.model('BannerImages', bannerSchema);
