class GameCharacters {

  init(game, char_weights) {
    this.game = game;
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

  // sets the weight of character i
  setWeight(i, wt) {
    var char = this.chars[i];
    this.char_weights[char] = wt;
    this.weights[i] = wt;
    this._initWeights();
  }

  // initializes DOM elements associated with the character set
  initElements() {
    for (var i = 0; i < this.chars.length; i++) {
      var char = this.chars[i];
      var row = $("<div class='grid-container btn-group char-ctl' id='char-" + i.toString() + "'></div>");
      var charImg = $("<img>", { class: "char-icon", src: this.imgUrl(char), align: "middle" });
      var decrBtn = $("<div><a class='btn btn-secondary freq-ctl decr' href='#'><b>&#8211;</b></a></div>");
      var weight = $("<div><label class='freq'>" + Math.round(this.char_weights[char]).toString() + "</label></div>");
      var incrBtn = $("<div><a class='btn btn-secondary freq-ctl incr' href='#'><b>+</b></a></div>");
      row.append(charImg, decrBtn, weight, incrBtn);
      $("#char-list").append(row);
    }
  }

  // random character as a string
  random() {
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
var gameChars = new GameCharacters();

// caches character data in local storage
function cacheCharacters() {
  var key = gameChars.game + "-chars";
  var value = JSON.stringify(gameChars);
  localStorage.setItem(key, value);
}

// load character data, initialize page
function loadCharacters(game) {
  var key = game + "-chars";
  var value = localStorage.getItem(key);
  if (value === null) {
    // load data from JSON on server
    $.ajax({
      url: '/_get_chars/' + game,
      dataType: 'json',
      async: false,
      success: function (data) {
        gameChars.init(data.game, data.char_weights);
      }
    });
    cacheCharacters();
  }
  else {
    // load data from cache
    var obj = JSON.parse(value);
    gameChars.init(obj.game, obj.char_weights);
  }
  gameChars.initElements();
}