import { type FC, useState } from 'react';

import { type FieldMapping, type FieldMappingRule } from 'types/importer';

import ImportRuleEditor from './ImportRuleEditor';

import styles from './ImporterConfigurator.module.scss';

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
  const [editableRules, setEditableRules] = useState(fieldConfig.rules);

  return (<>
    <div className={styles.importFieldEditor}>
      {editableRules.map((rule, rIndex) => (
        <ImportRuleEditor
          key={rIndex}
          rule={rule}
          onChange={(newRule: FieldMappingRule) => {
            const newRules = [...editableRules];
            newRules[rIndex] = newRule;
            setEditableRules(newRules);
            // onChange({
            //   ...fieldConfig,
            //   rules: newRules,
            // });
          }}
          availableSourceFields={availableSourceFields}
        />
      ))}
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
