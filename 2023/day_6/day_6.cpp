#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>

typedef std::pair<std::vector<long>, std::vector<long>> timeDistPair;

timeDistPair readFile(const std::string &filename, bool part2 = false)
{
    std::vector<long> times;
    std::vector<long> distances;
    std::ifstream input(filename);
    for(std::string line; getline(input, line);)
    {
        std::string buf;
        std::stringstream ss(line);
        std::vector<std::string> hold;
        std::vector<long> hold_long;
        std::string lineStart = "";

        while (ss >> buf)
        {
            hold.push_back(buf);
        }

        std::string dataType = hold[0];
        hold.erase(hold.begin());
        if (part2)
        {
            std::string hold_str = "";
            for (auto val : hold)
            {
                hold_str = hold_str + val;
            }
            if (dataType == "Time:") { times.push_back(std::stol(hold_str)); }
            else { distances.push_back(std::stol(hold_str)); }
        }
        else
        {
            for (auto val : hold)
            {
                hold_long.push_back(std::stol(val));
            }
            if (dataType == "Time:") { times = hold_long; }
            else { distances = hold_long; }
        }
    }

    return std::make_pair(times, distances);
}

long productOfNumberOfWays(timeDistPair tDP)
{
    long w_count = 0;
    long w_prod = 1;
    for (int i = 0; i < tDP.first.size(); i++)
    {
        for (long j = 0; j < tDP.first[i]; j++)
        {
            long distance = j * (tDP.first[i] - j);
            if (distance > tDP.second[i]) { w_count++; }
        }
        w_prod = w_prod * w_count;
        w_count = 0;
    }
    return w_prod;
}

int main()
{
    const std::string testFile = "day_6_test_input.txt";
    const std::string file = "day_6_input.txt";

    // Part 1
    auto testTimesAndDistancesP1 = readFile(testFile);
    auto testProductP1 = productOfNumberOfWays(testTimesAndDistancesP1);
    std::cout << "Test result (Part1): " << testProductP1 << std::endl;

    auto timesAndDistancesP1 = readFile(file);
    auto productP1 = productOfNumberOfWays(timesAndDistancesP1);
    std::cout << "Real result (Part1): " << productP1 << std::endl;

    // Part 2
    auto testTimesAndDistancesP2 = readFile(testFile, true);
    auto testProductP2 = productOfNumberOfWays(testTimesAndDistancesP2);
    std::cout << "Test result (Part2): " << testProductP2 << std::endl;

    auto timesAndDistancesP2 = readFile(file, true);
    auto productP2 = productOfNumberOfWays(timesAndDistancesP2);
    std::cout << "Test result (Part2): " << productP2 << std::endl;

    return 0;
}
