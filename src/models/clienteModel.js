const pool = require('../config/db');

const clienteModel = {

    // Seleciona todos os clientes
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;
    },

    // Seleciona cliente pelo ID
    selecionarPorId: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    },

    // Seleciona cliente pelo CPF
    selecionarPorCpf: async (pCpfCliente) => {
        const sql = 'SELECT * FROM clientes WHERE cpf_cliente = ?';
        const [rows] = await pool.query(sql, [pCpfCliente]);
        return rows;
    },

    // Inserir novo cliente
    inserirCliente: async (pNome, pCpf) => {
        const sql = 'INSERT INTO clientes (nome_cliente, cpf_cliente) VALUES (?, ?)';
        const [result] = await pool.query(sql, [pNome, pCpf]);
        return result;
    },


    atualizarCliente: async (pCpf, pNome, pId) => {
        const sql = 'UPDATE clientes SET cpf_cliente = ?, nome_cliente = ? WHERE id_cliente = ?;';
        const values = [pNome, pCpf, pId]
        const [result] = await pool.query(sql, values);
        return result;
    },

    // Deletar cliente por ID
    deleteCliente: async (pId) => {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?";
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    }
};

module.exports = { clienteModel };
