import { useState, type FC } from 'react';

import {
  FieldMappingRuleActionTypes,
  FieldMappingRuleConditionTypes,
  type FieldMapping,
  type FieldMappingRule,
} from 'types/importer';

import SortableList from 'components/Sortable/List/SortableList';
import Button, { ButtonVariants } from 'components/Button/Button';

import ImportRuleEditor from './ImportRuleEditor';

import styles from './ImporterConfigurator.module.scss';

// SortableList needs ids but we dont care to persist them
type RuleWithId = FieldMappingRule & { id: string };

const withIds = (rules: FieldMappingRule[]): RuleWithId[] =>
  rules.map(rule => ({ ...rule, id: crypto.randomUUID() }));

const withoutIds = (rules: RuleWithId[]): FieldMappingRule[] =>
  rules.map(({ id: _, ...rule }) => rule);

interface ImportFieldEditorProps {
  fieldConfig: FieldMapping;
  onChange: (config: FieldMapping) => void;
  availableSourceFields: string[];
}

const ImportFieldEditor: FC<ImportFieldEditorProps> = ({
  fieldConfig,
  onChange,
  availableSourceFields,
}) => {
  const [rules, setRules] = useState<RuleWithId[]>(() => withIds(fieldConfig.rules));

  const handleRulesChange = (newRules: RuleWithId[]) => {
    setRules(newRules);
    onChange({ ...fieldConfig, rules: withoutIds(newRules) });
  };

  const handleRuleChange = (id: string, newRule: FieldMappingRule) => {
    handleRulesChange(rules.map(r => r.id === id ? { ...newRule, id } : r));
  };

  const handleRuleDelete = (id: string) => {
    handleRulesChange(rules.filter(r => r.id !== id));
  };

  const handleAddRule = () => {
    handleRulesChange([
      ...rules,
      {
        id: crypto.randomUUID(),
        condition: {
          type: FieldMappingRuleConditionTypes.EXISTS,
          column: availableSourceFields[0] ?? '',
        },
        action: {
          type: FieldMappingRuleActionTypes.USE_COLUMN,
          column: availableSourceFields[0] ?? '',
        },
      },
    ]);
  };

  return (
    <div className={styles.importFieldEditor}>
      <SortableList
        items={rules}
        onChange={handleRulesChange}
        renderItem={rule => (
          <ImportRuleEditor
            rule={rule}
            onChange={newRule => handleRuleChange(rule.id, newRule)}
            onDelete={() => handleRuleDelete(rule.id)}
            availableSourceFields={availableSourceFields}
            isCategoryField={fieldConfig.field === 'category'}
          />
        )}
      />
      <Button
        className={styles.addNewRuleButton}
        variant={ButtonVariants.GHOST}
        onClick={handleAddRule}
      >
        + Add New Rule
      </Button>
    </div>
  );
};

export default ImportFieldEditor;
