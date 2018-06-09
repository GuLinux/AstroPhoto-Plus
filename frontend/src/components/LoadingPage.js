import React from 'react';
import { Loader } from 'semantic-ui-react';

const LoadingPage= ({ isLoading }) => isLoading ? (
  <div className="loadingOverlay">
      <Loader size="massive" active={true} inverted={true} />
  </div>
) : null;

export default LoadingPage;
