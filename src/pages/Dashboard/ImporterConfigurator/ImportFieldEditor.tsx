import type { FC } from 'react';

import { FieldMappingRuleActionTypes, FieldMappingRuleConditionTypes, type FieldMapping, type FieldMappingRule } from 'types/importer';

import ImportRuleEditor from './ImportRuleEditor';

import styles from './ImporterConfigurator.module.scss';
import Button, { ButtonVariants } from 'components/Button/Button';

interface ImportFieldEditorProps {
  fieldConfig: FieldMapping;
  onChange: (config: FieldMapping) => void;
  availableSourceFields: string[];
}
const ImportFieldEditor: FC<ImportFieldEditorProps> = ({
  fieldConfig,
  onChange,
  availableSourceFields
}) => {
  const updateRules = (updater: (prev: FieldMappingRule[]) => FieldMappingRule[]) => {
    onChange({
      ...fieldConfig,
      rules: updater(fieldConfig.rules),
    });
  };

  return (<>
    <div className={styles.importFieldEditor}>
      {fieldConfig.rules.map((rule, rIndex) => (
        <ImportRuleEditor
          key={rIndex}
          rule={rule}
          onChange={(newRule: FieldMappingRule) => updateRules(prev => prev.map((r, idx) => idx === rIndex ? newRule : r))}
          onDelete={() => updateRules(prev => prev.filter((_, idx) => idx !== rIndex))}
          availableSourceFields={availableSourceFields}
          // special case - only Category field needs this
          isCategoryField={fieldConfig.field === 'category'}
        />
      ))}
      <Button
        className={styles.addNewRuleButton}
        variant={ButtonVariants.GHOST}
        onClick={() =>
          updateRules(prev => [
            ...prev,
            {
              condition: {
                type: FieldMappingRuleConditionTypes.EXISTS,
                column: availableSourceFields[0] ?? '',
              },
              action: {
                type: FieldMappingRuleActionTypes.USE_COLUMN,
                column: availableSourceFields[0] ?? '',
              },
            },
          ])
        }
      >
        + Add New Rule
      </Button>
      {/* {editableRules.map((rule, rIndex) => (
        <div key={rIndex} className={styles.rule}>
          
          <pre>{JSON.stringify(rule, null, 4)}</pre>
        </div>
      ))} */}
    </div>
    {/* <div className={styles.debug}>
      <h4>DEBUG</h4>
      <pre>{JSON.stringify(fieldConfig, null, 4)}</pre>
    </div> */}
  </>);
};

export default ImportFieldEditor;
