#!/usr/bin/python3

INPUT_FILE = "../day_1_input.txt"
TEST_INPUT_FILE = "./day_1_part_2_test_input.txt"

NUMBERS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

def read_file(filename: str) -> list[str]:
    ret = []
    try:
        with open(filename) as f:
            for line in f:
                ret.append(line.rstrip().lower())
    except IOError:
        print(f"Error while trying to read {filename}")

    return ret

def number_in_string(string: str) -> int:
    for j, num in enumerate(NUMBERS):
        if num in string:
            return j + 1
    return -1

def determine_calibration_value(cal_val_line: str) -> int:
    letter_hold = ""
    for idx in range(len(cal_val_line)):
        if cal_val_line[idx].isdigit():
            ret = int(cal_val_line[idx]) * 10
            break

        letter_hold = letter_hold + cal_val_line[idx]
        num_from_string = number_in_string(letter_hold)
        if num_from_string != -1:
            ret = num_from_string * 10
            break

    letter_hold = ""
    for idx in range(len(cal_val_line) - 1, -1, -1):
        if cal_val_line[idx].isdigit():
            ret += int(cal_val_line[idx])
            break

        letter_hold = letter_hold + cal_val_line[idx]
        num_from_string = number_in_string(letter_hold[::-1])
        if num_from_string != -1:
            ret += num_from_string
            break

    return ret

def get_total_calibration_value(input_file: str) -> int:
    incorrect_calibration_values = read_file(input_file)

    correct_calibration_values: list[int] = []
    for cal_val in incorrect_calibration_values:
        correct_calibration_values.append(determine_calibration_value(cal_val))

    return sum(correct_calibration_values)

def main():
    test_calibration_val = get_total_calibration_value(TEST_INPUT_FILE)
    print(f"Test Total Calibration Value: {test_calibration_val}")

    actual_calibration_val = get_total_calibration_value(INPUT_FILE)
    print(f"Actual Total Calibration Value: {actual_calibration_val}")

if __name__ == "__main__":
    main()
