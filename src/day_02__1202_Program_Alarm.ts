import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 2: 1202 Program Alarm ---
 * https://adventofcode.com/2019/day/2
 * 
 * https://www.reddit.com/r/adventofcode/comments/e4u0rw/2019_day_2_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2019/blob/main/src/day_02__1202_Program_Alarm.ts
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day02/day_02__1202_Program_Alarm.js
 * 
 * ROUND     0 - IP     0 | ADD      1 |     12      2 ->          3 |          1 +          2 ->           3
 * ROUND     1 - IP     4 | ADD      1 |      1      2 ->          3 |         12 +          2 ->          14
 * ROUND     2 - IP     8 | ADD      1 |      3      4 ->          3 |         14 +          1 ->          15
 * ROUND     3 - IP    12 | ADD      1 |      5      0 ->          3 |          1 +          1 ->           2
 * ROUND     4 - IP    16 | MUL      2 |     13      1 ->         19 |          5 *         12 ->          60
 * ROUND     5 - IP    20 | ADD      1 |     19      9 ->         23 |         60 +          3 ->          63
 * ROUND     6 - IP    24 | ADD      1 |      5     23 ->         27 |          1 +         63 ->          64
 * ROUND     7 - IP    28 | ADD      1 |     27      9 ->         31 |         64 +          3 ->          67
 * ROUND     8 - IP    32 | ADD      1 |      6     31 ->         35 |          2 +         67 ->          69
 * ROUND     9 - IP    36 | MUL      2 |     35      9 ->         39 |         69 *          3 ->         207
 * ROUND    10 - IP    40 | ADD      1 |     39      6 ->         43 |        207 +          2 ->         209
 * ROUND    11 - IP    44 | MUL      2 |      9     43 ->         47 |          3 *        209 ->         627
 * ROUND    12 - IP    48 | ADD      1 |     47      6 ->         51 |        627 +          2 ->         629
 * ROUND    13 - IP    52 | MUL      2 |     51      9 ->         55 |        629 *          3 ->        1887
 * ROUND    14 - IP    56 | ADD      1 |      5     55 ->         59 |          1 +       1887 ->        1888
 * ROUND    15 - IP    60 | MUL      2 |     59      6 ->         63 |       1888 *          2 ->        3776
 * ROUND    16 - IP    64 | ADD      1 |      9     63 ->         67 |          3 +       3776 ->        3779
 * ROUND    17 - IP    68 | ADD      1 |     67     10 ->         71 |       3779 +          4 ->        3783
 * ROUND    18 - IP    72 | ADD      1 |     71     13 ->         75 |       3783 +          5 ->        3788
 * ROUND    19 - IP    76 | MUL      2 |     13     75 ->         79 |          5 *       3788 ->       18940
 * ROUND    20 - IP    80 | ADD      1 |      6     79 ->         83 |          2 +      18940 ->       18942
 * ROUND    21 - IP    84 | MUL      2 |      9     83 ->         87 |          3 *      18942 ->       56826
 * ROUND    22 - IP    88 | ADD      1 |     87      6 ->         91 |      56826 +          2 ->       56828
 * ROUND    23 - IP    92 | MUL      2 |     10     91 ->         95 |          4 *      56828 ->      227312
 * ROUND    24 - IP    96 | MUL      2 |     13     95 ->         99 |          5 *     227312 ->     1136560
 * ROUND    25 - IP   100 | ADD      1 |      9     99 ->        103 |          3 +    1136560 ->     1136563
 * ROUND    26 - IP   104 | ADD      1 |      5    103 ->        107 |          1 +    1136563 ->     1136564
 * ROUND    27 - IP   108 | MUL      2 |      9    107 ->        111 |          3 *    1136564 ->     3409692
 * ROUND    28 - IP   112 | ADD      1 |    111      5 ->        115 |    3409692 +          1 ->     3409693
 * ROUND    29 - IP   116 | ADD      1 |    115      5 ->        119 |    3409693 +          1 ->     3409694
 * ROUND    30 - IP   120 | ADD      1 |     10    119 ->        123 |          4 +    3409694 ->     3409698
 * ROUND    31 - IP   124 | ADD      1 |     13    123 ->        127 |          5 +    3409698 ->     3409703
 * ROUND    32 - IP   128 | ADD      1 |      2    127 ->        131 |          2 +    3409703 ->     3409705
 * ROUND    33 - IP   132 | ADD      1 |    131     13 ->          0 |    3409705 +          5 ->     3409710
 * 
 * iteration   80  noun 79  verb 12  result  19690720
 * 
 * Result Part 1 = 3409710
 * Result Part 2 = 7912
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


function calcIntCode( pIntCodePrg : number[], pNoun : number, pVerb : number, pKnzDebug : boolean ) : number 
{
    let int_code_prg : number[] = pIntCodePrg.slice();

    int_code_prg[ 1 ] = pNoun;
    int_code_prg[ 2 ] = pVerb;

    let round_nr            : number = 0;
    let instruction_pointer : number = 0;

    while ( int_code_prg[ instruction_pointer ]! !== 99 )
    {
        let inc_ip : number = 1;
        let result : number = 0;

        if ( int_code_prg[ instruction_pointer ]! === 1 )
        {
            let parameter_1 = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = int_code_prg[ parameter_1 ]!;
            let var_b : number = int_code_prg[ parameter_2 ]!;

            result = var_a + var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " | ADD " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " + " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " "  )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else if ( int_code_prg[ instruction_pointer ]! === 2 )
        {
            let parameter_1 = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = int_code_prg[ parameter_1 ]!;
            let var_b : number = int_code_prg[ parameter_2 ]!;

            result = var_a * var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " | MUL " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " * " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " "  )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else
        {
            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " | --- " + padL( int_code_prg[ instruction_pointer ]!, 6 ) );
            }
        }

        instruction_pointer += inc_ip;

        round_nr++;
    }
   
    return int_code_prg[ 0 ]!;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let int_code_prg   : number[] = pArray[0]!.split( "," ).map(Number);

    int_code_prg[ 1 ] = 12;
    int_code_prg[ 2 ] =  2;

    result_part_01 = calcIntCode( int_code_prg, 12, 2, true );

    let iteration_nr : number = 0;

    outer : for ( let noun : number = 0; noun < 100; noun++ )
    {
        iteration_nr++;

        for ( let verb : number = 0; verb < 100; verb++ )
        {
            result_part_02 = calcIntCode( int_code_prg, noun, verb, false );

            if ( result_part_02 === 19690720 )
            {
                wl( "" );
                wl( "iteration " + padL( iteration_nr, 4) + "  noun " + padL( noun, 2) + "  verb " + padL( verb, 2) + "  result " + padL( result_part_02, 9 ) );

                result_part_02 = ( 100 * noun ) + verb;

                break outer;
            }
        }
    }

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


function testIntCode( pString : string )
{
    const int_code_prg : number[] = pString.split( "," ).map(Number);

    console.log(int_code_prg);
    
    calcIntCode( int_code_prg, 0, 0, true );

    console.log(int_code_prg);
}


wl( "" );
wl( "Day 02: 1202 Program Alarm" );
wl( "" );

//testIntCode( "1,0,0,0,99"          );
//testIntCode( "1,1,1,4,99,5,6,0,99" );

checkReaddatei();

wl( "" )
wl( "Day 02 - End " );

