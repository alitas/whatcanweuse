#!/usr/bin/env node

import browserslist from 'browserslist';
import { feature, features } from 'caniuse-lite';
import { getSupportLevel, sortByFeatureName } from './util';

export type FeatureStats = {
  featureName: string;
};

export type PartialFeatureStats = {
  partialSupportBrowsers: { version: string; browser: string }[];
} & FeatureStats;

export type UnsupportedFeatureStats = {
  unsupportedBrowsers: { browser: string; version: string }[];
} & PartialFeatureStats;

export const getFeatureList = (
  browsersList: Parameters<typeof browserslist>[0],
) => {
  const browsers = browserslist(browsersList);

  const browsersWithVersions = browsers.map((browser) => {
    const [agent, version] = browser.split(' ');
    return { browser: agent ?? '', version: version ?? '' };
  });

  const partialSupportFeatures: PartialFeatureStats[] = [];
  const supportedFeatures: FeatureStats[] = [];
  const unsupportedFeatures: UnsupportedFeatureStats[] = [];

  for (const packedFeature of Object.values(features)) {
    const { stats, title: featureName } = feature(packedFeature);

    const unsupportedBrowsers = browsersWithVersions.filter(
      ({ browser, version }) =>
        stats[browser]?.[version]?.startsWith('n') ||
        stats[browser]?.[version]?.startsWith('u') ||
        stats[browser]?.[version]?.startsWith('p'),
    );

    const partialSupportBrowsers = browsersWithVersions.filter(
      ({ browser, version }) => stats[browser]?.[version]?.startsWith('a'),
    );

    const supportLevel = getSupportLevel({
      hasUnsupported: unsupportedBrowsers.length > 0,
      hasPartiallySupported: partialSupportBrowsers.length > 0,
    });

    if (supportLevel === 'supported') {
      supportedFeatures.push({ featureName });
    } else if (supportLevel === 'partial') {
      partialSupportFeatures.push({
        featureName,
        partialSupportBrowsers,
      });
    } else {
      unsupportedFeatures.push({
        featureName,
        partialSupportBrowsers,
        unsupportedBrowsers,
      });
    }
  }

  return {
    partial: sortByFeatureName(partialSupportFeatures),
    supported: sortByFeatureName(supportedFeatures),
    unsupported: sortByFeatureName(unsupportedFeatures),
    browsers,
  };
};
