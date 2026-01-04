import { type FC, useState } from 'react';

import { FieldMappingRuleActionTypeLabels, FieldMappingRuleActionTypes, FieldMappingRuleConditionTypeLabels, FieldMappingRuleConditionTypes, type FieldMapping, type FieldMappingRule, type FieldMappingRuleActionType, type FieldMappingRuleConditionType } from 'types/importer';
import Dropdown from 'components/Dropdown/Dropdown';

import styles from './ImporterConfigurator.module.scss';
import Input from 'components/Input/Input';

interface ImportRuleEditorProps {
  rule: FieldMappingRule;
  onChange: (rule: FieldMappingRule) => void;
  availableSourceFields: string[];
}
const ImportRuleEditor: FC<ImportRuleEditorProps> = ({
  rule,
  onChange,
  availableSourceFields
}) => {
  const [editableRule, setEditableRule] = useState(rule);

  const handleRuleChanged = (newRule: FieldMappingRule) => {
    onChange(newRule);
  };

  const handleConditionColumnChanged = (newConditionColumn: string) => {
    const newRule = {
      ...editableRule,
      condition: {
        ...editableRule.condition,
        column: newConditionColumn,
      }
    }
    setEditableRule(newRule);
  };

  const handleConditionTypeChanged = (newConditionType: FieldMappingRuleConditionType) => {
    const newRule = {
      ...editableRule,
      condition: {
        ...editableRule.condition,
        type: newConditionType,
      }
    };
    setEditableRule(newRule);
  };

  const handleActionTypeChanged = (newActionType: FieldMappingRuleActionType) => {
    const newRule = {
      ...editableRule,
      action: {
        ...editableRule.action,
        type: newActionType,
      }
    };
    setEditableRule(newRule);
  };

  // for useColumn action
  const handleActionColumnChanged = (newActionColumn: string) => {
    const newRule = {
      ...editableRule,
      action: {
        ...editableRule.action,
        column: newActionColumn,
      }
    };
    setEditableRule(newRule);
  }
  // for setValue action
  const handleActionValueChanged = (newValue: string) => {
    const newRule = {
      ...editableRule,
      action: {
        ...editableRule.action,
        value: newValue,
      }
    };
    setEditableRule(newRule);
  };

  console.log(editableRule);

  return (<>
    <div className={styles.importRuleEditor}>
      <span>If</span>
      <Dropdown
        options={availableSourceFields.map(field => ({ value: field, label: field }))}
        onChange={newConditionColumn => handleConditionColumnChanged(newConditionColumn)}
        value={editableRule.condition.column}
          suppressArrow
      />
      <Dropdown
        options={Object.values(FieldMappingRuleConditionTypes).map(type => ({ value: type, label: FieldMappingRuleConditionTypeLabels[type] }))}
        onChange={newConditionType => handleConditionTypeChanged(newConditionType as FieldMappingRuleConditionType)}
        value={editableRule.condition.type}
          suppressArrow
      />
      <span>,</span>
      <Dropdown
        options={Object.values(FieldMappingRuleActionTypes).map(type => ({ value: type, label: FieldMappingRuleActionTypeLabels[type] }))}
        onChange={newActionType => handleActionTypeChanged(newActionType as FieldMappingRuleActionType)}
        value={editableRule.action.type}
          suppressArrow
      />
      {editableRule.action.type === 'useColumn' && (
        <Dropdown
          options={availableSourceFields.map(field => ({ value: field, label: field }))}
          onChange={newActionColumn => handleActionColumnChanged(newActionColumn)}
          value={editableRule.action.column}
          suppressArrow
        />
      )}
      {editableRule.action.type === 'setValue' && (
        <Input value={editableRule.action.value || ''} onChange={e => handleActionValueChanged(e.target.value)} />
      )}
    </div>
  </>);
};

export default ImportRuleEditor;
