import assert from 'node:assert/strict';
import {test} from 'node:test';
import {LICENSES, USES, evaluateLicense} from '../src/lib/licensing.js';

test('cada combinación de licencia y uso tiene veredicto y motivo', () => {
  for (const license of LICENSES) {
    for (const use of USES) {
      const result = evaluateLicense(license.id, use.id);
      assert.ok(result, `falta ${license.id} con ${use.id}`);
      assert.ok(['permitido', 'condiciones', 'prohibido'].includes(result.verdict));
      assert.ok(result.reason.length > 20);
    }
  }
});

test('las licencias permisivas valen para cualquier uso', () => {
  for (const id of ['apache-2.0', 'mit', 'bsd']) {
    for (const use of USES) {
      assert.equal(evaluateLicense(id, use.id).verdict, 'permitido');
    }
  }
});

test('AGPL solo obliga cuando distribuyes o sirves el modelo', () => {
  assert.equal(evaluateLicense('agpl', 'interno').verdict, 'permitido');
  assert.equal(evaluateLicense('agpl', 'producto').verdict, 'condiciones');
  assert.equal(evaluateLicense('agpl', 'servicio').verdict, 'condiciones');
  assert.match(evaluateLicense('agpl', 'servicio').reason, /código fuente completo/);
});

test('una licencia no comercial tampoco vale para un prototipo interno', () => {
  for (const id of ['research', 'cc-by-nc']) {
    assert.equal(evaluateLicense(id, 'investigacion').verdict, 'permitido');
    assert.equal(evaluateLicense(id, 'interno').verdict, 'prohibido');
    assert.equal(evaluateLicense(id, 'producto').verdict, 'prohibido');
  }
});

test('las licencias con restricciones permiten vender pero imponen condiciones', () => {
  for (const id of ['openrail', 'cc-by-sa']) {
    assert.equal(evaluateLicense(id, 'producto').verdict, 'condiciones');
  }
});

test('una licencia o un uso desconocidos no devuelven veredicto', () => {
  assert.equal(evaluateLicense('inventada', 'producto'), null);
  assert.equal(evaluateLicense('mit', 'inventado'), null);
});
