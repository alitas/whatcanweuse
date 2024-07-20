import { expect, it } from 'vitest';
import { getFeatureList } from './get-feature-list';

it('throws if invalid browserslist is passed', () => {
  expect(() => getFeatureList('Invalid browserslist')).toThrowError(
    'Unknown browser query',
  );
});

it('beacon API is not supported, asm.js is partially supported in Chrome 32', () => {
  const features = getFeatureList('Chrome 32');

  expect(
    features.unsupported.find(
      ({ featureName }) => featureName === 'Beacon API',
    ),
  ).toStrictEqual({
    featureName: 'Beacon API',
    partialSupportBrowsers: [],
    unsupportedBrowsers: [{ browser: 'chrome', version: '32' }],
  });

  expect(
    features.partial.find(({ featureName }) => featureName === 'asm.js'),
  ).toStrictEqual({
    featureName: 'asm.js',
    partialSupportBrowsers: [{ browser: 'chrome', version: '32' }],
  });
});

it('beacon API is supported and asm.js is partially supported in Chrome 126', () => {
  const features = getFeatureList('Chrome 126');

  expect(
    features.supported.find(({ featureName }) => featureName === 'Beacon API'),
  ).toStrictEqual({
    featureName: 'Beacon API',
  });

  expect(
    features.partial.find(({ featureName }) => featureName === 'asm.js'),
  ).toStrictEqual({
    featureName: 'asm.js',
    partialSupportBrowsers: [{ browser: 'chrome', version: '126' }],
  });
});

it('snapshots next.js browserslist', () => {
  const nextJsDefaultBrowsersList = [
    'chrome 64',
    'edge 79',
    'firefox 67',
    'opera 51',
    'safari 12',
  ];

  const features = getFeatureList(nextJsDefaultBrowsersList);

  const supportedFeatures = features.supported.map(
    ({ featureName }) => featureName,
  );

  const partialSupportFeatures = features.partial.map(
    ({ featureName }) => featureName,
  );

  const unsupportedFeatures = features.unsupported.map(
    ({ featureName }) => featureName,
  );

  expect(supportedFeatures).toMatchSnapshot();
  expect(partialSupportFeatures).toMatchSnapshot();
  expect(unsupportedFeatures).toMatchSnapshot();
});
