import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 5: Sunny with a Chance of Asteroids ---
 * https://adventofcode.com/2019/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/e6carb/2019_day_5_solutions/
 * 
 *  
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__Sunny_With_A_Chance_Of_Asteroids.js
 * 
 * Day 05: Sunny with a Chance of Asteroids
 * 
 * ROUND     0 - IP     0 PP | SET      3 |    225        ->        225 |          1 *            ->           1
 * ROUND     1 - IP     2 PP | ADD      1 |    225      6 ->          6 |          1 +       1100 ->        1101
 * ROUND     2 - IP     6 II | ADD   1101 |      1    238 ->        225 |          1 +        238 ->         239
 * ROUND     3 - IP    10 IP | OUT    104 |      0        ->          0 |          0 *            ->           0
 * ROUND     4 - IP    12 II | ADD   1101 |     11     91 ->        225 |         11 +         91 ->         102
 * ROUND     5 - IP    16 PI | MUL   1002 |    121     77 ->        224 |         82 *         77 ->        6314
 * ROUND     6 - IP    20 IP | ADD    101 |  -6314    224 ->        224 |      -6314 +       6314 ->           0
 * ROUND     7 - IP    24 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND     8 - IP    26 PI | MUL   1002 |    223      8 ->        223 |          0 *          8 ->           0
 * ROUND     9 - IP    30 PI | ADD   1001 |    224      3 ->        224 |          0 +          3 ->           3
 * ROUND    10 - IP    34 PP | ADD      1 |    223    224 ->        223 |          0 +          3 ->           3
 * ROUND    11 - IP    38 II | MUL   1102 |     74     62 ->        225 |         74 *         62 ->        4588
 * ROUND    12 - IP    42 II | MUL   1102 |     82      7 ->        224 |         82 *          7 ->         574
 * ROUND    13 - IP    46 PI | ADD   1001 |    224   -574 ->        224 |        574 +       -574 ->           0
 * ROUND    14 - IP    50 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    15 - IP    52 IP | MUL    102 |      8    223 ->        223 |          8 *          3 ->          24
 * ROUND    16 - IP    56 PI | ADD   1001 |    224      3 ->        224 |          0 +          3 ->           3
 * ROUND    17 - IP    60 PP | ADD      1 |    224    223 ->        223 |          3 +         24 ->          27
 * ROUND    18 - IP    64 II | ADD   1101 |     28     67 ->        225 |         28 +         67 ->          95
 * ROUND    19 - IP    68 II | MUL   1102 |     42     15 ->        225 |         42 *         15 ->         630
 * ROUND    20 - IP    72 PP | MUL      2 |    196     96 ->        224 |         78 *         57 ->        4446
 * ROUND    21 - IP    76 IP | ADD    101 |  -4446    224 ->        224 |      -4446 +       4446 ->           0
 * ROUND    22 - IP    80 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    23 - IP    82 IP | MUL    102 |      8    223 ->        223 |          8 *         27 ->         216
 * ROUND    24 - IP    86 IP | ADD    101 |      6    224 ->        224 |          6 +          0 ->           6
 * ROUND    25 - IP    90 PP | ADD      1 |    223    224 ->        223 |        216 +          6 ->         222
 * ROUND    26 - IP    94 II | ADD   1101 |     86     57 ->        225 |         86 +         57 ->         143
 * ROUND    27 - IP    98 PP | ADD      1 |    148     69 ->        224 |         35 +         42 ->          77
 * ROUND    28 - IP   102 PI | ADD   1001 |    224    -77 ->        224 |         77 +        -77 ->           0
 * ROUND    29 - IP   106 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    30 - IP   108 IP | MUL    102 |      8    223 ->        223 |          8 *        222 ->        1776
 * ROUND    31 - IP   112 PI | ADD   1001 |    224      2 ->        224 |          0 +          2 ->           2
 * ROUND    32 - IP   116 PP | ADD      1 |    223    224 ->        223 |       1776 +          2 ->        1778
 * ROUND    33 - IP   120 II | ADD   1101 |     82     83 ->        225 |         82 +         83 ->         165
 * ROUND    34 - IP   124 IP | ADD    101 |     87     14 ->        224 |         87 +         91 ->         178
 * ROUND    35 - IP   128 PI | ADD   1001 |    224   -178 ->        224 |        178 +       -178 ->           0
 * ROUND    36 - IP   132 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    37 - IP   134 PI | MUL   1002 |    223      8 ->        223 |       1778 *          8 ->       14224
 * ROUND    38 - IP   138 IP | ADD    101 |      7    224 ->        224 |          7 +          0 ->           7
 * ROUND    39 - IP   142 PP | ADD      1 |    223    224 ->        223 |      14224 +          7 ->       14231
 * ROUND    40 - IP   146 II | ADD   1101 |     38     35 ->        225 |         38 +         35 ->          73
 * ROUND    41 - IP   150 IP | MUL    102 |     31     65 ->        224 |         31 *         28 ->         868
 * ROUND    42 - IP   154 PI | ADD   1001 |    224   -868 ->        224 |        868 +       -868 ->           0
 * ROUND    43 - IP   158 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    44 - IP   160 PI | MUL   1002 |    223      8 ->        223 |      14231 *          8 ->      113848
 * ROUND    45 - IP   164 PI | ADD   1001 |    224      5 ->        224 |          0 +          5 ->           5
 * ROUND    46 - IP   168 PP | ADD      1 |    223    224 ->        223 |     113848 +          5 ->      113853
 * ROUND    47 - IP   172 II | ADD   1101 |     57     27 ->        224 |         57 +         27 ->          84
 * ROUND    48 - IP   176 PI | ADD   1001 |    224    -84 ->        224 |         84 +        -84 ->           0
 * ROUND    49 - IP   180 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    50 - IP   182 IP | MUL    102 |      8    223 ->        223 |          8 *     113853 ->      910824
 * ROUND    51 - IP   186 PI | ADD   1001 |    224      7 ->        224 |          0 +          7 ->           7
 * ROUND    52 - IP   190 PP | ADD      1 |    223    224 ->        223 |     910824 +          7 ->      910831
 * ROUND    53 - IP   194 II | ADD   1101 |     61     78 ->        225 |         61 +         78 ->         139
 * ROUND    54 - IP   198 PI | ADD   1001 |     40     27 ->        224 |         62 +         27 ->          89
 * ROUND    55 - IP   202 IP | ADD    101 |    -89    224 ->        224 |        -89 +         89 ->           0
 * ROUND    56 - IP   206 PP | OUT      4 |    224        ->        224 |          0 *            ->           0
 * ROUND    57 - IP   208 PI | MUL   1002 |    223      8 ->        223 |     910831 *          8 ->     7286648
 * ROUND    58 - IP   212 PI | ADD   1001 |    224      1 ->        224 |          0 +          1 ->           1
 * ROUND    59 - IP   216 PP | ADD      1 |    224    223 ->        223 |          1 +    7286648 ->     7286649
 * ROUND    60 - IP   220 PP | OUT      4 |    223        ->        223 |    7286649 *            ->     7286649
 * 
 * 0
 * 0
 * 0
 * 0
 * 0
 * 0
 * 0
 * 0
 * 0
 * 7286649
 * 
 * Result Part 1 = 3
 * Result Part 2 = 0
 * 
 */
const POSITION_MODE  : number = 0;
const IMMEDIATE_MODE : number = 1;

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

    if ( pNoun >= 0 ) int_code_prg[ 1 ] = pNoun;
    if ( pVerb >= 0 ) int_code_prg[ 2 ] = pVerb;

    let round_nr            : number = 0;
    let instruction_pointer : number = 0;

    let parameter_mode : number = POSITION_MODE;

    let out_put_buf : string = "";

    while ( int_code_prg[ instruction_pointer ]! !== 99 )
    {
        let inc_ip : number = 1;
        let result : number = 0;

        let cur_instruction : number = int_code_prg[ instruction_pointer ]!;

        let op_code : number = cur_instruction % 100;

        let param_m1 : number = Math.floor( cur_instruction / 100 ) % 10;

        let param_m2 : number = Math.floor( cur_instruction / 1000 ) % 10;
        //let param_m3 : number = Math.floor( cur_instruction / 10000 ) % 10;

        let inst_str : string = (( param_m1 === IMMEDIATE_MODE ) ? "I" : "P" ) + (( param_m2 === IMMEDIATE_MODE ) ? "I" : "P" )


        if ( op_code === 1 )
        {
            let parameter_1 = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = ( param_m1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_m2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            result = var_a + var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | ADD " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " + " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " "  )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else if ( op_code === 2 )
        {
            let parameter_1 = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = ( param_m1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_m2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            result = var_a * var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | MUL " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " * " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " "  )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else if ( op_code === 3 )
        {
            let parameter_1 = int_code_prg[ instruction_pointer + 1 ]!;

            let var_a : number = 1;// ( param_m1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;

            result = var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | SET " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( parameter_1, 10 ) + " | " + padL( var_a, 10 ) + " * " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " "  )
            }

            int_code_prg[ parameter_1 ] = result;

            inc_ip = 2;
        }
        else if ( op_code === 4 )
        {
            let parameter_1 = int_code_prg[ instruction_pointer + 1 ]!;

            let var_a : number =  ( param_m1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;

            if ( parameter_mode === IMMEDIATE_MODE )
            {
                var_a = int_code_prg[ parameter_1 ]!;
            }

            result = var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | OUT " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( parameter_1, 10 ) + " | " + padL( var_a, 10 ) + " * " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " "  )
            }

            out_put_buf += "\n" + result;

            inc_ip = 2;
        }
        else
        {
            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | --- " + padL( int_code_prg[ instruction_pointer ]!, 6 ) );
            }
        }

        instruction_pointer += inc_ip;

        round_nr++;
    }

    wl( out_put_buf );
   
    return int_code_prg[ 0 ]!;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let int_code_prg   : number[] = pArray[0]!.split( "," ).map(Number);

    result_part_01 = calcIntCode( int_code_prg, -1, -1, true );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath : string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day05_input.txt";

    const lines : string[] = [];

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
wl( "Day 05: Sunny with a Chance of Asteroids" );
wl( "" );

//testIntCode( "1,0,0,0,99"          );
//testIntCode( "1,1,1,4,99,5,6,0,99" );

checkReaddatei();
// 12128121

wl( "" )
wl( "Day 05 - End " );
