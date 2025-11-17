const pool = require('../config/db');

const produtoModel = {

    // Seleciona todos os produtos
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM produtos';
        const [rows] = await pool.query(sql);
        return rows;
    },

    // Seleciona produto por ID
    selecionarPorId: async (pId) => {
        const sql = 'SELECT * FROM produtos WHERE id_produto = ?';
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    },

    // Insere um novo produto
    inserirProduto: async (pNomeProduto, pValorProduto) => {
        const sql = 'INSERT INTO produtos (nome_produto, valor_produto) VALUES (?, ?)';
        const [result] = await pool.query(sql, [pNomeProduto, pValorProduto]);
        return result;
    },

    // Atualiza um produto existente
    atualizarProduto: async (pId, pNomeProduto, pValorProduto) => {
        const sql = 'UPDATE produtos SET nome_produto = ?, valor_produto = ? WHERE id_produto = ?';
        const values = [pNomeProduto, pValorProduto, pId];
        const [result] = await pool.query(sql, values);
        return result;
    },

    // Deleta um produto existente
    deleteProduto: async (pId) => {
        const sql = 'DELETE FROM produtos WHERE id_produto = ?';
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    }
};

module.exports = { produtoModel };
