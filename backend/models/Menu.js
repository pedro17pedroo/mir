import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  url: { type: String },
  ordem: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
  // Personalização visual individual do item de menu/submenu
  corTexto: { type: String, default: '' },
  corFundo: { type: String, default: '' },
  destaque: { type: Boolean, default: false }, // Exibir como botão pill/destaque
  badge: { type: String, default: '' }, // Ex: "NOVO", "AO VIVO"
  corBadge: { type: String, default: '#ef4444' },
  abrirNovaAba: { type: Boolean, default: false },
  // Campos antigos mantidos para compatibilidade
  nome: { type: String },
  link: { type: String },
  ehDropdown: { type: Boolean, default: false },
  itensDropdown: [{ nome: String, link: String }]
}, { timestamps: true });

MenuSchema.index({ ativo: 1, parentId: 1, ordem: 1 });

MenuSchema.pre('validate', function(next) {
  if (this.nome && !this.titulo) {
    this.titulo = this.nome;
  } else if (this.titulo && !this.nome) {
    this.nome = this.titulo;
  }
  if (this.link && !this.url) {
    this.url = this.link;
  } else if (this.url && !this.link) {
    this.link = this.url;
  }
  next();
});

export default mongoose.model('Menu', MenuSchema);
