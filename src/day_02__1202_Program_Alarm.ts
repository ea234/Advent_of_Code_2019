import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 2: 1202 Program Alarm ---
 * https://adventofcode.com/2019/day/2
 * 
 * https://www.reddit.com/r/adventofcode/comments/e4u0rw/2019_day_2_solutions/
 * 
 */

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function calcIntCode( int_code_prg : number[] ) : number 
{
    let pgm_pointer = 0;

    while ( int_code_prg[ pgm_pointer ]! !== 99 )
    {
        let var_a : number = int_code_prg[ int_code_prg[ pgm_pointer + 1 ]! ]!;
        let var_b : number = int_code_prg[ int_code_prg[ pgm_pointer + 2 ]! ]!;

        let result : number = 0;

        if ( int_code_prg[ pgm_pointer ]! === 1 )
        {
            result = var_a + var_b;
        }
        else if ( int_code_prg[ pgm_pointer ]! === 2 )
        {
            result = var_a * var_b;
        }

        int_code_prg[ int_code_prg[ pgm_pointer + 3 ]! ] = result;

        pgm_pointer += 4;

    }
   
    return int_code_prg[ 0 ]!;
}


function testIntCode( pString : string )
{
    const int_code_prg : number[] = pString.split( "," ).map(Number);

    console.log(int_code_prg);
    
    calcIntCode( int_code_prg );

    console.log(int_code_prg);
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    const int_code_prg : number[] = pArray[0]!.split( "," ).map(Number);

    int_code_prg[ 1 ] = 12;
    int_code_prg[ 2 ] =  2;

    result_part_01 = calcIntCode( int_code_prg );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day02_input.txt";

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
wl( "Day 02: 1202 Program Alarm" );
wl( "" );

testIntCode( "1,0,0,0,99"          );
testIntCode( "1,1,1,4,99,5,6,0,99" );

checkReaddatei();

wl( "" )
wl( "Day 02 - End " );
