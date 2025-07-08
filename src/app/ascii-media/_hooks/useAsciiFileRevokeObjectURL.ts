import { useEffect } from 'react';

interface UseAsciiFileRevokeObjectURLArgs {
  fileUrl: string;
}

const useAsciiFileRevokeObjectURL = ({
  fileUrl,
}: UseAsciiFileRevokeObjectURLArgs) => {
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);
};

export default useAsciiFileRevokeObjectURL;
