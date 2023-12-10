import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { finished } from 'node:stream/promises';

async function readFile(filename: string): Promise<string[][]> {
    const lineReader = createInterface({
        input: createReadStream(filename)
    });

    let ret_array: string[][] = [];
    lineReader.on('line', function (line: string) {
        ret_array.push(line.split(""));
    });

    await finished(lineReader);
    return ret_array;
}

function findSumOfPartNumbers(schematic: string[][]) {
    function checkForSymbols(idxsToCheck: number[][]) : boolean {
        for (let idx of idxsToCheck) {
            if (idx[1] < 0 || idx[1] >= schematic.length) { continue; }
            if (idx[0] < 0 || idx[0] >= schematic[idx[1]].length) { continue; }

            if (!schematic[idx[1]][idx[0]].match(/^[0-9a-zA-Z]+$/) && schematic[idx[1]][idx[0]] !== ".") {
                return true;
            }
        }
        return false;
    }

    let numberHold: string = "";
    let partList: number[] = [];
    let checkList: number[][] = [];
    for (let i = 0; i < schematic.length; i++) {
        for (let j = 0; j < schematic[i].length; j++) {
            if (!Number.isNaN(+schematic[i][j])) {
                checkList.push([j,i+1], [j,i-1]);
                if (!numberHold) {
                    checkList.push([j-1,i], [j-1,i+1], [j-1,i-1]);
                }
                numberHold = numberHold + schematic[i][j];
                if (j !== schematic[i].length - 1) { continue; }
            }

            if (numberHold){
                checkList.push([j,i], [j,i+1], [j,i-1]);
                if (checkForSymbols(checkList)) { partList.push(parseInt(numberHold));}
                checkList = [];
                numberHold = "";
            }
        }
    }

    return partList.reduce((partialSum, a) => partialSum + a, 0);
}

function findSumOfGearRatios(schematic: string[][]) {
    function checkForStar(idxsToCheck: number[][]) : number[] {
        for (let idx of idxsToCheck) {
            if (idx[1] < 0 || idx[1] >= schematic.length) { continue; }
            if (idx[0] < 0 || idx[0] >= schematic[idx[1]].length) { continue; }

            if (schematic[idx[1]][idx[0]] === "*") {
                return [idx[1], idx[0]]
            }
        }
        return [-1, -1];
    }

    function arraysEqual(a: number[], b: number[]) {
        if (a[0] === -1 && a[1] === -1 && b[0] === -1 && b[1] === -1) { return false; }
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }

    let numberHold: string = "";
    let starsAndNumbers = [];
    let checkList: number[][] = [];
    for (let i = 0; i < schematic.length; i++) {
        for (let j = 0; j < schematic[i].length; j++) {
            if (!Number.isNaN(+schematic[i][j])) {
                checkList.push([j,i+1], [j,i-1]);
                if (!numberHold) {
                    checkList.push([j-1,i], [j-1,i+1], [j-1,i-1]);
                }
                numberHold = numberHold + schematic[i][j];
                if (j !== schematic[i].length - 1) { continue; }
            }

            if (numberHold){
                checkList.push([j,i], [j,i+1], [j,i-1]);
                const starPos = checkForStar(checkList);
                if (starPos[0] !== -1 && starPos[1] !== -1) {
                    starsAndNumbers.push([numberHold, starPos]);
                }
                checkList = [];
                numberHold = "";
            }
        }
    }

    let gearRatios: number[] = [];
    for (let i = 0; i < starsAndNumbers.length; i++) {
        let count = 1;
        let otherNum: string|number[] = "";
        for (let j = 0; j < starsAndNumbers.length; j++) {
            if (i !== j && arraysEqual(starsAndNumbers[i][1] as number[], starsAndNumbers[j][1] as number[])) {
                count++;
                otherNum = starsAndNumbers[j][0];
            }
        }
        if (count === 2) {
            gearRatios.push(parseInt(starsAndNumbers[i][0] as string) * parseInt(otherNum as string));
            starsAndNumbers[i][1] = [-1, -1];
        }
    }

    return gearRatios.reduce((partialSum, a) => partialSum + a, 0);
}

async function main() {
    const testInputFile = "day_3_test_input.txt";
    const testInput = await readFile(testInputFile);

    const inputFile = "day_3_input.txt";
    const input = await readFile(inputFile);

    // part 1
    const testSumOfPartNums = findSumOfPartNumbers(testInput);
    console.log(`Test sum of parts: ${testSumOfPartNums}`);

    const sumOfPartNums = findSumOfPartNumbers(input);
    console.log(`Real sum of parts: ${sumOfPartNums}`);

    // part 2
    const testSumOfGearRatios = findSumOfGearRatios(testInput);
    console.log(`Test sum of gear ratios: ${testSumOfGearRatios}`);

    const sumOfGearRatios = findSumOfGearRatios(input);
    console.log(`Real sum of gear ratios: ${sumOfGearRatios}`);
}

main()
