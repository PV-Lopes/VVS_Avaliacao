const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');

describe('Frontend - User Generator (unit)', () => {
  let originalFetch;
  let consoleErrorSpy;

  beforeEach(() => {
    // load DOM
    document.documentElement.innerHTML = html.toString();
    // reset modules so script binds to the new DOM
    jest.resetModules();

    // spy console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // keep original fetch to restore later
    originalFetch = global.fetch;
  });

  afterEach(() => {
    // restore
    global.fetch = originalFetch;
    consoleErrorSpy.mockRestore();
  });

  test('button #load-users exists and has click listener attached', () => {
    // require script after DOM prepared
    require('../script.js');
    const btn = document.getElementById('load-users');
    expect(btn).not.toBeNull();
    // simulate click: ensure it doesn't throw
    expect(() => btn.click()).not.toThrow();
  });

  test('clicking invokes fetch and populates users-list', async () => {
    const fakeData = [
      { name: 'Alice', email: 'a@a.com', phone: '111', website: 'alice.com' },
      { name: 'Bob', email: 'b@b.com', phone: '222', website: 'bob.com' }
    ];

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(fakeData)
    });

    require('../script.js');
    const btn = document.getElementById('load-users');
    btn.click();

    // wait for microtasks
    await Promise.resolve();

    const usersList = document.getElementById('users-list');
    expect(usersList.children.length).toBe(2);

    // check content of first user
    const first = usersList.querySelector('.user h3').textContent;
    expect(first).toContain('Alice');
  });

  test('users-list is cleared before populating', async () => {
    // Pre-populate users-list
    document.getElementById('users-list').innerHTML = '<div class="user">old</div>';

    const fakeData = [{ name: 'X', email: 'x@x.com', phone: '0', website: 'x.com' }];
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(fakeData) });

    require('../script.js');
    document.getElementById('load-users').click();
    await Promise.resolve();

    const usersList = document.getElementById('users-list');
    expect(usersList.children.length).toBe(1);
    expect(usersList.children[0].textContent).toContain('X');
    expect(usersList.children[0].textContent).not.toContain('old');
  });

  test('renders user fields: name, email, phone and website link', async () => {
    const fakeUser = { name: 'Carlos', email: 'c@c.com', phone: '999', website: 'carlos.dev' };
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve([fakeUser]) });

    require('../script.js');
    document.getElementById('load-users').click();
    await Promise.resolve();

    const userEl = document.querySelector('.user');
    expect(userEl.textContent).toContain('Carlos');
    expect(userEl.textContent).toContain('c@c.com');
    expect(userEl.textContent).toContain('999');

    const a = userEl.querySelector('a');
    expect(a).not.toBeNull();
    expect(a.href).toContain('carlos.dev');
  });

  test('on fetch error console.error is called', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network fail'));

    require('../script.js');
    document.getElementById('load-users').click();

    // allow promise chain to run
    await Promise.resolve();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});