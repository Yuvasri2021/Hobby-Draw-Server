const Artwork = require('../models/Artwork');

exports.getAllArtworks = async (req, res) => {
  const arts = await Artwork.find();
  res.json(arts);
};

exports.getArtworkById = async (req, res) => {
  const art = await Artwork.findById(req.params.id);
  res.json(art);
};

exports.createArtwork = async (req, res) => {
  const newArt = await Artwork.create({ ...req.body, createdBy: req.userId });
  res.json(newArt);
};

exports.buyArtwork = async (req, res) => {
  const art = await Artwork.findById(req.params.id);
  if (!art || art.sold) return res.status(400).json({ message: 'Already sold' });

  art.sold = true;
  await art.save();
  res.json({ message: 'Purchased successfully' });
};
