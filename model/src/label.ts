export function getDefaultBlockLabel(data: {
  abundanceLabel?: string;
}) {
  // Return abundance label if available, otherwise default message
  if (data.abundanceLabel) {
    return data.abundanceLabel;
  }

  return 'Select Abundance and Metrics';
}
