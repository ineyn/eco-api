import { useCallback, useState } from 'react';
import useResource from '../hooks/useResource';
import DataTable from '../components/DataTable';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import RecordDetails from '../components/RecordDetails';
import StatsCards from '../components/StatsCards';
import Notification from '../components/Notification';
import { buildCreatePayload, buildPatchPayload, getErrorMessage } from '../utils/format';

// Сторінка одного ресурсу: фільтри, статистика, таблиця, CRUD-операції
export default function ResourcePage({ resource }) {
  const { api, fields, title, mainField, quality } = resource;
  const { rows, meta, page, limit, loading, error, loadedAt, setPage, setLimit, applyFilters, reload, create, update, remove } =
    useResource(api, { initialLimit: 10 });

  // modal: { mode: 'create' | 'edit' | 'view' | 'delete', record }
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const columns = fields.filter((f) => f.inTable);
  const filterFields = resource.filters.map((name) => fields.find((f) => f.name === name));
  const main = fields.find((f) => f.name === mainField);

  const notify = (message, type = 'success') => setToast({ message, type });

  // помилки сервера (400) показуються у формі
  const handleCreate = async (values) => {
    try {
      await create(buildCreatePayload(values, fields));
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
    setModal(null);
    notify('Запис створено');
  };

  const handleUpdate = async (values, initial) => {
    const body = buildPatchPayload(values, initial, fields);
    if (Object.keys(body).length === 0) return setModal(null);
    try {
      await update(modal.record._id, body);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
    setModal(null);
    notify('Запис оновлено');
  };

  const handleDelete = async () => {
    try {
      await remove(modal.record._id);
      notify('Запис видалено');
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    }
    setModal(null);
  };

  // перегляд: свіжі дані запису через GET /:id
  const handleView = async (row) => {
    try {
      const record = await api.getById(row._id);
      setModal({ mode: 'view', record });
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>{title}</h2>
          {loadedAt && (
            <span className="loaded-at">Дані станом на {loadedAt.toLocaleTimeString('uk-UA')}</span>
          )}
        </div>
        <div className="page-actions">
          <button className="btn" onClick={reload}>⟳ Оновити</button>
          <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>+ Додати запис</button>
        </div>
      </div>

      <Filters fields={filterFields} onApply={applyFilters} />

      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <>
          <StatsCards rows={rows} total={meta.total} field={main} getLevel={quality} />
          {loading ? (
            <p className="loading">Завантаження…</p>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              mainField={mainField}
              getLevel={quality}
              onView={handleView}
              onEdit={(record) => setModal({ mode: 'edit', record })}
              onDelete={(record) => setModal({ mode: 'delete', record })}
            />
          )}
          <Pagination page={page} limit={limit} total={meta.total} onChange={setPage} onLimitChange={setLimit} />
        </>
      )}

      {modal?.mode === 'create' && (
        <Modal title={`Новий запис: ${title.toLowerCase()}`} onClose={() => setModal(null)}>
          <RecordForm fields={fields} onSubmit={handleCreate} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.mode === 'edit' && (
        <Modal title={`Редагування: ${modal.record.station_id}`} onClose={() => setModal(null)}>
          <RecordForm fields={fields} record={modal.record} onSubmit={handleUpdate} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.mode === 'view' && (
        <Modal title={`Запис ${modal.record.station_id}`} onClose={() => setModal(null)}>
          <RecordDetails fields={fields} record={modal.record} />
        </Modal>
      )}
      {modal?.mode === 'delete' && (
        <Modal title="Видалення запису" onClose={() => setModal(null)}>
          <p>
            Видалити запис станції <b>{modal.record.station_id}</b> від{' '}
            {new Date(modal.record.measured_at).toLocaleString('uk-UA')}? Дію не можна скасувати.
          </p>
          <div className="form-buttons">
            <button className="btn" onClick={() => setModal(null)}>Скасувати</button>
            <button className="btn btn-danger" onClick={handleDelete}>Видалити</button>
          </div>
        </Modal>
      )}

      {toast && <Notification message={toast.message} type={toast.type} onClose={closeToast} />}
    </section>
  );
}
