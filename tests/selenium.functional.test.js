const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

jest.setTimeout(40000);

describe("Functional Tests", () => {
  let driver;

  beforeAll(async () => {
    const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(serviceBuilder)
      .build();
  }, 35000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test("Fluxo 1 - Carregar usuários", async () => {
    await driver.get("http://localhost:8080");
    await driver.findElement(By.id("load-users")).click();

    const users = await driver.wait(
      until.elementsLocated(By.css(".user")),
      15000
    );

    expect(users.length).toBeGreaterThan(0);
  });

  test("Fluxo 2 - Abrir website em nova aba", async () => {
    await driver.get("http://localhost:8080");
    await driver.findElement(By.id("load-users")).click();

    const link = await driver.wait(
      until.elementLocated(By.css(".user a")),
      15000
    );

    await link.click();

    const handles = await driver.getAllWindowHandles();
    expect(handles.length).toBeGreaterThan(1);
  });

  test("Fluxo 3 - Lista não duplica", async () => {
    await driver.get("http://localhost:8080");
    const btn = await driver.findElement(By.id("load-users"));

    await btn.click();
    await driver.wait(until.elementsLocated(By.css(".user")), 15000);
    const count1 = (await driver.findElements(By.css(".user"))).length;

    await btn.click();
    await driver.wait(until.elementsLocated(By.css(".user")), 15000);
    const count2 = (await driver.findElements(By.css(".user"))).length;

    expect(count2).toBe(count1);
  });
});
