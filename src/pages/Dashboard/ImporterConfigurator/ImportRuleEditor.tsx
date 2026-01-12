import { type FC } from 'react';

import {
  FieldMappingRuleActionTypeLabels,
  FieldMappingRuleActionTypes,
  FieldMappingRuleConditionTypeLabels,
  FieldMappingRuleConditionTypes,
  type FieldMappingRule,
  type FieldMappingRuleActionType,
  type FieldMappingRuleCondition,
  type FieldMappingRuleConditionType,
} from 'types/importer';

import Dropdown from 'components/Dropdown/Dropdown';
import Input from 'components/Input/Input';

import styles from './ImporterConfigurator.module.scss';
import MultiValueInput from 'components/MultiValueInput/MultiValueInput';

interface ImportRuleEditorProps {
  rule: FieldMappingRule;
  onChange: (rule: FieldMappingRule) => void;
  availableSourceFields: string[];
}

const ImportRuleEditor: FC<ImportRuleEditorProps> = ({
  rule,
  onChange,
  availableSourceFields,
}) => {
  const updateRule = (updater: (prev: FieldMappingRule) => FieldMappingRule) => {
    onChange(updater(rule));
  };

  const handleConditionColumnChanged = (column: string) =>
    updateRule(prev => ({
      ...prev,
      condition: {
        ...prev.condition,
        column,
      },
    }));

  const handleConditionTypeChanged = (type: FieldMappingRuleConditionType) =>
    updateRule(prev => ({
      ...prev,
      condition: {
        ...prev.condition,
        type,
        // clear matchers when switching types
        exact: undefined,
        startsWith: undefined,
        includes: undefined,
        regex: undefined,
      },
    }));

  const handleActionTypeChanged = (type: FieldMappingRuleActionType) =>
    updateRule(prev => ({
      ...prev,
      action: {
        type,
      },
    }));

  const handleActionColumnChanged = (column: string) =>
    updateRule(prev => ({
      ...prev,
      action: {
        ...prev.action,
        column,
      },
    }));

  const handleActionValueChanged = (value: string) =>
    updateRule(prev => ({
      ...prev,
      action: {
        ...prev.action,
        value,
      },
    }));

  const handleStringMatchChanged = (input: string[]) => {
    const values = input.filter(Boolean);

    updateRule(prev => {
      const condition: FieldMappingRuleCondition = { ...prev.condition };

      switch (condition.type) {
        case FieldMappingRuleConditionTypes.MATCHES:
          condition.exact = values;
          break;
        case FieldMappingRuleConditionTypes.STARTS_WITH:
          condition.startsWith = values;
          break;
        case FieldMappingRuleConditionTypes.INCLUDES:
          condition.includes = values;
          break;
      }

      return { ...prev, condition };
    });
  };

  const getStringMatcherValues = () => {
    switch (rule.condition.type) {
      case FieldMappingRuleConditionTypes.MATCHES:
        return rule.condition.exact ?? [];
      case FieldMappingRuleConditionTypes.STARTS_WITH:
        return rule.condition.startsWith ?? [];
      case FieldMappingRuleConditionTypes.INCLUDES:
        return rule.condition.includes ?? [];
      default:
        return [];
    }
  };

  return (
    <div className={styles.importRuleEditor}>
      <span>If</span>

      <Dropdown
        options={availableSourceFields.map(field => ({
          value: field,
          label: field,
        }))}
        value={rule.condition.column}
        onChange={handleConditionColumnChanged}
        suppressArrow
      />

      <Dropdown
        options={Object.values(FieldMappingRuleConditionTypes).map(type => ({
          value: type,
          label: FieldMappingRuleConditionTypeLabels[type],
        }))}
        value={rule.condition.type}
        onChange={t => handleConditionTypeChanged(t as FieldMappingRuleConditionType)}
        suppressArrow
      />

      {rule.condition.type !== FieldMappingRuleConditionTypes.EXISTS && (
        <MultiValueInput
          values={getStringMatcherValues()}
          onChange={values => handleStringMatchChanged(values)}
          placeholder="Add new match"
        />
      )}

      <span>,</span>

      <Dropdown
        options={Object.values(FieldMappingRuleActionTypes).map(type => ({
          value: type,
          label: FieldMappingRuleActionTypeLabels[type],
        }))}
        value={rule.action.type}
        onChange={t => handleActionTypeChanged(t as FieldMappingRuleActionType)}
        suppressArrow
      />

      {rule.action.type === FieldMappingRuleActionTypes.USE_COLUMN && (
        <Dropdown
          options={availableSourceFields.map(field => ({
            value: field,
            label: field,
          }))}
          value={rule.action.column}
          onChange={handleActionColumnChanged}
          suppressArrow
        />
      )}

      {rule.action.type === FieldMappingRuleActionTypes.SET_VALUE && (
        <Input
          value={rule.action.value ?? ''}
          onChange={e => handleActionValueChanged(e.target.value)}
        />
      )}
    </div>
  );
};

export default ImportRuleEditor;
