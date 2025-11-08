#!/usr/bin/env node
/**
 * CLI para consultar feature flags
 * Uso:
 *   node tools/feature-flags.js grokCodeFast1 [customerId]
 */
const fs = require('fs');
const path = require('path');

function loadFlags() {
  const file = path.join(__dirname, '..', 'config', 'feature-flags.json');
  if (!fs.existsSync(file)) {
    console.error('❌ No existe config/feature-flags.json');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function isEnabled(flagConfig, customerId) {
  if (!flagConfig.enabled) return false;
  // Si está marcado como all:true, se habilita para todos salvo exclusiones
  if (flagConfig.targets?.all) {
    if (flagConfig.targets.exclude?.includes(customerId)) return false;
    return true;
  }
  // Si no es global, revisar lista include
  if (flagConfig.targets?.include?.length > 0) {
    return flagConfig.targets.include.includes(customerId);
  }
  return false;
}

function main() {
  const [,, flagName, customerId = 'ANY'] = process.argv;
  if (!flagName) {
    console.error('Uso: node tools/feature-flags.js <flagName> [customerId]');
    process.exit(1);
  }
  const data = loadFlags();
  const flag = data.flags[flagName];
  if (!flag) {
    console.error(`❌ Flag no encontrada: ${flagName}`);
    process.exit(1);
  }
  const active = isEnabled(flag, customerId);
  console.log(`Flag: ${flagName}`);
  console.log(`Cliente: ${customerId}`);
  console.log(`Estado: ${active ? '✅ HABILITADO' : '⛔ DESACTIVADO'}`);
  console.log(`Notas: ${flag.notes || '—'}`);
}

main();
