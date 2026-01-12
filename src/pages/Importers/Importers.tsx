import { useState, type FC } from 'react';

import { DEFAULT_IMPORTER, type Importer } from 'types/importer';
// import { useAppContext } from 'contexts/app/AppContext';
import { useImporters } from 'hooks/importers/useImporters';
// import { useExecuteImporter } from 'hooks/importers/useExecuteImporter';

import Accordion from 'components/Accordion/Accordion';
import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';

import ImporterConfigurator from 'pages/Dashboard/ImporterConfigurator/ImporterConfigurator';

import styles from './Importers.module.scss';

const Importers: FC = () => {
  // const { accounts, accountsLoading, accountsError } = useAppContext();

  const { importers, isLoading: importersLoading, error: importersError } = useImporters();
  // const { execute: executeImporter, result: importerExecutionResult, loading: importerExecutionLoading, error: importerExecutionError } = useExecuteImporter();

  const [newImporter, setNewImporter] = useState<Importer | null>(null);

  if (importersLoading) {
    return (
      <Card title="Loading importers...">
        loading spinner placeholder
      </Card>
    );
  }
  if (importersError) {
    return (
      <Card title="Error loading importers">
        {importersError.message}
      </Card>
    );
  }

  return (
    <Card title="Importers">
      <div className={styles.importerList}>
        {importers.length ? (
          importers.map(importer => {
            return (
              <Accordion key={importer.id} title={importer.name}>
                <ImporterConfigurator importer={importer} />
              </Accordion>
            );
          })
        ) : (
          <div>
            No importers found. Please create a new importer.
          </div>
        )}
        <hr />
        {newImporter ?
          (
            <Accordion title="New Importer" defaultOpen>
              <ImporterConfigurator
                onSave={(e) => {
                  console.log('saved importer:', e);
                  setNewImporter(null);
                }}
              />
            </Accordion>
          )
          :
          (
            <Button
              variant={ButtonVariants.PRIMARY}
              onClick={() => setNewImporter(DEFAULT_IMPORTER)}
            >
              Add New Importer
            </Button>
          )
        }
      </div>
    </Card>
  );
};

export default Importers;
