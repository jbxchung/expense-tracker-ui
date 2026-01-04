import { type FC, useState } from 'react';
import TextAreaAutosize from 'react-textarea-autosize';

import { type FieldMapping } from 'types/importer';

import styles from './ImporterConfigurator.module.scss';

interface ImporterFieldEditorProps {
  fieldConfig: FieldMapping;
  onChange: (config: FieldMapping) => void;
}
const ImportFieldEditor: FC<ImporterFieldEditorProps> = ({
  fieldConfig,
  onChange,
}) => {
  // const editableRules = useState(fieldConfig.rules);
  const [text, setText] = useState<string>(JSON.stringify(fieldConfig.rules, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(text);
      setError(null);

      const newFieldConfig = {
        ...fieldConfig,
        rules: parsed,
      }
      onChange(newFieldConfig);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (<>
    <div className={styles.importFieldEditor}>
      <span>Field Mapping Raw JSON Editor</span>
      <TextAreaAutosize
        className={styles.jsonEditor}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
      />
      {error && <div style={{ color: 'red' }}>Invalid JSON: {error}</div>}
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
