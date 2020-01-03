#!/usr/bin/env python3

from flask import Flask, render_template
import json
import logging

from roster import Roster

# EB looks for an 'application' callable by default.
application = Flask(__name__)
# for laziness
app = application

logging.basicConfig(format = '%(asctime)s - %(levelname)s - %(message)s', level = logging.DEBUG)


@app.route('/_get_roster/<game>/<dist>')
def get_characters(game: str, dist: str):
    return json.dumps(Roster.from_distribution(game, dist).to_dict())

@app.route('/', defaults = {'game' : 'SSBM'})
@app.route('/<game>/')
def random_char(game: str):
    try:
        Roster.default(game)
    except FileNotFoundError:
        return f"<h1>Server Error</h1><h2>Unknown game '{game}'</h2>"
    dists = Roster.distributions(game)
    return render_template('index.html', game = game, dists = dists)



if __name__ == "__main__":

    app.run()