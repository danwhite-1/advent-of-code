#!/usr/bin/python3

INPUT_FILE = "../day_1_input.txt"
TEST_INPUT_FILE = "./day_1_part_1_test_input.txt"

def read_file(filename: str) -> list[str]:
    ret = []
    try:
        with open(filename) as f:
            for line in f:
                ret.append(line.rstrip().lower())
    except IOError:
        print(f"Error while trying to read {filename}")

    return ret

def determine_calibration_value(cal_val_line: str) -> int:
    for idx in range(len(cal_val_line)):
        if cal_val_line[idx].isdigit():
            ret = int(cal_val_line[idx]) * 10
            break

    for idx in range(len(cal_val_line) - 1, -1, -1):
        if cal_val_line[idx].isdigit():
            ret += int(cal_val_line[idx])
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
