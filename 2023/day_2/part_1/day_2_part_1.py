#!/usr/bin/python3

INPUT_FILE = "../day_2_input.txt"
TEST_INPUT_FILE = "../day_2_test_input.txt"

class CubeHand:
    def __init__(self, colour_dict: dict):
        self.red = colour_dict["red"]
        self.green = colour_dict["green"]
        self.blue = colour_dict["blue"]

    def __str__(self) -> str:
        return f"red: {self.red}, green: {self.green}, blue: {self.blue}\n"

    @classmethod
    def fromVals(cls, red, green, blue):
        colour_dict = {"red" : red, "green" : green, "blue": blue}
        return cls(colour_dict)

MAX_CUBES_ALLOWED = CubeHand.fromVals(12, 13, 14)

class CubeGame:
    hands: list[CubeHand] = []

    def __str__(self) -> str:
        rtn_str = ""
        for hand in self.hands:
            rtn_str += f"{hand}"
        return rtn_str

    @staticmethod
    def is_valid_hand(hand: CubeHand):
        if hand.red > MAX_CUBES_ALLOWED.red or hand.green > MAX_CUBES_ALLOWED.green or hand.blue > MAX_CUBES_ALLOWED.blue:
            return False
        return True

def read_file(filename: str) -> list[CubeGame]:
    ret: list[CubeGame] = []
    try:
        with open(filename) as f:
            for line in f:
                game = CubeGame()
                game.hands = [] # This is a hack, game.hands always refers to the same memory. We need to manually reset
                line = line.split(":", maxsplit=1)[1]
                for hand in line.split(";"):
                    hand_colour_dict = {"red" : 0, "green" : 0, "blue": 0}
                    for cube_colour in hand.split(","):
                        for colour in hand_colour_dict:
                            if colour in cube_colour:
                                hand_colour_dict[colour] = int(cube_colour.split()[0])
                    game.hands.append(CubeHand(hand_colour_dict))
                ret.append(game)
    except IOError:
        print(f"Error while trying to read {filename}")

    return ret

def check_games(filename) -> int:
    games = read_file(filename)
    valid_game_ids: list[int] = []
    for idx, game in enumerate(games):
        if all(CubeGame.is_valid_hand(hand) for hand in game.hands):
            valid_game_ids.append(idx + 1)

    return sum(valid_game_ids)

def main():
    test_result = check_games(TEST_INPUT_FILE)
    print(f"Test result: {test_result}")

    actual_result = check_games(INPUT_FILE)
    print(f"Actual result: {actual_result}")

if __name__ == "__main__":
    main()
