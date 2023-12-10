import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { finished } from 'node:stream/promises';

interface Card {
    cardNum: number;
    winningNums: string[];
    yourNums: string[];
}

async function readFile(filename: string): Promise<string[]> {
    const lineReader = createInterface({
        input: createReadStream(filename)
    });

    let ret_array: string[] = [];
    lineReader.on('line', function (line: string) {
        ret_array.push(line);
    });

    await finished(lineReader);
    return ret_array;
}

function removeItemFromArray(arr: string[], item: string) {
    return arr.filter(element => element !== item);
}

function parseCards(cardArr: string[]) : Card[] {
    let cards: Card[] = [];
    for (let cardStr of cardArr) {
        cards.push(
            {
                cardNum: parseInt(cardStr.split(":")[0].replace(/  +/g, ' ').split(" ")[1]),
                winningNums: removeItemFromArray(cardStr.split(":")[1].split("|")[0].split(" "), ""),
                yourNums: removeItemFromArray(cardStr.split(":")[1].split("|")[1].split(" "), "")
            } satisfies Card
        );
    }
    return cards;
}

function getNumberOfWinsForCard(card: Card): number {
    let numOfWins = 0;
    for (const winningNum of card.winningNums) {
        if (card.yourNums.includes(winningNum)) {
            numOfWins++;
        }
    }
    return numOfWins;
}

function getPointsForCard(card: Card): number {
    let numOfWins = getNumberOfWinsForCard(card);
    return numOfWins ? 2 ** (numOfWins - 1) : 0;
}

function getTotalPoints(cards: Card[]): number {
    let total = 0;
    for (let card of cards) {
        total += getPointsForCard(card);
    }
    return total;
}

function getTotalScratchCards(cards: Card[]): number {
    let currentCards = cards;
    let count = 0;
    while (count < currentCards.length) {
        const numOfWins = getNumberOfWinsForCard(currentCards[count])
        for (let i = 0; i < numOfWins; i++) {
            if (currentCards[count].cardNum + i < cards.length) {
                currentCards.push(cards[currentCards[count].cardNum + i]);
            }
        }
        count++;
    }
    return count;
}

async function main() {
    const testInput = "day_4_test_input.txt";
    const input = "day_4_input.txt";

    const testCardArr = await readFile(testInput);
    const testCards = parseCards(testCardArr);

    const cardArr = await readFile(input);
    const cards = parseCards(cardArr);

    // part 1
    const testPoints = getTotalPoints(testCards);
    console.log(`Test total points: ${testPoints}`);

    const points = getTotalPoints(cards);
    console.log(`Real total points: ${points}`);

    // part 2
    const testTotalScratchCards = getTotalScratchCards(testCards);
    console.log(`Test total scratch cards: ${testTotalScratchCards}`);

    const totalScratchCards = getTotalScratchCards(cards);
    console.log(`Real total scratch cards: ${totalScratchCards}`);
}

main();
