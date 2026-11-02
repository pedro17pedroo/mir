import Audio from '../models/Audio.js';

export const getAudios = async (req, res, next) => {
  try {
    const { categoria, destaque } = req.query;
    const filter = { status: 'ativo' };
    
    if (typeof categoria === 'string' && categoria) filter.categoria = categoria;
    if (destaque !== undefined) filter.destaque = destaque === 'true';
    
    const audios = await Audio.find(filter)
      .sort({ destaque: -1, dataPublicacao: -1, ordem: 1 });
    res.json(audios);
  } catch (err) { next(err); }
};

export const getAudioBySlug = async (req, res, next) => {
  try {
    const audio = await Audio.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { reproducoes: 1 } },
      { new: true }
    );
    if (!audio) return res.status(404).json({ message: 'Áudio não encontrado' });
    
    res.json(audio);
  } catch (err) { next(err); }
};

export const createAudio = async (req, res, next) => {
  try {
    const audio = new Audio(req.body);
    await audio.save();
    res.status(201).json(audio);
  } catch (err) { next(err); }
};

export const updateAudio = async (req, res, next) => {
  try {
    const audio = await Audio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!audio) return res.status(404).json({ message: 'Áudio não encontrado' });
    res.json(audio);
  } catch (err) { next(err); }
};

export const deleteAudio = async (req, res, next) => {
  try {
    const audio = await Audio.findByIdAndDelete(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Áudio não encontrado' });
    res.json({ message: 'Áudio deletado com sucesso' });
  } catch (err) { next(err); }
};
