import * as React from 'react';
import { ProductModal } from '../components/ProductModal.jsx';

// The editor shares the existing stock validation and draft handling.
// Only its presentation and information layout differ from the add form.
function ProductDetailPage({ onDetailModeChange, ...props }) {
  React.useEffect(() => {
    onDetailModeChange?.(true);
    window.scrollTo(0, 0);
    return () => onDetailModeChange?.(false);
  }, [onDetailModeChange]);
  return <ProductModal {...props} presentation="page" />;
}

export { ProductDetailPage };
