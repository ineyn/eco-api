import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourcePage from '../src/pages/ResourcePage';
import { resources } from '../src/config/resources';

// API замінюється заглушкою, щоб тест не залежав від сервера
function makeApi(data) {
  return {
    getAll: vi.fn().mockResolvedValue({ data, meta: { total: data.length, page: 1, limit: 10, count: data.length } }),
    getById: vi.fn(),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    remove: vi.fn().mockResolvedValue({}),
  };
}

const record = { _id: 'abc', station_id: 'KYIV_001', city: 'Київ', pm25: 12, measured_at: '2026-10-01T08:00:00Z' };

describe('ResourcePage', () => {
  test('завантажує дані з API і показує таблицю', async () => {
    const api = makeApi([record]);
    render(<ResourcePage resource={{ ...resources.air, api }} />);
    expect(await screen.findByText('KYIV_001')).toBeInTheDocument();
    expect(api.getAll.mock.calls[0][0]).toEqual({ page: 1, limit: 10 });
  });

  test('фільтр передається в query-параметри', async () => {
    const api = makeApi([record]);
    render(<ResourcePage resource={{ ...resources.air, api }} />);
    await screen.findByText('KYIV_001');
    await userEvent.type(screen.getAllByPlaceholderText('усі')[0], 'Київ');
    await userEvent.click(screen.getByText('Знайти'));
    expect(api.getAll.mock.lastCall[0]).toEqual({ page: 1, limit: 10, city: 'Київ' });
  });

  test('видалення запису після підтвердження', async () => {
    const api = makeApi([record]);
    render(<ResourcePage resource={{ ...resources.air, api }} />);
    await screen.findByText('KYIV_001');
    await userEvent.click(screen.getByTitle('Видалити'));
    await userEvent.click(screen.getByRole('button', { name: 'Видалити' }));
    expect(api.remove).toHaveBeenCalledWith('abc');
    expect(await screen.findByText('Запис видалено')).toBeInTheDocument();
  });

  test('попередній запит скасовується при зміні фільтра', async () => {
    const api = makeApi([record]);
    render(<ResourcePage resource={{ ...resources.air, api }} />);
    await screen.findByText('KYIV_001');
    const firstSignal = api.getAll.mock.lastCall[1].signal;
    await userEvent.type(screen.getAllByPlaceholderText('усі')[0], 'Львів');
    await userEvent.click(screen.getByText('Знайти'));
    expect(firstSignal.aborted).toBe(true);
    expect(api.getAll.mock.lastCall[1].signal.aborted).toBe(false);
  });

  test('показує час останнього завантаження', async () => {
    const api = makeApi([record]);
    render(<ResourcePage resource={{ ...resources.air, api }} />);
    expect(await screen.findByText(/Дані станом на/)).toBeInTheDocument();
  });

  test('показує помилку, якщо API недоступне', async () => {
    const api = makeApi([]);
    api.getAll.mockRejectedValue({ request: {} });
    render(<ResourcePage resource={{ ...resources.air, api }} />);
    expect(await screen.findByText(/Сервер API недоступний/)).toBeInTheDocument();
  });
});
