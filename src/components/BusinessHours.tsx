import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { BusinessHours as BusinessHoursType } from '../types/siteSettings';

interface BusinessHoursProps {
  hours: BusinessHoursType;
}

export function BusinessHours({ hours }: BusinessHoursProps) {
  const { isOpen, currentStatus } = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    let dayHours;
    if (currentDay === 0) {
      dayHours = hours.sunday;
    } else if (currentDay === 6) {
      dayHours = hours.saturday;
    } else {
      dayHours = hours.weekdays;
    }

    if (!dayHours.open || !dayHours.close) {
      return { isOpen: false, currentStatus: 'Fechado hoje' };
    }

    const isWithinHours = currentTime >= dayHours.open && currentTime <= dayHours.close;
    
    if (isWithinHours) {
      const closeTime = new Date();
      const [closeHour, closeMinute] = dayHours.close.split(':');
      closeTime.setHours(parseInt(closeHour), parseInt(closeMinute));
      const minutesUntilClose = Math.round((closeTime.getTime() - now.getTime()) / 1000 / 60);
      
      return {
        isOpen: true,
        currentStatus: minutesUntilClose <= 60 
          ? `Fecha em ${minutesUntilClose} minutos`
          : 'Aberto agora'
      };
    }

    const nextDay = (currentDay + 1) % 7;
    let nextDayHours;
    
    if (nextDay === 0) {
      nextDayHours = hours.sunday;
    } else if (nextDay === 6) {
      nextDayHours = hours.saturday;
    } else {
      nextDayHours = hours.weekdays;
    }

    if (!nextDayHours.open) {
      return { isOpen: false, currentStatus: 'Fechado' };
    }

    return {
      isOpen: false,
      currentStatus: `Abre amanhã às ${nextDayHours.open}`
    };
  }, [hours]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {currentStatus}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Segunda a Sexta</span>
          <span>{hours.weekdays.open} - {hours.weekdays.close}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Sábado</span>
          <span>{hours.saturday.open} - {hours.saturday.close}</span>
        </div>
        
        {hours.sunday.open && hours.sunday.close ? (
          <div className="flex justify-between">
            <span>Domingo</span>
            <span>{hours.sunday.open} - {hours.sunday.close}</span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>Domingo</span>
            <span className="text-red-600">Fechado</span>
          </div>
        )}
      </div>
    </div>
  );
}