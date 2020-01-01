import numpy as np

TIERS = {
    'S' : ['Jigglypuff', 'Fox', 'Marth'],
    'A' : ['Falco', 'Sheik'],
    'B' : ['Captain Falcon', 'Peach'],
    'C' : ['Ice Climbers', 'Pikachu', 'Yoshi', 'Samus'],
    'D' : ['Dr. Mario', 'Luigi', 'Mario', 'Ganondorf'],
    'E' : ['Link', 'Donkey Kong', 'Mewtwo', 'Young Link'],
    'F' : ['Mr. Game & Watch', 'Ness', 'Pichu', 'Roy'],
    'Trash' : ['Kirby', 'Zelda', 'Bowser']
}

MY_TIERS = {
    'A' : ['Jigglypuff', 'Fox', 'Marth', 'Falco', 'Sheik', 'Peach'],
    'B' : ['Captain Falcon', 'Pikachu'],
    'C' : ['Ice Climbers', 'Luigi', 'Samus', 'Yoshi'],
    'D' : ['Dr. Mario', 'Ganondorf', 'Link', 'Mario'],
    'E' : ['Donkey Kong', 'Mewtwo', 'Young Link'],
    'F' : ['Kirby', 'Mr. Game & Watch', 'Ness'],
    'Trash' : ['Bowser', 'Pichu', 'Roy', 'Zelda']
}


TIER_WEIGHTS = {'Trash' : 1, 'F' : 4 / 3, 'E' : 5 / 3, 'D' : 2, 'C' : 7 / 3, 'B' : 8 / 3, 'A' : 3}
CHAR_WEIGHTS = {char : TIER_WEIGHTS[tier] for tier in TIER_WEIGHTS for char in MY_TIERS[tier]}
weight_sum = sum(CHAR_WEIGHTS.values())
CHAR_PROBS = {char : wt / weight_sum for (char, wt) in CHAR_WEIGHTS.items()}
chars, probs = zip(*CHAR_PROBS.items())

def random_melee_char() -> str:
    """Gets a random melee character according to the desired probabilities."""
    return np.random.choice(chars, p = probs)