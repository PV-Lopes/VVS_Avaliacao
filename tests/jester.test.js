/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

let html;

// Carrega o HTML apenas uma vez
beforeAll(() => {
  html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
});

describe('Frontend - User Generator (unit)', () => {
  let consoleErrorSpy;
  let originalFetch;

  beforeEach(() => {
    // injeta HTML
    document.documentElement.innerHTML = html;

    jest.resetModules();

    // Mock fetch
    global.fetch = jest.fn();
    originalFetch = global.fetch;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // CARREGA O script.js ANTES DE DISPARAR DOMContentLoaded
    require('../script.js');

    // Agora sim dispara
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (consoleErrorSpy?.mockRestore) consoleErrorSpy.mockRestore();
  });

  test('button exists', () => {
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

    document.getElementById("load-users").click();

    // Resolve todas as Promises
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    const list = document.getElementById("users-list");
    expect(list.children.length).toBe(2);
  });

  test('list is cleared', async () => {
    document.getElementById("users-list").innerHTML = '<div>old</div>';

    const fakeData = [
      { name: "X", email: "x@x.com", phone: "000", website: "x.dev" }
    ];

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeData)
    });

    document.getElementById("load-users").click();

    await Promise.resolve();
    await Promise.resolve();

    const node = document.querySelector('.user');
    expect(node.textContent).toContain("X");
    expect(node.textContent).not.toContain("old");
  });

});
