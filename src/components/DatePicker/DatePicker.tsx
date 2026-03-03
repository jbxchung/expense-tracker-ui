import { useEffect, useState, type FC } from 'react';
import ReactDatePicker from 'react-datepicker';

import Input from 'components/Input/Input';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.scss';

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

type DateRangePreset = {
  label: string;
  getRange: () => DateRange;
}

interface DatePickerProps {
  mode?: DatePickerMode;
  value?: DateValue;
  range?: DateRange;
  onChange: (value: DateValue | DateRange) => void;
  presets?: DateRangePreset[];
  selectedPresetIndex?: number;
  onPresetSelected?: (preset: DateRangePreset | null) => void;
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
  selectedPresetIndex = 0,
  onPresetSelected,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset | null>(presets?.[selectedPresetIndex] || null);
  const [internalRange, setInternalRange] = useState<DateRange>(selectedPreset ? selectedPreset.getRange() : range);

  useEffect(() => {
    if (mode === DatePickerModes.RANGE) {
      setInternalRange(range);
    }
  }, [range, mode]);

  const changePreset = (preset: DateRangePreset | null) => {
    setSelectedPreset(preset);
    onPresetSelected?.(preset);
  };

  const handleSingleChange = (date: DateValue) => {
    if (date) {
      date = normalizeStart(date);
    }
    onChange(date);
    changePreset(null);
  };

  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    const [from, to] = dates;
    const newRange: DateRange = {
      from: from ? normalizeStart(from) : null,
      to: to ? normalizeEnd(to) : null,
    };
    setInternalRange(newRange);

    // only fire event on complete range selection
    if (newRange.from && newRange.to) {
      onChange(newRange);
      changePreset(null);
    }
  };

  const handlePresetClick = (preset: { label: string; getRange: () => DateRange }) => {
    const presetRange = preset.getRange();
    const normalizedRange: DateRange = {
      from: presetRange.from ? normalizeStart(presetRange.from) : null,
      to: presetRange.to ? normalizeEnd(presetRange.to) : null,
    };
    setInternalRange(normalizedRange);
    onChange(normalizedRange);
    changePreset(preset);
  };

  return (
    <div className={styles.datePickerWrapper}>
      {mode === DatePickerModes.SINGLE ? (
        <ReactDatePicker
          customInput={<Input placeholder='Select a date' />}
          selected={value}
          onChange={handleSingleChange}
          portalId='root'
          popperProps={{ strategy: 'fixed' }}
          isClearable
        />
      ) : (
        <ReactDatePicker
          customInput={<Input placeholder='Select a date range' />}
          selectsRange
          startDate={internalRange.from}
          endDate={internalRange.to}
          onChange={handleRangeChange}
          portalId='root'
          popperProps={{ strategy: 'fixed' }}
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
                selectedPreset?.label === preset.label ? styles.selected : ''
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
