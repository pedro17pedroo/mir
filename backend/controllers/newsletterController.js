import Newsletter from '../models/Newsletter.js';
import nodemailer from 'nodemailer';

export const sendNewsletter = async (req, res, next) => {
  try {
    const { titulo, conteudo, destinatarios: rawDestinatarios } = req.body;
    if (!titulo || !conteudo) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' });
    }

    const destinatarios = Array.isArray(rawDestinatarios)
      ? rawDestinatarios
      : typeof rawDestinatarios === 'string' && rawDestinatarios.trim()
        ? rawDestinatarios.split(',').map((e) => e.trim()).filter(Boolean)
        : [];

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS && destinatarios.length > 0) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT) || 587,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        await Promise.allSettled(
          destinatarios.map((email) =>
            transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: email,
              subject: titulo,
              html: conteudo
            })
          )
        );
      } catch (mailErr) {
        console.warn('Aviso ao enviar e-mails da newsletter:', mailErr.message);
      }
    }

    const newsletter = new Newsletter({ titulo, conteudo, destinatarios });
    await newsletter.save();
    res.status(201).json({ message: 'Newsletter registrada e enviada com sucesso', newsletter });
  } catch (err) { next(err); }
};

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Informe um e-mail válido' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existente = await Newsletter.findOne({ email: normalizedEmail });
    if (existente) {
      return res.status(200).json({ message: 'Este e-mail já está inscrito na nossa newsletter!', subscriber: existente });
    }

    const novoInscrito = new Newsletter({
      email: normalizedEmail,
      titulo: 'Inscrito via Site',
      destinatarios: [normalizedEmail]
    });
    await novoInscrito.save();

    res.status(201).json({ message: 'Inscrição realizada com sucesso!', subscriber: novoInscrito });
  } catch (err) { next(err); }
};

export const getNewsletters = async (req, res, next) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (err) { next(err); }
};

export const deleteNewsletter = async (req, res, next) => {
  try {
    const item = await Newsletter.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }
    res.json({ message: 'Registro removido com sucesso' });
  } catch (err) { next(err); }
};
