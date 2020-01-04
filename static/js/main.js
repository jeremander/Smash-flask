$(document).ready(function () {

  var game = $(".game-title").text();
  loadCharacters(game);
  roster.randomPressed();

  // "Random" button pressed
  $("#random").click(function() {
    roster.randomPressed();
  });

  // "No Repeat" checkbox changed
  $("#no-repeat-check").change(function() {
    roster.setNoRepeats(this.checked);
  });

  // roster distribution changed
  $("#roster-menu select").change(function(e) {
    // cache the distribution
    let dist = $(this).children("option:selected").val();
    localStorage.setItem("roster-dist", dist);
    // reload the roster with the chosen distribution
    loadCharacters(game, true);
  });

});