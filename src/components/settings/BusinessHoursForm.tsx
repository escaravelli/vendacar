import React from 'react';
import { Clock } from 'lucide-react';
import { BusinessHours } from '../../types/siteSettings';

interface BusinessHoursFormProps {
  value: BusinessHours;
  onChange: (hours: BusinessHours) => void;
  disabled?: boolean;
}

export function BusinessHoursForm({ value, onChange, disabled }: BusinessHoursFormProps) {
  const handleChange = (
    day: 'weekdays' | 'saturday' | 'sunday',
    type: 'open' | 'close',
    newValue: string
  ) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [type]: newValue || null
      }
    });
  };

  const TimeInput = ({ 
    day, 
    type,
    label,
    value: timeValue 
  }: { 
    day: 'weekdays' | 'saturday' | 'sunday';
    type: 'open' | 'close';
    label: string;
    value: string | null;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="time"
        value={timeValue || ''}
        onChange={(e) => handleChange(day, type, e.target.value)}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-medium">Horário de Funcionamento</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Segunda a Sexta</h4>
          <div className="grid grid-cols-2 gap-4">
            <TimeInput
              day="weekdays"
              type="open"
              label="Abertura"
              value={value.weekdays.open}
            />
            <TimeInput
              day="weekdays"
              type="close"
              label="Fechamento"
              value={value.weekdays.close}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Sábado</h4>
          <div className="grid grid-cols-2 gap-4">
            <TimeInput
              day="saturday"
              type="open"
              label="Abertura"
              value={value.saturday.open}
            />
            <TimeInput
              day="saturday"
              type="close"
              label="Fechamento"
              value={value.saturday.close}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Domingo</h4>
          <div className="grid grid-cols-2 gap-4">
            <TimeInput
              day="sunday"
              type="open"
              label="Abertura"
              value={value.sunday.open}
            />
            <TimeInput
              day="sunday"
              type="close"
              label="Fechamento"
              value={value.sunday.close}
            />
          </div>
        </div>
      </div>
    </div>
  );
}