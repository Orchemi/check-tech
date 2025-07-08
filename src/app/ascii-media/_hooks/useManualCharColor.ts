import { ManualCharColor } from 'ascii-react';

interface UseManualCharColorArgs {
  setManualCharColors: (
    v: (arr: ManualCharColor[]) => ManualCharColor[],
  ) => void;
}

const useManualCharColor = ({
  setManualCharColors,
}: UseManualCharColorArgs) => {
  const handleCharChange = (idx: number, value: string) => {
    setManualCharColors((arr) =>
      arr.map((item, i) =>
        i === idx ? { ...item, char: value.slice(0, 1) } : item,
      ),
    );
  };
  const handleColorChange = (idx: number, value: string) => {
    setManualCharColors((arr) =>
      arr.map((item, i) =>
        i === idx ? { ...item, color: value as `#${string}` } : item,
      ),
    );
  };
  const handleAddCharColor = () => {
    setManualCharColors((arr) => [...arr, { char: '', color: '#000000' }]);
  };
  const handleRemoveCharColor = (idx: number) => {
    setManualCharColors((arr) =>
      arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr,
    );
  };

  // Hex input handler for manualCharColors
  const handleHexInputChange = (idx: number, value: string) => {
    // Only allow # and up to 8 hex digits
    if (/^#[0-9a-fA-F]{0,8}$/.test(value)) {
      setManualCharColors((arr) =>
        arr.map((item, i) =>
          i === idx ? { ...item, color: value as `#${string}` } : item,
        ),
      );
    }
  };

  return {
    handleCharChange,
    handleColorChange,
    handleAddCharColor,
    handleRemoveCharColor,
    handleHexInputChange,
  };
};

export default useManualCharColor;
