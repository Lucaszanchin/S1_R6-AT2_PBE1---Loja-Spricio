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
      const id = Number(req.params.idCliente);

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

      if (!nome || !cpf || typeof nome !== 'string' || nome.trim() || typeof cpf === 'number' || cpf.length > 11 ) {
        return res.status(400).json({ message: 'Dados inválidos. Nome deve ter pelo menos 3 caracteres, CPF deve ter todos 11 digitos' });
      }

      const resultadoId = await clienteModel.selecionarPorCpf(cpf)
      if(resultadoId.length === 1){
        return res.status(409).json ({message:'Esse CPF já existe.'})
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

}

module.exports = { clienteController };