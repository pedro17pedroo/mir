import Video from '../models/Video.js';

export const getVideos = async (req, res, next) => {
  try {
    const { categoria, destaque } = req.query;
    const filter = { status: 'ativo' };
    
    if (typeof categoria === 'string' && categoria) filter.categoria = categoria;
    if (destaque !== undefined) filter.destaque = destaque === 'true';
    
    const videos = await Video.find(filter)
      .sort({ destaque: -1, dataPublicacao: -1, ordem: 1 });
    res.json(videos);
  } catch (err) { next(err); }
};

export const getVideoBySlug = async (req, res, next) => {
  try {
    const video = await Video.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { visualizacoes: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Vídeo não encontrado' });
    
    res.json(video);
  } catch (err) { next(err); }
};

export const createVideo = async (req, res, next) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (err) { next(err); }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ message: 'Vídeo não encontrado' });
    res.json(video);
  } catch (err) { next(err); }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Vídeo não encontrado' });
    res.json({ message: 'Vídeo deletado com sucesso' });
  } catch (err) { next(err); }
};
