#!/usr/bin/env node

import process from 'node:process';
import { cli } from './cli';

cli(process.argv.slice(2));
