// src/test/passwordRegex.test.js
const PASSWORD_REGEX = require('../middlewares/passwordRegex');

describe('PASSWORD_REGEX', () => {
  it('accepte un mot de passe valide (>=8 char, 1 chiffre, 1 spécial)', () => {
    expect(PASSWORD_REGEX.test('Abcdef1!')).toBe(true);
    expect(PASSWORD_REGEX.test('Aa1@aaaa')).toBe(true);
  });

  it('rejette s’il manque un chiffre', () => {
    expect(PASSWORD_REGEX.test('Abcdefgh!')).toBe(false);
  });

  it('rejette s’il manque un caractère spécial', () => {
    expect(PASSWORD_REGEX.test('Abcdef12')).toBe(false);
  });

  it('rejette s’il est trop court', () => {
    expect(PASSWORD_REGEX.test('A1!a')).toBe(false);
  });
});
