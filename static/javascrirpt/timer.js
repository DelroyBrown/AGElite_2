var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

var countDown = new Date("Aug 21, 2023 00:00:00").getTime();

var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDown - now;

  // Ensure the DOM elements exist before updating their content
  var daysElement = document.getElementById("days1");
  var hoursElement = document.getElementById("hours1");
  var minutesElement = document.getElementById("minutes1");
  var secondsElement = document.getElementById("seconds1");


  if (daysElement && hoursElement && minutesElement && secondsElement) {
    daysElement.innerText = Math.floor(distance / day);
    hoursElement.innerText = Math.floor((distance % day) / hour);
    minutesElement.innerText = Math.floor((distance % hour) / minute);
    secondsElement.innerText = Math.floor((distance % minute) / second);
  }

  // Check if the countdown is finished and clear the interval
  if (distance < 0) {
      clearInterval(x);
      // You can add additional actions here when the countdown finishes
  }
  }, second);
      


  //   (document.getElementById("days1").innerText = Math.floor(distance / day)),
  //   (document.getElementById("hours1").innerText = Math.floor(
  //     (distance % day) / hour
  //   )),
  //   (document.getElementById("minutes1").innerText = Math.floor(
  //     (distance % hour) / minute
  //   )),
  //   (document.getElementById("seconds1").innerText = Math.floor(
  //     (distance % minute) / second
  //   ));
  // }, second); 
  