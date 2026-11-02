import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Importação de rotas
import memberRoutes from './routes/members.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menus.js';
import sectionRoutes from './routes/sections.js';
import themeRoutes from './routes/theme.js';
import contentRoutes from './routes/contents.js';
import donationRoutes from './routes/donations.js';
import livestreamRoutes from './routes/livestreams.js';
import newsletterRoutes from './routes/newsletters.js';
import testemunhoRoutes from './routes/testemunhos.js';
import eventoRoutes from './routes/eventos.js';
import mensagemRoutes from './routes/mensagens.js';
import videoRoutes from './routes/videos.js';
import audioRoutes from './routes/audios.js';
import contactRoutes from './routes/contact.js';
import sobreOPastorRoutes from './routes/sobreOPastor.js';
import servicosRoutes from './routes/servicos.js';
import paginaRoutes from './routes/paginas.js';
import ministerioRoutes from './routes/ministerios.js';
import oracaoRoutes from './routes/oracoes.js';
import visitanteRoutes from './routes/visitantes.js';
import escalaRoutes from './routes/escalas.js';
import cursoRoutes from './routes/cursos.js';
import avisoRoutes from './routes/avisos.js';
import galeriaRoutes from './routes/galeria.js';
import patrimonioRoutes from './routes/patrimonio.js';
import backupRoutes from './routes/backup.js';

// Validar variáveis de ambiente obrigatórias antes de conectar ao banco
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Variáveis de ambiente obrigatórias não definidas: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

await connectDB();

const app = express();

// Configurar CORS com origens permitidas
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true
}));

// Aumentar limite de payload para suportar conteúdo rico de páginas
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas
app.use('/api/sobre-pastor', sobreOPastorRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/livestreams', livestreamRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/testemunhos', testemunhoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/audios', audioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ministerios', ministerioRoutes);
app.use('/api/oracoes', oracaoRoutes);
app.use('/api/visitantes', visitanteRoutes);
app.use('/api/escalas', escalaRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/avisos', avisoRoutes);
app.use('/api/galeria', galeriaRoutes);
app.use('/api/patrimonio', patrimonioRoutes);
app.use('/api/backup', backupRoutes);

// Middleware de erro
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
