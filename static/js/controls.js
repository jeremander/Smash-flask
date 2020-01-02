// function randomChar(e) {
//   $(".character>p>span").text(gameChars.random());
// }

$(document).ready(function () {

  loadCharacters("SSBM");
  gameChars.randomPressed();

  $(".decr").click(function (e) {
    e.preventDefault();
    var row = $(this).parents(".char-ctl");
    var freqLabel = row.find(".freq");
    var freq = parseFloat(freqLabel.text());
    var newFreq = freq - 1;
    freqLabel.text(newFreq);
    if (newFreq <= 0) {  // deactivate button
      $(this).addClass("disabled");
    }
    row.find(".incr").removeClass("disabled");
  });

  $(".incr").click(function (e) {
    e.preventDefault();
    var row = $(this).parents(".char-ctl");
    var freqLabel = row.find(".freq");
    var freq = parseFloat(freqLabel.text());
    var newFreq = freq + 1;
    freqLabel.text(newFreq);
    if (newFreq >= 10) {  // deactivate button
      $(this).addClass("disabled");
    }
    row.find(".decr").removeClass("disabled");
  });

});