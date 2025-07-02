const sanitizeNumberInput = (input: string): string | null => {
    const value = input.replace(/^0+/, ""); // Remove leading zeros
    if (/^\d*\.?\d*$/.test(value)) {         // Only allow numbers and one decimal point
      return value;
    }
    return null;
}
export default sanitizeNumberInput;