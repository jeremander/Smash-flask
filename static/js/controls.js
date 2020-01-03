
$(document).ready(function () {

  // TODO: use URL to determine game
  var game = $(".game-title").text();
  loadCharacters(game);
  gameChars.randomPressed();

  $(".decr").click(function (e) {
    e.preventDefault();
    var row = $(this).parents(".char-ctl");
    var i = parseInt(row.attr("id").split("-")[1]);
    var freqLabel = row.find(".freq");
    var freq = parseFloat(freqLabel.text());
    var newFreq = freq - 1;
    freqLabel.text(newFreq);
    if (newFreq <= 0) {  // deactivate button
      $(this).addClass("disabled");
    }
    row.find(".incr").removeClass("disabled");
    gameChars.setWeight(i, newFreq);
    cacheCharacters();
  });

  $(".incr").click(function (e) {
    e.preventDefault();
    var row = $(this).parents(".char-ctl");
    var i = parseInt(row.attr("id").split("-")[1]);
    var freqLabel = row.find(".freq");
    var freq = parseFloat(freqLabel.text());
    var newFreq = freq + 1;
    freqLabel.text(newFreq);
    if (newFreq >= 10) {  // deactivate button
      $(this).addClass("disabled");
    }
    row.find(".decr").removeClass("disabled");
    gameChars.setWeight(i, newFreq);
    cacheCharacters();
  });

});