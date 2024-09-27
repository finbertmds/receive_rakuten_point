# Get Rakuten points automatically every day
[![Daily](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily.yml)
[![Daily Infoseek](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20Infoseek/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_infoseek.yml)
[![Daily App PoinClub](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20App%20PoinClub/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_rakuten_pointclub.yml)
[![Daily App SPS](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20App%20SPS/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_rakuten_sps.yml)
[![Daily App Kuji](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20App%20Kuji/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_rakuten_kuji.yml)
[![Daily App PoinClub_Toshiru](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20App%20PoinClub_Toshiru/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_rakuten_pointclub_toshiru.yml)
## Technologies
- Branch: [master](https://github.com/FinbertMDS/receive_rakuten_point/tree/master)
  - Selenium IDE
- Branch: [developer](https://github.com/FinbertMDS/receive_rakuten_point/tree/developer)
  - WebdriverIO
  - Mocha
- Branch: [rakuten_apps](https://github.com/FinbertMDS/receive_rakuten_point/tree/rakuten_apps)
  - WebdriverIO
  - Jasmine
  - Appium


## How To Run
[How to run](HOW-TO-RUN.md) includes more details

## For Developer
If you want to automatically run every day to receive points of rakuten, you can start by forking the project and follow these steps run it with [Github Actions](https://github.com/features/actions)

1. Fork the project
2. Settings Rakuten username and password to Actions secrets

  ```
  RAKUTEN_USERNAME
  RAKUTEN_PASSWORD
  ```

  ![Github actions guide](./images/github_actions_guide.png)

3. View all runs from Github actions every day

  ![Github actions guide](./images/github_actions_run.png)
