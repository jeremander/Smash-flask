class Roster {

  init(game, dist, char_weights) {
    this.game = game;
    this.dist = dist;
    this.char_weights = char_weights;
    this.chars = [];
    this.weights = [];
    for (const [char, wt] of Object.entries(char_weights)) {
      this.chars.push(char);
      this.weights.push(wt);
    }
    this._initWeights();
  }

  // initializes the cumulative weights for randomization
  _initWeights() {
    var ctr = 0;
    this.cumWeights = [];
    for (const wt of this.weights) {
      ctr += wt;
      this.cumWeights.push(ctr);
    }
    this.total = ctr;
  }

  // gets the number of playable characters
  numPlayable() {
    var ctr = 0;
    for(wt of this.weights) {
      if (wt > 0) {
        ctr += 1;
      }
    }
    if (ctr == 0) {  // all are playable
      return this.chars.length;
    }
    return ctr;
  }

  // sets the weight of character i
  setWeight(i, wt) {
    var char = this.chars[i];
    this.char_weights[char] = wt;
    this.weights[i] = wt;
    this._initWeights();
  }

  // initializes DOM elements associated with the character set
  initElements() {
    $("#char-list").empty();
    for (var i = 0; i < this.chars.length; i++) {
      var char = this.chars[i];
      var row = $("<div class='grid-container btn-group char-ctl' id='char-" + i.toString() + "'></div>");
      var charImg = $("<img>", { class: "char-icon", src: this.imgUrl(char), align: "middle" });
      var decrBtn = $("<div><a class='btn btn-secondary freq-ctl decr' href='#'><b>&#8211;</b></a></div>");
      var weight = $("<div><label class='freq'>" + Math.round(this.char_weights[char]).toString() + "</label></div>");
      var incrBtn = $("<div><a class='btn btn-secondary freq-ctl incr' href='#'><b>+</b></a></div>");
      row.append(charImg, decrBtn, weight, incrBtn);
      var freqLabel = row.find(".freq");
      var freq = parseFloat(freqLabel.text());
      // deactivate buttons, if necessary
      if (freq <= 0) {
        row.find(".decr").addClass("disabled");
      }
      else if (freq >= 10) {
        row.find(".incr").addClass("disabled");
      }
      $("#char-list").append(row);
    }

    // register clicks of decrement/increment buttons

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
      roster.setWeight(i, newFreq);
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
      roster.setWeight(i, newFreq);
      cacheCharacters();
    });
  }

  // random character as a string
  random() {
    if (this.total == 0) {
      // degenerate case: generate uniformly at random
      var i = Math.floor(Math.random() * this.chars.length);
      return this.chars[i];
    }
    var r = Math.floor(Math.random() * this.total);
    for (var i = 0; i < this.chars.length; i++) {
      if (r < this.cumWeights[i]) {
        return this.chars[i];
      }
    }
  }

  // image URL for a given character
  imgUrl(char) {
    return "/static/games/" + this.game.toLowerCase() + "/img/" + char + ".png";
  }

  // "Random" button pressed
  randomPressed(e) {
    // select a random character
    var char = this.random();
    // change the character text
    $(".character>p>span").text(char);
    // set the image URL
    $(".character img").attr("src", this.imgUrl(char));
  }
}

// global character data
var roster = new Roster();

// caches character data in local storage
function cacheCharacters() {
  var rosterStr = JSON.stringify(roster);
  localStorage.setItem(roster.game + "-roster", rosterStr);
  var dist = localStorage.getItem("roster-dist");
  if (dist == "*Custom*") {
    // save the default roster as *Custom*
    localStorage.setItem(roster.game + "-default-roster", rosterStr);
  }
}

// load character data, initialize page
function loadCharacters(game, force = false) {
  var dist = localStorage.getItem("roster-dist");
  if (dist === null) {
    dist = "Default";
  }
  $("#roster-menu select").val(dist).prop("selected", true);
  var value = null;
  if (dist == "*Custom*") {
    // retrieve data from roster last saved as *Custom*
    value = localStorage.getItem(game + "-default-roster");
    force = false;
    if (value === null) {
      // no *Custom* roster exists, so initialize it to Default
      dist = "Default";
    }
  }
  if (value === null) {
    // try to load roster from cache
    value = localStorage.getItem(game + "-roster");
  }
  if (force || (value === null)) {
    // load data from JSON on server
    $.ajax({
      url: '/_get_roster/' + game + "/" + dist,
      dataType: 'json',
      async: false,
      success: function (data) {
        roster.init(data.game, dist, data.char_weights);
      }
    });
    cacheCharacters();
  }
  else {
    // load data from cache
    var obj = JSON.parse(value);
    roster.init(obj.game, obj.dist, obj.char_weights);
  }
  roster.initElements();
}