import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecordForm from '../src/components/RecordForm';
import { resources } from '../src/config/resources';
import { validateForm } from '../src/utils/validation';

const fields = resources.air.fields;

describe('перевірка форми', () => {
  test('обов’язкові поля і межі значень', () => {
    const errors = validateForm({ city: 'Одеса', pm25: '-3', humidity: '120' }, fields);
    expect(errors).toEqual({
      station_id: 'Обов’язкове поле',
      pm25: 'Не менше 0',
      humidity: 'Не більше 100',
    });
  });

  test('час вимірювання не може бути в майбутньому', () => {
    const errors = validateForm({ station_id: 'A', city: 'B', pm25: '1', measured_at: '2999-01-01T10:00' }, fields);
    expect(errors.measured_at).toMatch(/майбутньому/);
  });

  test('некоректні дані не відправляються, поля підсвічуються', async () => {
    const onSubmit = vi.fn();
    const { container } = render(<RecordForm fields={fields} onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(container.querySelector('input[name=pm25]'), '-3');
    await userEvent.click(screen.getByText('Створити'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(container.querySelectorAll('label.invalid')).toHaveLength(3); // station_id, city, pm25
    expect(screen.getByText('Не менше 0')).toBeInTheDocument();
  });

  test('помилка зникає після виправлення поля', async () => {
    const { container } = render(<RecordForm fields={fields} onSubmit={vi.fn()} onCancel={() => {}} />);
    await userEvent.click(screen.getByText('Створити'));
    await userEvent.type(container.querySelector('input[name=station_id]'), 'KYIV_001');
    expect(container.querySelector('input[name=station_id]').closest('label')).not.toHaveClass('invalid');
  });

  test('коректні дані відправляються, помилка сервера видна у формі', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Помилка валідації: ...'));
    const { container } = render(<RecordForm fields={fields} onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(container.querySelector('input[name=station_id]'), 'KYIV_001');
    await userEvent.type(container.querySelector('input[name=city]'), 'Київ');
    await userEvent.type(container.querySelector('input[name=pm25]'), '12.5');
    await userEvent.click(screen.getByText('Створити'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Помилка валідації: ...')).toBeInTheDocument();
  });
});
