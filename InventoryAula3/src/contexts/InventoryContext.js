import React, { createContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { initDB } from '../database/database';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [pecas, setPecas] = useState([]);

  // Função para carregar os dados usando a nova API assíncrona do SDK 54
  const carregarPecas = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('techinventory.db');
      const allRows = await db.getAllAsync('SELECT * FROM pecas');
      setPecas(allRows);
    } catch (err) {
      console.log('Erro ao carregar peças:', err);
    }
  };

  useEffect(() => {
    // Inicializa o banco e depois carrega os itens
    initDB()
      .then(() => carregarPecas())
      .catch(err => console.log('Erro ao inicializar banco:', err));
  }, []);

  const adicionarPeca = async (nome, categoria, quantidade, serial, imagemUri) => {
    try {
      const db = await SQLite.openDatabaseAsync('techinventory.db');
      await db.runAsync(
        'INSERT INTO pecas (nome, categoria, quantidade, serial, imagemUri) VALUES (?, ?, ?, ?, ?)',
        [nome, categoria, quantidade, serial, imagemUri]
      );
      carregarPecas(); // Atualiza a lista na UI
    } catch (err) {
      console.log('Erro ao inserir peça:', err);
    }
  };

  const removerPeca = async (id) => {
    try {
      const db = await SQLite.openDatabaseAsync('techinventory.db');
      await db.runAsync('DELETE FROM pecas WHERE id = ?', [id]);
      carregarPecas(); // Atualiza a lista na UI
    } catch (err) {
      console.log('Erro ao remover peça:', err);
    }
  };

  return (
    <InventoryContext.Provider value={{ pecas, carregarPecas, adicionarPeca, removerPeca }}>
      {children}
    </InventoryContext.Provider>
  );
};