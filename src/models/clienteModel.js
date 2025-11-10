const pool = require('../config/db');

const clienteModel = {
    // Seleciona todos os produtos
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selecionarPorId: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id = ?';
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    },

    selecionarPorCpf: async (pCpfCliente) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?';
        const [rows] = await pool.query(sql, [pCpfCliente]);
        return rows;
    },

    inserirCliente: async (pNome, pCpf) => {
        const sql = 'INSERT INTO clientes (nome, cpf) VALUES (?, ?)';
        const [result] = await pool.query(sql, [pNome, pCpf]);
        return result;
    },
     atualizarCliente: async (pCpf, pNome, pId ) => {
        const sql = 'UPDATE clientes SET cpf = ?, nome = ? WHERE id = ?;';
        const values = [pNome, pCpf, pId]
        const [result] = await pool.query(sql, values);
        return result;
    },
    deleteCliente: async (pId) => {
        const sql = "DELETE FROM clientes WHERE id = ?;";
        const values = [pId]
        const [rows] = await pool.query(sql, values)
        return rows
    }

}

module.exports = { clienteModel };