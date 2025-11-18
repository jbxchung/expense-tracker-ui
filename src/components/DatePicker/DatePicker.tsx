import { useEffect, useState, type FC } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './DatePicker.module.scss';
import Input from 'components/Input/Input';

// types
export type DateValue = Date | null;
export interface DateRange {
  from: DateValue;
  to: DateValue;
}
export const DatePickerModes = {
  SINGLE: 'single',
  RANGE: 'range',
} as const;
export type DatePickerMode = typeof DatePickerModes[keyof typeof DatePickerModes];

interface DatePickerProps {
  mode?: DatePickerMode;
  value?: DateValue;
  range?: DateRange;
  onChange: (value: DateValue | DateRange) => void;
  presets?: { label: string; getRange: () => DateRange }[];
}

// normalize date start to 00:00:00 and end to 23:59:59
function normalizeStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function normalizeEnd(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

const DatePicker: FC<DatePickerProps> = ({
  mode = DatePickerModes.SINGLE,
  value = null,
  range = { from: null, to: null },
  onChange,
  presets = [],
}) => {
  const [internalRange, setInternalRange] = useState<DateRange>(range);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    setInternalRange(range);
  }, [range]);

  const handleSingleChange = (date: DateValue) => {
    if (date) {
      date = normalizeStart(date);
    }
    onChange(date);
    setSelectedPreset(null);
  };

  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    const [from, to] = dates;
    const newRange: DateRange = {
      from: from ? normalizeStart(from) : null,
      to: to ? normalizeEnd(to) : null,
    };
    setInternalRange(newRange);
    onChange(newRange);
    setSelectedPreset(null);
  };

  const handlePresetClick = (preset: { label: string; getRange: () => DateRange }) => {
    const presetRange = preset.getRange();
    const normalizedRange: DateRange = {
      from: presetRange.from ? normalizeStart(presetRange.from) : null,
      to: presetRange.to ? normalizeEnd(presetRange.to) : null,
    };
    setInternalRange(normalizedRange);
    onChange(normalizedRange);
    setSelectedPreset(preset.label);
  };

  return (
    <div>
      {mode === DatePickerModes.SINGLE ? (
        <ReactDatePicker
          customInput={<Input placeholder='Select a date' />}
          selected={value}
          onChange={handleSingleChange}
          isClearable
        />
      ) : (
        <ReactDatePicker
          customInput={<Input placeholder='Select a date range' />}
          selectsRange
          startDate={internalRange.from}
          endDate={internalRange.to}
          onChange={handleRangeChange}
          isClearable
        />
      )}

      {presets.length > 0 && (
        <div className={styles.presets}>
          {presets.map(preset => (
            <button
              key={preset.label}
              type="button"
              className={`${styles.presetButton} ${
                selectedPreset === preset.label ? styles.selected : ''
              }`}
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
