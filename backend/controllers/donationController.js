import Donation from '../models/Donation.js';
import Stripe from 'stripe';

let stripeInstance = null;
const getStripe = () => {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

// Validação de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createDonation = async (req, res, next) => {
  try {
    const {
      natureza: rawNatureza,
      valor: rawValor,
      data: rawData,
      tipoContribuicao,
      categoriaDespesa,
      beneficiario,
      metodoPagamento: rawMetodoPagamento,
      metodo,
      referenciaComprovativo,
      observacoes,
      doador: rawDoador,
      nome,
      email,
      telefone,
      anonimo,
      status: rawStatus,
      tokenStripe
    } = req.body;

    const natureza = rawNatureza === 'saida' ? 'saida' : 'entrada';
    const valor = Number(rawValor);
    const metodoPagamento = (rawMetodoPagamento || metodo || 'dinheiro').toLowerCase();
    const doador = rawDoador || {
      nome: nome || beneficiario || (anonimo ? 'Anônimo' : natureza === 'saida' ? 'Tesouraria MIR' : ''),
      email: email || '',
      telefone: telefone || '',
      anonimo: Boolean(anonimo)
    };
    
    // Validação de entrada
    if (!valor || !metodoPagamento || (natureza === 'entrada' && !doador.nome && !doador.anonimo && !doador.email)) {
      return res.status(400).json({ 
        message: 'Valor, método de pagamento e identificação são obrigatórios' 
      });
    }
    
    // Validar valor
    if (Number.isNaN(valor) || valor <= 0) {
      return res.status(400).json({ message: 'O valor deve ser um número positivo' });
    }
    
    // Validar email do doador
    if (doador.email && !isValidEmail(doador.email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }
    
    // Validar método de pagamento
    const metodosValidos = ['cartao', 'multicaixa', 'transferencia', 'dinheiro'];
    if (!metodosValidos.includes(metodoPagamento)) {
      return res.status(400).json({ 
        message: `Método de pagamento inválido. Use: ${metodosValidos.join(', ')}` 
      });
    }
    
    let status = natureza === 'saida' ? 'concluido' : (
      ['pendente', 'concluido', 'falhou'].includes(rawStatus) ? rawStatus : 'pendente'
    );
    
    // Processar pagamento com cartão via Stripe se tokenStripe for enviado e Stripe estiver configurado
    if (natureza === 'entrada' && metodoPagamento === 'cartao' && tokenStripe) {
      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({ 
          message: 'Pagamento com cartão não está configurado. Entre em contato com o administrador.' 
        });
      }
      
      try {
        const currency = process.env.STRIPE_CURRENCY || 'aoa';
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(valor * 100),
          currency: currency,
          payment_method: tokenStripe,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          }
        });
        
        if (paymentIntent.status === 'succeeded') {
          status = 'concluido';
        } else if (paymentIntent.status === 'requires_action') {
          status = 'pendente';
        } else {
          status = 'falhou';
        }
      } catch (stripeError) {
        console.error('Erro no Stripe:', stripeError);
        return res.status(400).json({ 
          message: 'Erro ao processar pagamento: ' + stripeError.message 
        });
      }
    }
    
    const tiposValidos = ['dizimo', 'oferta', 'missoes', 'construcao', 'outro'];
    const donation = new Donation({
      natureza,
      valor,
      data: rawData ? new Date(rawData) : new Date(),
      tipoContribuicao: tiposValidos.includes(tipoContribuicao) ? tipoContribuicao : 'dizimo',
      categoriaDespesa: natureza === 'saida' ? (categoriaDespesa || 'outro') : '',
      beneficiario: beneficiario ? String(beneficiario).trim() : '',
      metodoPagamento,
      referenciaComprovativo: referenciaComprovativo ? String(referenciaComprovativo).trim() : '',
      observacoes: observacoes ? String(observacoes).trim() : '',
      doador,
      status
    });
    await donation.save();
    
    res.status(201).json({
      message: natureza === 'saida' ? 'Despesa registada com sucesso' : 'Contribuição registada com sucesso',
      donation
    });
  } catch (err) { 
    next(err); 
  }
};

export const getDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) { next(err); }
};

export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Doação não encontrada' });
    res.json(donation);
  } catch (err) { next(err); }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pendente', 'concluido', 'falhou'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Doação não encontrada' });
    donation.status = status;
    await donation.save();
    res.json(donation);
  } catch (err) {
    next(err);
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Doação não encontrada' });
    res.json({ message: 'Doação removida com sucesso' });
  } catch (err) {
    next(err);
  }
};
