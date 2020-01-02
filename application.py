#!/usr/bin/env python3

from flask import Flask, render_template
import logging

from characters import GameCharacters

# EB looks for an 'application' callable by default.
application = Flask(__name__)
# for laziness
app = application

logging.basicConfig(format = '%(asctime)s - %(levelname)s - %(message)s', level = logging.DEBUG)


@app.route('/<game>/')
def random_char(game: str):
    try:
        game_chars = GameCharacters.default(game)
    except FileNotFoundError:
        return f"<h1>Server Error</h1><h2>Unknown game '{game}'</h2>"
    char = game_chars.random()
    img_url = game_chars.img_url(char)
    return render_template('index.html', game = game, character = char, img_url = img_url)


if __name__ == "__main__":

    app.run()