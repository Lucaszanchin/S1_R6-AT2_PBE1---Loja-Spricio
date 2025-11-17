const { clienteModel } = require('../models/clienteModel');

const clienteController = {

  buscarTodosClientes: async (req, res) => {
    try {
      const resultado = await clienteModel.selecionarTodos();

      if (!resultado || resultado.length === 0) {
        return res.status(200).json({ message: 'A tabela selecionada não contém dados', data: [] });
      }

      res.status(200).json({ message: 'Dados recebidos', data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
    }
  },

  buscarClientePorID: async (req, res) => {
    try {
      const id = Number(req.query.id);

      if (!id || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Forneça um identificador (ID) válido' });
      }

      const resultado = await clienteModel.selecionarPorId(id);

      if (!resultado || resultado.length === 0) {
        return res.status(404).json({ message: `Nenhum cliente encontrado com ID ${id}` });
      }

      res.status(200).json({ message: 'Cliente encontrado', data: resultado[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  incluirCliente: async (req, res) => {
    try {
      const { nome, cpf } = req.body;

      if (!nome || !cpf ||typeof nome !== 'string' || typeof cpf !== 'string' || cpf.length !== 11) {
        return res.status(400).json({ message: 'Dados inválidos. Nome deve ter pelo menos 3 caracteres, CPF deve ter todos 11 digitos' });
      }

      const resultadoId = await clienteModel.selecionarPorCpf(cpf)
      if (resultadoId.length === 1) {
        return res.status(409).json({ message: 'Esse CPF já existe.' })
      }

      const resultado = await clienteModel.inserirCliente(nome.trim(), cpf);

      if (resultado.affectedRows === 1 && resultado.insertId) {
        res.status(201).json({ message: 'Registro incluído com sucesso', result: resultado });
      } else {
        throw new Error('Ocorreu um erro ao incluir o registro');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  atualizarCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      let { cpf, nome } = req.body;

      if (isNaN(idCliente) || idCliente <= 0) {
        return res.status(400).json({ message: 'ID do Cliente inválido.' });
      }

      if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
        return res.status(400).json({ message: 'Descrição inválida.' });
      }

      // 🔹 Correção completa do CPF
      if (!cpf) {
        return res.status(400).json({ message: 'CPF é obrigatório.' });
      }

      if (cpf.length !== 11) {
        return res.status(400).json({ message: 'CPF inválido.' });
      }

      nome = nome.trim();

      const clienteAtual = await clienteModel.selecionarPorId(idCliente);
      if (!clienteAtual || clienteAtual.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      const novoNome = nome ?? clienteAtual[0].nome;
      const novoCpf = cpf ?? clienteAtual[0].cpf;

      const resultado = await clienteModel.atualizarCliente(novoNome, novoCpf, idCliente);
      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: 'Erro ao atualizar o Cliente.' });
      }

      return res.status(200).json({
        message: 'Cliente atualizado com sucesso.',
        data: { idCliente, nome: novoNome, cpf: novoCpf }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor.',
        errorMessage: error.message
      });
    }
  },

  excluindoCliente: async (req, res) => {
    try {
      const id = Number(req.params.idCliente);
      if (!id || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Forneça um ID válido' });
      }

      const resultado = await clienteModel.selecionarPorId(id)
      if (resultado.length === 0) {
        throw new Error("Registro não localizado")
      } else {
        const resultado = await clienteModel.deleteCliente(id);
        if (resultado.affectedRows === 1) {
          return res.status(200).json({ message: 'O produto foi excluído com sucesso', data: resultado })
        } else {
          throw new Error("Não foi possível excluir o produto");
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  }

}

module.exports = { clienteController };