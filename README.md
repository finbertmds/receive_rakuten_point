# Automatically receive daily points of Rakuten
[![Daily](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily.yml)
[![Daily Apps](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20Apps/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_apps.yml)
[![Daily App SPS every night](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20App%20SPS%20every%20night/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_rakuten_sps.yml)
[![Daily App Kuji](https://github.com/FinbertMDS/receive_rakuten_point/workflows/Daily%20App%20Kuji/badge.svg)](https://github.com/FinbertMDS/receive_rakuten_point/actions/workflows/daily_rakuten_kuji.yml)
## Technologies
- Selenium IDE

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
