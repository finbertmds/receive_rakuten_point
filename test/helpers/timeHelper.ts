export default {
  checkIsAM: (): boolean => {
    return checkIsAMPrivate();
  },

  randomFollowTime: (max: number): number => {
    if (checkIsAMPrivate()) {
      return randomIntFromInterval(0, Math.floor(max / 2));
    } else {
      return randomIntFromInterval(max - Math.floor(max / 2), max);
    }
  }
}

function checkIsAMPrivate() {
  var dateObj = new Date(),
    hour24 = dateObj.getHours();
  return hour24 < 12 ? true : false;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
