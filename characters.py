from functools import lru_cache
import json
import logging
# import numpy as np
from pathlib import Path
from typing import Any, Dict

DATA_DIR = Path(__file__).parent / 'static' / 'data'


class GameCharacters:
    """Class for generating random game characters from a particular probability distribution."""
    def __init__(self, game: str, char_weights: Dict[str, float]):
        assert len(char_weights) > 0
        assert all(wt >= 0.0 for wt in char_weights.values())
        self.game = game
        self.char_weights = char_weights
        # weight_sum = sum(char_weights.values())
        # char_probs = {char : wt / weight_sum for (char, wt) in char_weights.items()}
        # assert (len(char_probs) > 0)
        # self.chars, self.probs = zip(*char_probs.items())
        self.chars, self.weights = zip(*char_weights.items())
    # def random(self) -> str:
    #     """Generates a random game character according to the distribution."""
    #     return np.random.choice(self.chars, p = self.probs)
    @property
    def img_path(self) -> str:
        return f'/static/data/{self.game}/img'
    # def img_url(self, char: str) -> str:
    #     """Returns path to the character's icon."""
    #     return f'/static/data/{self.game}/img/{char}.png'
    def to_dict(self) -> Dict[str, Any]:
        return {'game' : self.game, 'char_weights' : self.char_weights}
    @classmethod
    @lru_cache()
    def from_json(cls, filename: str) -> 'GameCharacter':
        """Loads a character set from a JSON file."""
        with open(filename) as f:
            logging.debug(f'Loading characters from: {filename}')
            d = json.load(f)
        return cls(d['game'], d['char_weights'])
    @classmethod
    def default(cls, game: str) -> 'GameCharacter':
        """Loads the default character set for the given game."""
        path = DATA_DIR / game / 'default.json'
        return cls.from_json(str(path))