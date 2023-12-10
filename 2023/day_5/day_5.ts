type item = "seed" | "soil" | "fertilizer" | "water" | "light" | "temperature" | "humidity" | "location";

interface SeedMapEntry {
    dest: number,
    src: number,
    range: number
}

interface SeedMap {
    from: item,
    to: item,
    map: SeedMapEntry[]
}

interface SeedRange {
    start: number,
    len: number
}

interface Almanac {
    seeds: number[] | SeedRange[],
    mappings: SeedMap[] 
}

async function readFile(filename: string, part2: boolean = false) : Promise<Almanac> {
    const fileText = await Bun.file(filename).text();
    let seeds = [];
    let mappings: SeedMap[] = [];
    for (const line of fileText.split("\n")) {
        if (!seeds.length && line.startsWith("seeds:")) {
            if (!part2) {
                seeds = line.split(" ").slice(1).map(function(element: string) { return parseInt(element); });
            }
            else {
                const rawSeedRanges = line.split(" ").slice(1).map(function(element: string) { return parseInt(element); });
                for (let i = 0; i < rawSeedRanges.length; i = i + 2) {
                    seeds.push({start: rawSeedRanges[i], len: rawSeedRanges[i+1]} as SeedRange);
                }
            }
        }
        else if (line.includes("map")) {
            const map = line.replace(" map:","").split("-to-");
            mappings.push({from: map[0] as item, to: map[1] as item, map: []});
        }
        else if (line.length)
        {
            const mapEntry = line.split(" ").map(function(element: string) { return parseInt(element); });
            mappings[mappings.length - 1].map.push({dest: mapEntry[0], src: mapEntry[1], range: mapEntry[2]});
        }
    }

    return {seeds: seeds, mappings: mappings};
}

function getSmallestLocationValuesForSeeds(almanac: Almanac) : number {
    let lowestVal!: number;
    for (const seed of almanac.seeds) {
        if (typeof seed === "number")
        {
            let currentVal = seed;
            for (const mapping of almanac.mappings) {
                for (const map of mapping.map) {
                    if (currentVal >= map.src && currentVal <= map.src + map.range) {
                        currentVal = currentVal - map.src + map.dest;
                        break;
                    }
                }
                if (mapping.to === "location") {
                    if (typeof lowestVal === "undefined") { lowestVal = currentVal; }
                    else if (currentVal < lowestVal ) { lowestVal = currentVal; }
                }
            }
        }
        else {
            for (let i = seed.start; i < seed.start + seed.len; i++) {
                let currentVal = i;
                for (const mapping of almanac.mappings) {
                    for (const map of mapping.map) {
                        if (currentVal >= map.src && currentVal <= map.src + map.range) {
                            currentVal = currentVal - map.src + map.dest;
                            break;
                        }
                    }
                    if (mapping.to === "location") {
                        if (typeof lowestVal === "undefined") { lowestVal = currentVal; }
                        else if (currentVal < lowestVal ) { lowestVal = currentVal; }
                    }
                }
            }
        }
    }
    return lowestVal;
}

async function main() {
    const testFile = "day_5_test_input.txt";
    const file = "day_5_input.txt";

    // part 1
    const testAlmanacPart1 = await readFile(testFile);
    const testSmallestLocationPart1 = getSmallestLocationValuesForSeeds(testAlmanacPart1);
    console.log(`Test smallest location: ${testSmallestLocationPart1}`);
    
    const almanacPart1 = await readFile(file);
    const smallestLocationPart1 = getSmallestLocationValuesForSeeds(almanacPart1);
    console.log(`Real smallest location: ${smallestLocationPart1}`);

    // part 2 - this takes forever and doesn't work :(
    const testAlmanacPart2 = await readFile(testFile, true);
    const testSmallestLocationPart2 = getSmallestLocationValuesForSeeds(testAlmanacPart2);
    console.log(`Test smallest location: ${testSmallestLocationPart2}`);

    const almanacPart2 = await readFile(file, true);
    const smallestLocationPart2 = getSmallestLocationValuesForSeeds(almanacPart2);
    console.log(`Real smallest location: ${smallestLocationPart2}`)
}

main();