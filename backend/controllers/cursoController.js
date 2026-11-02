import Curso from '../models/Curso.js';

export const getCursos = async (req, res, next) => {
  try {
    const { ativo, categoria } = req.query;
    const filter = {};
    if (ativo !== undefined) filter.ativo = ativo === 'true';
    if (categoria) filter.categoria = categoria;

    const cursos = await Curso.find(filter).sort({ createdAt: -1 });
    res.json(cursos);
  } catch (err) {
    next(err);
  }
};

export const createCurso = async (req, res, next) => {
  try {
    const curso = new Curso(req.body);
    await curso.save();
    res.status(201).json(curso);
  } catch (err) {
    next(err);
  }
};

export const updateCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    Object.assign(curso, req.body);
    await curso.save();
    res.json(curso);
  } catch (err) {
    next(err);
  }
};

export const deleteCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    res.json({ message: 'Curso removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

export const matricularAluno = async (req, res, next) => {
  try {
    const { nome, telefone, email } = req.body;
    if (!nome || !telefone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios para a matrícula.' });
    }

    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    if (!curso.inscricoesAbertas) {
      return res.status(400).json({ message: 'As matrículas para esta turma estão encerradas.' });
    }

    if (curso.vagas > 0 && curso.alunos.length >= curso.vagas) {
      return res.status(400).json({ message: 'As vagas para esta turma já foram preenchidas.' });
    }

    curso.alunos.push({
      nome: String(nome).trim(),
      telefone: String(telefone).trim(),
      email: email ? String(email).trim() : '',
      status: 'inscrito',
      dataInscricao: new Date()
    });

    await curso.save();
    res.status(201).json({
      message: 'Matrícula realizada com sucesso! Aguardamos por si na próxima aula.',
      curso
    });
  } catch (err) {
    next(err);
  }
};

export const removerAlunoCurso = async (req, res, next) => {
  try {
    const { id, alunoId } = req.params;
    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    curso.alunos = curso.alunos.filter((a) => a._id.toString() !== alunoId);
    await curso.save();
    res.json(curso);
  } catch (err) {
    next(err);
  }
};

