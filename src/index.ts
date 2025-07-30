#!/usr/bin/env node

import process from 'node:process';
import { cli } from './cli';

export * from './get-feature-list';

cli(process.argv.slice(2));
