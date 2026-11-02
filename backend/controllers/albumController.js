import Album from '../models/Album.js';

export const getAlbunsPublicos = async (req, res, next) => {
  try {
    const filter = { ativo: true };
    if (req.query.categoria) {
      filter.categoria = req.query.categoria;
    }
    const albuns = await Album.find(filter).sort({ destaque: -1, dataEvento: -1 });
    res.json(albuns);
  } catch (err) {
    next(err);
  }
};

export const getAlbunsAdmin = async (req, res, next) => {
  try {
    const albuns = await Album.find().sort({ dataEvento: -1, createdAt: -1 });
    res.json(albuns);
  } catch (err) {
    next(err);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum não encontrado' });
    res.json(album);
  } catch (err) {
    next(err);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { titulo, descricao, categoria, dataEvento, capa, fotos, destaque, ativo } = req.body;
    if (!titulo || !String(titulo).trim()) {
      return res.status(400).json({ message: 'O título do álbum é obrigatório' });
    }
    const album = new Album({
      titulo: String(titulo).trim(),
      descricao: descricao || '',
      categoria: categoria || 'Culto',
      dataEvento: dataEvento ? new Date(dataEvento) : new Date(),
      capa: capa || '',
      fotos: Array.isArray(fotos) ? fotos.filter((f) => f && f.url) : [],
      destaque: Boolean(destaque),
      ativo: ativo !== undefined ? Boolean(ativo) : true
    });
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    next(err);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum não encontrado' });

    const { titulo, descricao, categoria, dataEvento, capa, fotos, destaque, ativo } = req.body;
    if (titulo !== undefined) album.titulo = String(titulo).trim();
    if (descricao !== undefined) album.descricao = descricao;
    if (categoria !== undefined) album.categoria = categoria;
    if (dataEvento !== undefined) album.dataEvento = new Date(dataEvento);
    if (capa !== undefined) album.capa = capa;
    if (Array.isArray(fotos)) {
      album.fotos = fotos.filter((f) => f && f.url);
    }
    if (destaque !== undefined) album.destaque = Boolean(destaque);
    if (ativo !== undefined) album.ativo = Boolean(ativo);

    if (!album.capa && album.fotos.length > 0) {
      album.capa = album.fotos[0].url;
    }

    await album.save();
    res.json(album);
  } catch (err) {
    next(err);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum não encontrado' });
    res.json({ message: 'Álbum removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

