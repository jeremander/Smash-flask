from functools import lru_cache
import json
import logging
from pathlib import Path
from typing import Any, Dict, List

GAMES_DIR = Path(__file__).parent / 'static' / 'games'
VALID_WEIGHTS = set(range(-11, 11))

class Roster:
    """Set of characters in a video game."""
    def __init__(self, game: str, char_weights: Dict[str, float]):
        assert len(char_weights) > 0
        assert all(wt in VALID_WEIGHTS for wt in char_weights.values())
        self.game = game
        self.char_weights = char_weights
        self.chars, self.weights = zip(*char_weights.items())
    def to_dict(self) -> Dict[str, Any]:
        return {'game' : self.game, 'char_weights' : self.char_weights}
    @classmethod
    @lru_cache()
    def from_json(cls, filename: str) -> 'Roster':
        """Loads a character set from a JSON file."""
        with open(filename) as f:
            logging.debug(f'Loading characters from: {filename}')
            d = json.load(f)
        return cls(d['game'], d['char_weights'])
    @classmethod
    def from_distribution(cls, game: str, dist: str) -> 'Roster':
        """Loads the character set for the given game and distribution name."""
        path = GAMES_DIR / game.lower() / 'rosters' / f'{dist}.json'
        return cls.from_json(str(path))
    @classmethod
    def default(cls, game: str) -> 'Roster':
        """Loads the default character set for the given game."""
        return cls.from_distribution(game, 'Default')
    @staticmethod
    def distributions(game: str) -> List[str]:
        """Given a game name, retrieves the list of JSON files (excluding suffixes) containing the relevant character data."""
        path = GAMES_DIR / game.lower() / 'rosters'
        return sorted([p.name[:-5] for p in path.glob('*.json')])