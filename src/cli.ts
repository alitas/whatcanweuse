 
import type { Formatter } from 'picocolors/types';
import type { FeatureStats, UnsupportedFeatureStats } from './get-feature-list';
import process from 'node:process';
import browserslist from 'browserslist';
import groupBy from 'object.groupby';
import pc from 'picocolors';
import size from 'window-size';
import { getFeatureList } from './get-feature-list';

export const cli = (args: string[]) => {
  const config = browserslist.findConfig('.');
  if (!config) {
    console.warn('Failed to find browserslist config in the project');
    process.exit(1);
  }

  const [configKey] = args;

  const { supported, unsupported, partial, browsers } = getFeatureList(
    config[configKey ?? 'defaults'],
  );
  const totalCoverage = browserslist.coverage(browsers);
  console.log(
    `${pc.bold('Total Browser Coverage:')} ${pc.italic(Intl.NumberFormat(undefined, { maximumFractionDigits: 2, style: 'percent' }).format(totalCoverage / 100))}`,
  );
  console.log('');
  printAsTable('Supported', supported, pc.green);
  printWithDescription('Partially Supported', partial, pc.yellow);
  printWithDescription('Not Supported', unsupported, pc.red);
};

function printAsTable(
  title: string,
  data: FeatureStats[],
  formatter: Formatter,
) {
  console.log(pc.bold(title));
  console.log('='.repeat(title.length + 2));
  const maxFeatureLength =
    Math.max(...data.map(({ featureName }) => featureName?.length ?? 0)) + 1;

  const windowSize = size.get();
  const columns = Math.max(1, Math.floor(windowSize.width / maxFeatureLength));

  const columnWidth = Math.floor(windowSize.width / columns);

  const rows = Object.values(
    groupBy(data, (_item, index) => Math.floor(index / columns)),
  );

  for (const row of rows) {
    console.log(
      formatter(
        row
          ?.map((feature) => feature.featureName?.padEnd(columnWidth))
          .join(''),
      ),
    );
  }
  console.log('');
}

function printWithDescription(
  title: string,
  data: Partial<UnsupportedFeatureStats>[],
  formatter: Formatter,
) {
  console.log(pc.bold(title));
  console.log('='.repeat(title.length + 2));

  for (const {
    featureName,
    partialSupportBrowsers,
    unsupportedBrowsers,
  } of data) {
    const hasUnsupported = Boolean(unsupportedBrowsers?.length);
    const formattedPartialBrowsers = groupBrowsersByAgent(
      partialSupportBrowsers,
      (input) => pc.yellow(hasUnsupported ? `${input}*` : input),
    )?.join('\n');

    const formattedUnsupportedBrowsers = groupBrowsersByAgent(
      unsupportedBrowsers,
      pc.red,
    )?.join('\n');

    console.log(formatter(pc.bold(featureName)));
    if (formattedPartialBrowsers) {
      console.log(formattedPartialBrowsers);
    }
    if (formattedUnsupportedBrowsers) {
      console.log(formattedUnsupportedBrowsers);
    }
    console.log('');
  }
  console.log('');
}
function groupBrowsersByAgent(
  browsers: { version: string; browser: string }[] | undefined,
  browserFormatter: Formatter,
) {
  if (browsers === undefined) return undefined;

  const groupedBrowsers = groupBy(browsers ?? [], ({ browser }) => browser);

  return Object.entries(groupedBrowsers).map(
    ([browser, versions]) =>
      `${browserFormatter(browser)} ${versions?.toReversed().map(({ version }) => version)}`,
  );
}
