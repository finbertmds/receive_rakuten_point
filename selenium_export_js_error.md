1. store xpath count
vars["needLogin"] = await driver.findElements(By.xpath("//input[@class=\'loginButton\']")).length
->
vars["needLogin"] = (await driver.findElements(By.xpath("//input[@class=\'loginButton\']"))).length

2. pause 3000
[object Object]
->
await driver.sleep(2000)

3. run credentials
credentials()
->
await credentials()