import Menu from '../models/Menu.js';

export const getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find().sort({ ordem: 1, createdAt: 1 });
    res.json(menus);
  } catch (err) { next(err); }
};

export const createMenu = async (req, res, next) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (err) { next(err); }
};

export const updateMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu não encontrado' });
    Object.assign(menu, req.body);
    await menu.save();
    res.json(menu);
  } catch (err) { next(err); }
};

export const deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu não encontrado' });
    await Menu.deleteMany({ parentId: req.params.id });
    res.json({ message: 'Menu deletado com sucesso' });
  } catch (err) { next(err); }
};
