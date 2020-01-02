#!/usr/bin/env python3

from flask import Flask, render_template
import json
import logging

from characters import GameCharacters

# EB looks for an 'application' callable by default.
application = Flask(__name__)
# for laziness
app = application

logging.basicConfig(format = '%(asctime)s - %(levelname)s - %(message)s', level = logging.DEBUG)


@app.route('/_get_chars/<game>')
def get_characters(game: str):
    return json.dumps(GameCharacters.default(game).to_dict())

@app.route('/', defaults = {'game' : 'SSBM'})
@app.route('/<game>/')
def random_char(game: str):
    try:
        game_chars = GameCharacters.default(game)
    except FileNotFoundError:
        return f"<h1>Server Error</h1><h2>Unknown game '{game}'</h2>"
    img_url = game_chars.img_path + f'/{game_chars.chars[0]}.png'
    return render_template('index.html', game = game, img_url = img_url)



if __name__ == "__main__":

    app.run()