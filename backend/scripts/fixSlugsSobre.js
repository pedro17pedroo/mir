import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const pageSchema = new mongoose.Schema({
  titulo: String,
  slug: String,
  conteudo: String,
  ativo: Boolean
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

async function fixSlugs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Atualizar slugs das páginas "Sobre"
    const updates = [
      { oldSlug: 'ministerio', newSlug: 'sobre/ministerio' },
      { oldSlug: 'no-que-cremos', newSlug: 'sobre/no-que-cremos' },
      { oldSlug: 'presidente', newSlug: 'sobre/presidente' }
    ];

    for (const { oldSlug, newSlug } of updates) {
      const result = await Page.updateOne(
        { slug: oldSlug },
        { $set: { slug: newSlug } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Atualizado: ${oldSlug} → ${newSlug}`);
      } else {
        console.log(`⚠️  Não encontrado: ${oldSlug}`);
      }
    }

    console.log('\n✅ Slugs atualizados com sucesso!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixSlugs();
