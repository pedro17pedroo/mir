import ContactInfo from '../models/ContactInfo.js';
import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

// Informações de Contato
export const getContactInfo = async (req, res, next) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    
    if (!contactInfo) {
      // Criar informações padrão se não existir
      contactInfo = await ContactInfo.create({
        endereco: {
          rua: 'Rua Exemplo, 123',
          cidade: 'Cidade',
          estado: 'Estado',
          cep: '00000-000',
          pais: 'Brasil'
        },
        localizacao: {
          latitude: -23.5505,
          longitude: -46.6333
        },
        telefones: [
          { tipo: 'principal', numero: '(00) 0000-0000' }
        ],
        emails: [
          { tipo: 'geral', email: 'contato@igrejamir.com' }
        ],
        horariosFuncionamento: [
          { dia: 'Domingo', horario: '09:00 - 12:00 e 18:00 - 21:00' },
          { dia: 'Quarta-feira', horario: '19:30 - 21:30' }
        ],
        redesSociais: {},
        mensagemBemVindo: 'Estamos à disposição para tirar suas dúvidas e orar por você.'
      });
    }
    
    res.json(contactInfo);
  } catch (err) {
    next(err);
  }
};

export const updateContactInfo = async (req, res, next) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    
    if (!contactInfo) {
      contactInfo = new ContactInfo(req.body);
    } else {
      Object.assign(contactInfo, req.body);
    }
    
    await contactInfo.save();
    res.json({ message: 'Informações atualizadas com sucesso', contactInfo });
  } catch (err) {
    next(err);
  }
};

// Mensagens de Contato
export const getContactMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const messages = await ContactMessage.find(filter)
      .populate('respondidoPor', 'nome email')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const createContactMessage = async (req, res, next) => {
  try {
    const { nome, email, telefone, assunto, mensagem } = req.body;
    const message = new ContactMessage({ nome, email, telefone, assunto, mensagem });
    await message.save();
    
    res.status(201).json({ 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: message 
    });
  } catch (err) {
    next(err);
  }
};

export const updateContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }
    
    res.json({ message: 'Mensagem atualizada com sucesso', data: message });
  } catch (err) {
    next(err);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }
    
    res.json({ message: 'Mensagem excluída com sucesso' });
  } catch (err) {
    next(err);
  }
};

export const respondContactMessage = async (req, res, next) => {
  try {
    const { resposta } = req.body;
    
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        resposta,
        status: 'respondido',
        respondidoPor: req.user.id,
        respondidoEm: new Date()
      },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }

    // Enviar e-mail de resposta se SMTP estiver configurado
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS && message.email) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT) || 587,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: message.email,
          subject: `Re: ${message.assunto || 'Contato Igreja MIR'}`,
          text: resposta,
          html: `<p>Olá <strong>${message.nome}</strong>,</p><p>${resposta.replace(/\n/g, '<br/>')}</p><hr/><p><small>Igreja MIR</small></p>`
        });
      } catch (mailErr) {
        console.warn('Aviso: Resposta salva no banco, mas falha ao enviar e-mail SMTP:', mailErr.message);
      }
    }
    
    res.json({ message: 'Resposta enviada com sucesso', data: message });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'lido' },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }
    
    res.json({ message: 'Mensagem marcada como lida', data: message });
  } catch (err) {
    next(err);
  }
};
