import { describe, expect, test, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from '../src/components/DataTable';
import { pm25Level } from '../src/utils/quality';

const columns = [
  { name: 'station_id', label: 'Станція', type: 'text' },
  { name: 'pm25', label: 'PM2.5', unit: 'мкг/м³', type: 'number' },
];
const rows = [
  { _id: '1', station_id: 'KYIV_001', pm25: 30 },
  { _id: '2', station_id: 'LVIV_001', pm25: 8.4 },
];
const props = { columns, rows, mainField: 'pm25', getLevel: pm25Level, onView() {}, onEdit() {}, onDelete() {} };

describe('DataTable', () => {
  test('відображає заголовки та рядки з props', () => {
    render(<DataTable {...props} />);
    expect(screen.getByText('Станція')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // заголовок + 2 рядки
    expect(screen.getByText('KYIV_001')).toBeInTheDocument();
    expect(screen.getByText('Добра')).toBeInTheDocument();
  });

  test('порожній список', () => {
    render(<DataTable {...props} rows={[]} />);
    expect(screen.getByText('Записів не знайдено')).toBeInTheDocument();
  });

  test('сортування за кліком на заголовок', async () => {
    render(<DataTable {...props} />);
    await userEvent.click(screen.getByText('PM2.5'));
    const first = screen.getAllByRole('row')[1];
    expect(within(first).getByText('LVIV_001')).toBeInTheDocument();
  });

  test('кнопки дій викликають обробники з записом', async () => {
    const onDelete = vi.fn();
    render(<DataTable {...props} onDelete={onDelete} />);
    await userEvent.click(screen.getAllByTitle('Видалити')[0]);
    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });
});
