import type {ReactNode} from 'react';
import Layout from '@theme/Layout';

function Donate(): ReactNode {
  return (
    <Layout title="RPM Fusion's donate page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          List of donation options (NA).
        </p>
      </div>
    </Layout>
  );
}

export default Donate;
