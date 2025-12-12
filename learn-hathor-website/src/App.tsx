import { useState, useCallback } from 'react';
import { Layout, CategoryAccordion, BuildModal } from '@/components';
import { useBinderBuild } from '@/hooks';
import { getCategoriesWithNotebooks, getNotebookById } from '@/config';
import type { Notebook } from '@/types';

function App() {
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    status,
    phase,
    message,
    logs,
    progress,
    notebookUrl,
    error,
    startBuild,
    cancelBuild,
    resetBuild,
  } = useBinderBuild();

  const categories = getCategoriesWithNotebooks();

  const handleLaunchNotebook = useCallback(
    (notebookId: string) => {
      const notebook = getNotebookById(notebookId);
      if (!notebook) return;

      setSelectedNotebook(notebook);
      setIsModalOpen(true);
      void startBuild(notebook);
    },
    [startBuild]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetBuild();
    setSelectedNotebook(null);
  }, [resetBuild]);

  const handleCancelBuild = useCallback(() => {
    cancelBuild();
  }, [cancelBuild]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 text-center bg-gradient-to-b from-bg-secondary to-bg-primary">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-primary-400 bg-clip-text text-transparent">
            Learn Hathor Network
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Interactive Jupyter notebooks to master blockchain development with
            Python-powered smart contracts.
            <br />
            <span className="text-text-muted">
              No setup required — just launch and start coding.
            </span>
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <CategoryAccordion
                key={category.id}
                category={category}
                defaultExpanded={index === 0}
                onLaunchNotebook={handleLaunchNotebook}
              />
            ))
          ) : (
            <div className="text-center py-16 text-text-muted">
              <p>No notebooks available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Build Modal */}
      <BuildModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        notebook={selectedNotebook}
        buildState={{
          status,
          phase,
          message,
          logs,
          progress,
          notebookUrl,
          error,
        }}
        onCancel={handleCancelBuild}
      />
    </Layout>
  );
}

export default App;
