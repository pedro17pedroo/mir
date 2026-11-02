import mongoose from 'mongoose';

const LivestreamSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, default: '' },
  pregador: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  url: { type: String },
  urlVideo: { type: String },
  data: { type: Date, default: Date.now },
  plataforma: { type: String, default: 'youtube' }, // youtube, facebook, instagram
  aoVivo: { type: Boolean, default: false },
  ativa: { type: Boolean, default: true },
  status: { type: String, enum: ['ativa', 'finalizada'], default: 'ativa' }
}, { timestamps: true });

LivestreamSchema.pre('validate', function(next) {
  if (this.urlVideo && !this.url) {
    this.url = this.urlVideo;
  } else if (this.url && !this.urlVideo) {
    this.urlVideo = this.url;
  }
  if (this.isModified('ativa') && !this.isModified('status')) {
    this.status = this.ativa ? 'ativa' : 'finalizada';
  } else if (this.isModified('status') && !this.isModified('ativa')) {
    this.ativa = this.status === 'ativa';
  }
  next();
});

export default mongoose.model('Livestream', LivestreamSchema);
