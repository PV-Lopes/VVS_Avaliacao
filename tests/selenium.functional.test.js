const { Builder, By, until } = require('selenium-webdriver');

const SITE = process.env.SITE_URL || 'http://localhost:8080'; // set via env if needed
const TIMEOUT = 10000;

async function flowLoadUsers(driver) {
  await driver.get(SITE);
  await driver.findElement(By.id('load-users')).click();
  await driver.wait(until.elementsLocated(By.css('.user')), TIMEOUT);
  const users = await driver.findElements(By.css('.user'));
  return users.length;
}

async function flowOpenWebsiteNewTab(driver) {
  await driver.get(SITE);
  await driver.findElement(By.id('load-users')).click();
  await driver.wait(until.elementsLocated(By.css('.user a')), TIMEOUT);
  const link = await driver.findElement(By.css('.user a'));
  // open link (target=_blank) by clicking
  await link.click();
  // wait for new window handle
  await driver.wait(async () => {
    const handles = await driver.getAllWindowHandles();
    return handles.length >= 2;
  }, TIMEOUT);
  const handles = await driver.getAllWindowHandles();
  return handles.length;
}

async function flowNoDuplicateOnDoubleClick(driver) {
  await driver.get(SITE);
  await driver.findElement(By.id('load-users')).click();
  await driver.wait(until.elementsLocated(By.css('.user')), TIMEOUT);
  const firstCount = (await driver.findElements(By.css('.user'))).length;
  // click again
  await driver.findElement(By.id('load-users')).click();
  await driver.wait(until.elementsLocated(By.css('.user')), TIMEOUT);
  const secondCount = (await driver.findElements(By.css('.user'))).length;
  return { firstCount, secondCount };
}

(async function runAll() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .build();
  try {
    console.log('Flow 1: Load Users');
    const count = await flowLoadUsers(driver);
    console.log('Users count after load:', count);

    console.log('Flow 2: Open website new tab');
    const handles = await flowOpenWebsiteNewTab(driver);
    console.log('Window handles:', handles);

    console.log('Flow 3: Double click behavior');
    const counts = await flowNoDuplicateOnDoubleClick(driver);
    console.log('Counts:', counts);

    // exit code based on simple assertions
    if (count < 1) process.exit(1);
    if (handles < 2) process.exit(1);
    if (counts.secondCount < 1) process.exit(1);
    console.log('Functional tests OK');
    process.exit(0);
  } catch (err) {
    console.error('Functional test error:', err);
    process.exit(2);
  } finally {
    await driver.quit();
  }
})();
