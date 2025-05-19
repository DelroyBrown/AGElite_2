var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

function startCountdown() {
  // Set the duration to 10 days (in milliseconds)
  var durationInMilliseconds = 15 * day;
  
  var countDown;
  
  // Check if there is a stored timestamp
  var storedTimestamp = localStorage.getItem("countdown_timestamp");
  
  if (storedTimestamp) {
    countDown = parseInt(storedTimestamp, 10);
  } else {
    countDown = new Date().getTime() + durationInMilliseconds;
    localStorage.setItem("countdown_timestamp", countDown.toString());
  }

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

    // Check if the countdown is finished and reset it
    if (distance <= 0) {
      clearInterval(x);
      // You can add additional actions here when the countdown finishes
      
      // Remove the stored timestamp to restart the countdown from the beginning
      localStorage.removeItem("countdown_timestamp");
      
      // Start the countdown again
      startCountdown();
    }
  }, second);
}

// Start the initial countdown
startCountdown();

      


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
  