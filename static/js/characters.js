class GameCharacters {

  init(game, char_weights) {
    this.game = game;
    this.char_weights = char_weights;
    this.chars = [];
    this.cumWeights = [];
    var ctr = 0;
    for (const [char, wt] of Object.entries(char_weights)) {
      ctr += wt;
      this.chars.push(char);
      this.cumWeights.push(ctr);
    }
    this.total = ctr;
  }

  random() {
    var r = Math.floor(Math.random() * this.total);
    for (var i = 0; i < this.chars.length; i++) {
      if (r < this.cumWeights[i]) {
        return this.chars[i];
      }
    }
  }

  randomPressed(e) {
    // select a random character
    var char = this.random();
    // change the character text
    $(".character>p>span").text(char);
    // change the image URL
    var imgUrl = $(".character img").attr("src");
    var segs = imgUrl.split("/");
    segs[segs.length - 1] = char + ".png";
    $(".character img").attr("src", segs.join("/"));
  }

}

// global character data
var gameChars = new GameCharacters();

function loadCharacters(game) {
  $.ajax({
    url: '/_get_chars/' + game,
    dataType: 'json',
    async: false,
    success: function (data) {
      gameChars.init(data.game, data.char_weights);
    }
  });
}
