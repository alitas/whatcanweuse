type SupportLevel = 'supported' | 'partial' | 'unsupported';

export const getSupportLevel = ({
  hasUnsupported,
  hasPartiallySupported,
}: {
  hasUnsupported: boolean;
  hasPartiallySupported: boolean;
}): SupportLevel => {
  if (hasUnsupported) {
    return 'unsupported';
  } else if (hasPartiallySupported) {
    return 'partial';
  } else {
    return 'supported';
  }
};

export const sortByFeatureName = <T extends { featureName: string }>(
  features: T[],
): T[] => {
  return features.sort((a, b) => (a.featureName > b.featureName ? 1 : -1));
};
