#include <iostream>
#include <vector>
#include <set>
#include <bits/stdc++.h>
#include <ctype.h>
#include <fstream>
#include <sstream>

static int part2 = false; // not ideal, but simplest way to switch between p1/p2

enum class Strength
{
    FIVE_OF_A_KIND = 6,
    FOUR_OF_A_KIND = 5,
    FULL_HOUSE = 4,
    THREE_OF_A_KIND = 3,
    TWO_PAIR = 2,
    ONE_PAIR = 1,
    HIGH_CARD = 0
};

std::string strengthToStr(Strength stren) // For debugging
{
    switch (stren)
    {
        case Strength::FIVE_OF_A_KIND:
            return "FIVE_OF_A_KIND";
        case Strength::FOUR_OF_A_KIND:
            return "FOUR_OF_A_KIND";
        case Strength::FULL_HOUSE:
            return "FULL_HOUSE";
        case Strength::THREE_OF_A_KIND:
            return "THREE_OF_A_KIND";
        case Strength::TWO_PAIR:
            return "TWO_PAIR";
        case Strength::ONE_PAIR:
            return "ONE_PAIR";
        case Strength::HIGH_CARD:
            return "HIGH_CARD";
    }
    return "Could not convert Strength to String";
}

int Cardtoi(char c)
{
    if (isdigit(c))
    {
        return c - '0';
    }

    switch (c)
    {
        case 'A':
            return 14;
        case 'K':
            return 13;
        case 'Q':
            return 12;
        case 'J':
            return part2 ? 1 : 11;
        case 'T':
            return 10;
    }

    throw std::logic_error("Unable to convert card value to int");
}

struct Hand
{
    Hand(std::vector<char> c, int b)
    {
        cards = c;
        bid = b;
        strength = part2 ? calcStrengthPart2() : calcStrength();
    }

    std::vector<char> cards;
    int bid;
    Strength strength;

    Strength calcStrength() const
    {
        std::map<char, int> cardMap;
        for (char c : cards)
        {
            if (cardMap.count(c) != 0) { cardMap[c]++; }
            else { cardMap[c] = 1; }
        }

        switch (cardMap.size())
        {
            case 1:
                return Strength::FIVE_OF_A_KIND;
            case 2:
            {
                // Possibilities here are 4 + 1 or 3 + 2 
                // So could either be four of kind or full house
                for (auto &[c, o] : cardMap)
                {
                    if (o == 4 || o == 1 ) { return Strength::FOUR_OF_A_KIND; }
                    else if (o == 3 || o == 2) { return Strength::FULL_HOUSE; }
                }
            }
            case 3:
            {
                // Possibilities here are 3 + 1 + 1 or 2 + 2 + 1
                // So could either be Three of a kind or Two pair
                for (auto &[c, o] : cardMap)
                {
                    if (o == 3) { return Strength::THREE_OF_A_KIND; }
                    else if (o == 2) { return Strength::TWO_PAIR; }
                }
            }
            case 4:
            {
                // Only possibilty here are 2 + 1 + 1 + 1
                return Strength::ONE_PAIR;
            }
            case 5:
                return Strength::HIGH_CARD;
        }

        throw std::logic_error("Error: Could not determine strength of card;");
    }

    Strength calcStrengthPart2() const
    {
        std::map<char, int> cardMap;
        int noOfJokers = 0;
        for (char c : cards)
        {
            if (c == 'J') { noOfJokers++; continue; }

            if (cardMap.count(c) != 0) { cardMap[c]++; }
            else { cardMap[c] = 1; }
        }

        char largestKey = '0'; // default value
        for (auto &[c, o] : cardMap)
        {
            if (largestKey == '0') { largestKey = c; continue;}
            if (o > cardMap[largestKey]) { largestKey = c; } 
        }
        cardMap[largestKey] += noOfJokers;

        switch (cardMap.size())
        {
            case 1:
                return Strength::FIVE_OF_A_KIND;
            case 2:
            {
                // Possibilities here are 4 + 1 or 3 + 2 
                // So could either be four of kind or full house
                for (auto &[c, o] : cardMap)
                {
                    if (o == 4 || o == 1) { return Strength::FOUR_OF_A_KIND; }
                    else if (o == 3 || o == 2) { return Strength::FULL_HOUSE; }
                }
            }
            case 3:
            {
                // Possibilities here are 3 + 1 + 1 or 2 + 2 + 1
                // So could either be Three of a kind or Two pair
                for (auto &[c, o] : cardMap)
                {
                    if (o == 3) { return Strength::THREE_OF_A_KIND; }
                    else if (o == 2) { return Strength::TWO_PAIR; }
                }
            }
            case 4:
            {
                // Only possibilty here are 2 + 1 + 1 + 1
                return Strength::ONE_PAIR;
            }
            case 5:
                return Strength::HIGH_CARD;
        }
    }

    friend bool operator<(const Hand &lhs, const Hand &rhs)
    {
        if (lhs.strength < rhs.strength) { return true; }
        else if (lhs.strength > rhs.strength) { return false; }

        for (int i = 0; i < lhs.cards.size(); i++)
        {
            if (Cardtoi(lhs.cards[i]) < Cardtoi(rhs.cards[i])) { return true; }
            else if (Cardtoi(lhs.cards[i]) > Cardtoi(rhs.cards[i])) { return false; }
        }

        return false;
    }
};

std::vector<Hand> readFile(std::string filename)
{
    std::vector<Hand> hands;
    std::ifstream input(filename);
    for(std::string line; getline(input, line);)
    {
        std::string buf;
        std::stringstream ss(line);
        std::vector<std::string> hold;

        while (ss >> buf)
        {
            hold.push_back(buf);
        }

        std::vector<char> cards(hold[0].begin(), hold[0].end());
        hands.push_back(Hand(cards, std::stoi(hold[1])));
    }
    return hands;
}

// expects a sorted vector
long calcWinnings(const std::vector<Hand> &hands)
{
    long total = 0;
    for (int i = 0; i < hands.size(); i++)
    {
        long cardTotal = hands[i].bid * (i + 1);
        total += cardTotal;
    }
    return total;
}

int main()
{
    const std::string testFile = "day_7_test_input.txt";
    const std::string file = "day_7_input.txt";

    // Part 1
    auto testHands = readFile(testFile);
    std::sort(testHands.begin(), testHands.end());
    const auto testWinnings = calcWinnings(testHands);
    std::cout << "Test Winnings: " << testWinnings << std::endl;

    auto hands = readFile(file);
    std::sort(hands.begin(), hands.end());
    const auto winnings = calcWinnings(hands);
    std::cout << "Real Winnings: " << winnings << std::endl;

    // Part 2
    part2 = true;
    auto testHandsP2 = readFile("day_7_test_input.txt");
    std::sort(testHandsP2.begin(), testHandsP2.end());
    const auto testWinningsP2 = calcWinnings(testHandsP2);
    std::cout << "Test Winnings: " << testWinningsP2 << std::endl;

    auto handsP2 = readFile(file);
    std::sort(handsP2.begin(), handsP2.end());
    const auto winningsP2 = calcWinnings(handsP2);
    std::cout << "Real Winnings: " << winningsP2 << std::endl;

    return 0;
}
