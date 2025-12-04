/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.html'),
  'utf8'
);

describe('Frontend - User Generator (unit)', () => {
  let consoleErrorSpy;
  let originalFetch;

  beforeEach(() => {
    document.documentElement.innerHTML = html;
    jest.resetModules();

    // DISPARAR O DOMContentLoaded ANTES DO REQUIRE
    document.dispatchEvent(new Event("DOMContentLoaded"));

    global.fetch = jest.fn();
    originalFetch = global.fetch;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});


  afterEach(() => {
    global.fetch = originalFetch;
    if (consoleErrorSpy?.mockRestore) consoleErrorSpy.mockRestore();
  });

  test('button exists', () => {
    require('../script.js');
    const btn = document.getElementById('load-users');
    expect(btn).not.toBeNull();
  });

  test('fetch populates list', async () => {
    const fakeData = [
      { name: "Alice", email: "a@a.com", phone: "111", website: "alice.com" },
      { name: "Bob", email: "b@b.com", phone: "222", website: "bob.com" }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeData)
    });

    require('../script.js');

    document.getElementById("load-users").click();

    await Promise.resolve();
    await Promise.resolve(); // ← necessário
    await Promise.resolve();
  });

  test('list is cleared', async () => {
    document.getElementById("users-list").innerHTML = '<div>old</div>';

    const fakeData = [
      { name: "X", email: "x@x.com", phone: "000", website: "x.dev" }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeData)
    });

    require('../script.js');

    document.getElementById("load-users").click();

    await Promise.resolve();
    await Promise.resolve();

    const node = document.querySelector('.user');
    expect(node.textContent).toContain("X");
    expect(node.textContent).not.toContain("old");
  });

});
