import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 1: The Tyranny of the Rocket Equation ---
 * https://adventofcode.com/2019/day/1
 * 
 * https://www.reddit.com/r/adventofcode/comments/e4axxe/2019_day_1_solutions/
 * 
 */

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function padL( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function calcFuel( pMass : number ) : number 
{
    return Math.floor( pMass / 3 ) - 2;
}


function testCalcFuel( pMass : number, pExpect : number ) : number 
{
    let fuel_needed = calcFuel( pMass );

    wl( "Mass " + padL( pMass, 7 ) + "  = Fuel " + padL( fuel_needed, 7 )  + "   " + ( fuel_needed === pExpect ? "### OK ###" : "----"));

    return fuel_needed;
}


function calcFuelRecursive( pMass : number ) : number 
{
    let fuel_needed = Math.floor( pMass / 3 ) - 2;

    if ( fuel_needed < 1 ) 
    {
        return 0;
    }

    return fuel_needed + calcFuelRecursive( fuel_needed );;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        let cur_mass = Number( cur_input_str );

        let fuel_needed = calcFuel( cur_mass );

        wl( "Mass " + padL( cur_mass, 7 ) + "  = Fuel " + padL( fuel_needed, 7 ) + "   " + padL( result_part_01, 10 ) );

        result_part_01 += fuel_needed;

        result_part_02 += calcFuelRecursive( cur_mass );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day01_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei() : void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, true );
    } )();
}


wl( "" );
wl( "Day 01: The Tyranny of the Rocket Equation" );
wl( "" );

testCalcFuel(     12,    2 );
testCalcFuel(     14,    2 );
testCalcFuel(   1969,   654 );
testCalcFuel( 100756, 33583 );

checkReaddatei();

wl( "" )
wl( "Day 01 - End " );
