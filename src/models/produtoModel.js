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
    inserirProduto: async (pDescricao, pValor) => {
        const sql = 'INSERT INTO produtos (descricao, valor) VALUES (?, ?)';
        const [result] = await pool.query(sql, [pDescricao, pValor]);
        return result;
    },

    // Atualiza um produto existente
    atualizarProduto: async (pDescricao, pValor, pId ) => {
        const sql = 'UPDATE produtos SET descricao = ?, valor = ? WHERE id_produto = ?;';
        const values = [pDescricao, pValor, pId]
        const [result] = await pool.query(sql, values);
        return result;
    },
    // Deleta um produto existente
    deleteProduto: async (pId) => {
        const sql = "DELETE FROM produtos WHERE id_produto = ?;";
        const values = [pId]
        const [rows] = await pool.query(sql, values)
        return rows
    }
}
module.exports = { produtoModel };
