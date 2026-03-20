import { type FC } from 'react';

import {
  FieldMappingRuleActionTypeLabels,
  FieldMappingRuleActionTypes,
  FieldMappingRuleConditionTypeLabels,
  FieldMappingRuleConditionTypes,
  type FieldMappingRule,
  type FieldMappingRuleAction,
  type FieldMappingRuleActionType,
  type FieldMappingRuleCondition,
  type FieldMappingRuleConditionType,
} from 'types/importer';

import { useCategoryList } from 'hooks/categories/useCategories';

import Dropdown from 'components/Dropdown/Dropdown';
import Input from 'components/Input/Input';

import styles from './ImporterConfigurator.module.scss';
import MultiValueInput from 'components/MultiValueInput/MultiValueInput';
import Button, { ButtonVariants } from 'components/Button/Button';
import Checkbox from 'components/Checkbox/Checkbox';

interface ImportRuleEditorProps {
  rule: FieldMappingRule;
  onChange: (rule: FieldMappingRule) => void;
  onDelete: () => void;
  availableSourceFields: string[];
  isAmountField: boolean;
  isCategoryField: boolean;
}

const ImportRuleEditor: FC<ImportRuleEditorProps> = ({
  rule,
  onChange,
  onDelete,
  availableSourceFields,
  isAmountField,
  isCategoryField,
}) => {
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategoryList();

  if (categoriesLoading) {
    return 'Loading categories...';
  }
  if (categoriesError) {
    return 'Error loading categories';
  }

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
    })
  );

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
    })
  );

  const handleActionTypeChanged = (type: FieldMappingRuleActionType) =>
    updateRule(prev => ({
      ...prev,
      action: {
        type,
      },
    })
  );

  const handleActionChanged = (update: Partial<FieldMappingRuleAction>) =>
    updateRule(prev => ({
      ...prev,
      action: {
        ...prev.action,
        ...update,
      },
    })
  );

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
        className={styles.importRuleDropdown}
        options={availableSourceFields.map(field => ({
          value: field,
          label: field,
        }))}
        value={rule.condition.column}
        onChange={handleConditionColumnChanged}
        suppressArrow
      />

      <Dropdown
        className={styles.importRuleDropdown}
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
        className={styles.importRuleDropdown}
        options={Object.values(FieldMappingRuleActionTypes).map(type => ({
          value: type,
          label: FieldMappingRuleActionTypeLabels[type],
        }))}
        value={rule.action.type}
        onChange={t => handleActionTypeChanged(t as FieldMappingRuleActionType)}
        suppressArrow
      />

      {rule.action.type === FieldMappingRuleActionTypes.USE_COLUMN && (<>
        <Dropdown
          className={styles.importRuleDropdown}
          options={availableSourceFields.map(field => ({
            value: field,
            label: field,
          }))}
          value={rule.action.column}
          onChange={column => handleActionChanged({ column })}
          suppressArrow
        />
        {isAmountField && (
          <Checkbox
            label="Negate"
            title="Credit Card transactions should have positive charges and negative payments"
            className={styles.negateCheckbox}
            value={rule.action.negate ?? false}
            onChange={value => handleActionChanged({ negate: value })}
          />
        )}
      </>
      )}

      {rule.action.type === FieldMappingRuleActionTypes.SET_VALUE && (
        isCategoryField ? (
          <Dropdown
            className={styles.importRuleDropdown}
            options={categories.map(category => ({
              value: category.id,
              label: category.name,
              depth: category.depth,
            }))}
            value={rule.action.value}
            onChange={value => handleActionChanged({ value })}
          />
        ) : (
          <Input
            value={rule.action.value ?? ''}
            onChange={e => handleActionChanged({ value: e.target.value })}
          />
        )
      )}

      <Button variant={ButtonVariants.ICON} onClick={onDelete} className={styles.deleteRuleButton} title="Delete rule">
        &times;
      </Button>
    </div>
  );
};

export default ImportRuleEditor;
