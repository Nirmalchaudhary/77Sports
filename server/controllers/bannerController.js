const { Banner } = require('../models');

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['order', 'ASC']]
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    await banner.update(req.body);
    res.json(banner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    await banner.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 