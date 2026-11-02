import Livestream from '../models/Livestream.js';

export const getLivestreams = async (req, res, next) => {
  try {
    const streams = await Livestream.find().sort({ aoVivo: -1, data: -1, createdAt: -1 });
    res.json(streams);
  } catch (err) { next(err); }
};

export const createLivestream = async (req, res, next) => {
  try {
    if (req.body.aoVivo) {
      await Livestream.updateMany({}, { aoVivo: false });
    }
    const stream = new Livestream(req.body);
    await stream.save();
    res.status(201).json(stream);
  } catch (err) { next(err); }
};

export const updateLivestream = async (req, res, next) => {
  try {
    const stream = await Livestream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Transmissão não encontrada' });
    if (req.body.aoVivo) {
      await Livestream.updateMany({ _id: { $ne: stream._id } }, { aoVivo: false });
    }
    Object.assign(stream, req.body);
    await stream.save();
    res.json(stream);
  } catch (err) { next(err); }
};

export const deleteLivestream = async (req, res, next) => {
  try {
    const stream = await Livestream.findByIdAndDelete(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Transmissão não encontrada' });
    res.json({ message: 'Transmissão deletada com sucesso' });
  } catch (err) { next(err); }
};
