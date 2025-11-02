/** src/components/utility/Loading.tsx */

import { Center, Loader } from '@mantine/core';

/**
 * A centered loader component to be used as a Suspense fallback.
 */
function Loading() {
  return (
    <Center style={{ height: '100vh' }}>
      <Loader />
    </Center>
  );
}

export default Loading;
