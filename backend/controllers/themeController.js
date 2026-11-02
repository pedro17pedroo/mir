import Theme from '../models/Theme.js';

export const getTheme = async (req, res, next) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      theme = new Theme();
      await theme.save();
    }
    res.json(theme);
  } catch (err) { next(err); }
};

export const updateTheme = async (req, res, next) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      theme = new Theme(req.body);
    } else {
      Object.assign(theme, req.body);
    }
    await theme.save();
    res.json(theme);
  } catch (err) { next(err); }
};
