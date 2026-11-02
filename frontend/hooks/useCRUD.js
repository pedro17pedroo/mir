import { useState, useEffect, useCallback, useRef } from 'react';
import Swal from 'sweetalert2';

/**
 * Custom hook para operações CRUD genéricas
 * @param {object} api - Objeto com métodos getAll, create, update, delete
 * @param {object} options - Opções de configuração
 * @returns {object} Estado e funções CRUD
 */
export const useCRUD = (api, options = {}) => {
  const apiRef = useRef(api);
  const optionsRef = useRef(options);

  useEffect(() => {
    apiRef.current = api;
    optionsRef.current = options;
  });

  const {
    autoLoad = true,
    successMessages = {
      create: 'Criado com sucesso!',
      update: 'Atualizado com sucesso!',
      delete: 'Excluído com sucesso!'
    },
    errorMessages = {
      load: 'Erro ao carregar dados',
      create: 'Erro ao criar',
      update: 'Erro ao atualizar',
      delete: 'Erro ao excluir'
    }
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar dados
  const fetchAll = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const currentApi = apiRef.current;
      if (!currentApi?.getAll) {
        setData([]);
        return [];
      }
      const response = await currentApi.getAll(params);
      setData(response.data || []);
      return response.data;
    } catch (err) {
      const loadMsg = optionsRef.current?.errorMessages?.load || 'Erro ao carregar dados';
      console.error(loadMsg, err);
      setError(err.message || loadMsg);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar item
  const create = async (item) => {
    try {
      setLoading(true);
      const response = await apiRef.current.create(item);
      
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: successMessages.create,
        confirmButtonColor: '#9333ea',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchAll();
      return response.data;
    } catch (err) {
      console.error(errorMessages.create, err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: err.message || errorMessages.create,
        confirmButtonColor: '#9333ea'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar item
  const update = async (id, item) => {
    try {
      setLoading(true);
      const response = await apiRef.current.update(id, item);
      
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: successMessages.update,
        confirmButtonColor: '#9333ea',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchAll();
      return response.data;
    } catch (err) {
      console.error(errorMessages.update, err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: err.message || errorMessages.update,
        confirmButtonColor: '#9333ea'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir item
  const remove = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return false;
    }

    try {
      setLoading(true);
      await apiRef.current.delete(id);
      
      await Swal.fire({
        icon: 'success',
        title: 'Excluído!',
        text: successMessages.delete,
        confirmButtonColor: '#9333ea',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchAll();
      return true;
    } catch (err) {
      console.error(errorMessages.delete, err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: err.message || errorMessages.delete,
        confirmButtonColor: '#9333ea'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Auto-load na montagem
  useEffect(() => {
    if (autoLoad) {
      fetchAll();
    }
  }, [autoLoad, fetchAll]);

  return {
    data,
    items: data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    refresh: fetchAll
  };
};
