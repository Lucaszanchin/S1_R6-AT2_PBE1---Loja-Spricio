const { produtoModel } = require('../models/produtoModel');

const produtoController = {

  buscarTodosProdutos: async (req, res) => {
    try {
      const resultado = await produtoModel.selecionarTodos();

      if (!resultado || resultado.length === 0) {
        return res.status(200).json({ message: 'A tabela selecionada não contém dados', data: [] });
      }

      res.status(200).json({ message: 'Dados recebidos', data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
    }
  },

  buscarProdutoPorID: async (req, res) => {
    try {
      const id = Number(req.params.idProduto);

      if (!id || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Forneça um identificador (ID) válido' });
      }

      const resultado = await produtoModel.selecionarPorId(id);

      if (!resultado || resultado.length === 0) {
        return res.status(404).json({ message: `Nenhum produto encontrado com ID ${id}` });
      }

      res.status(200).json({ message: 'Produto encontrado', data: resultado[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  incluirProduto: async (req, res) => {
    try {
      const { descricao, valor } = req.body;

      if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 3 || typeof valor !== 'number' || valor <= 0) {
        return res.status(400).json({ message: 'Dados inválidos. Descrição deve ter pelo menos 3 caracteres e valor deve ser maior que 0.' });
      }

      const resultado = await produtoModel.inserirProduto(descricao.trim(), valor);

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

  atualizarProduto: async (req, res) => {
    try {
      const idProduto = Number(req.params.idProduto);
      let { descricao, valor } = req.body;

      // Conversões e validações
      if (isNaN(idProduto) || idProduto <= 0) {
        return res.status(400).json({ message: 'ID do produto inválido.' });
      }

      if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 3) {
        return res.status(400).json({ message: 'Descrição inválida.' });
      }

      if (valor === undefined || isNaN(Number(valor)) || Number(valor) <= 0) {
        return res.status(400).json({ message: 'Valor inválido.' });
      }

      descricao = descricao.trim();
      valor = Number(valor);

      // Verifica se o produto existe
      const produtoAtual = await produtoModel.selecionarPorId(idProduto);
      if (!produtoAtual || produtoAtual.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      const novaDescricao = descricao ?? produtoAtual[0].descricao;
      const novoValor = valor ?? produtoAtual[0].valor;

      const resultado = await produtoModel.atualizarProduto(novaDescricao, novoValor, idProduto);
      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
      }

     return res.status(200).json({
        message: 'Produto atualizado com sucesso.',
        data: { idProduto, descricao: novaDescricao, valor: novoValor }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor.',
        errorMessage: error.message
      });
    }
  },

  excluindoProduto: async (req, res) => {
    try {
      const id = Number(req.params.idProduto);
      if (!id || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Forneça um ID válido' });
      }

      const resultado = await produtoModel.selecionarPorId(id)
      if (resultado.length === 0) {
        throw new Error("Registro não localizado")
      } else {
        const resultado = await produtoModel.deleteProduto(id);
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
};

module.exports = { produtoController };
