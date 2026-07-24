import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 3: Crossed Wires ---
 * https://adventofcode.com/2019/day/3
 * 
 * https://www.reddit.com/r/adventofcode/comments/e5bz2w/2019_day_3_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2019/blob/main/src/day_03__Crossed_Wires.ts
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day03/day_03__Crossed_Wires.js
 * 
 * Day 03: Crossed Wires
 * 
 * ------------------------------------------------------------------
 *  R   8  delta_row  0  delta_col  1
 *  U   5  delta_row -1  delta_col  0
 *  L   5  delta_row  0  delta_col -1
 *  D   3  delta_row  1  delta_col  0
 * 
 *  U   7  delta_row -1  delta_col  0
 *  R   6  delta_row  0  delta_col  1
 *  D   4  delta_row  1  delta_col  0
 * Steps Wire 1     15 + Wire 2     15 = 30
 *  L   4  delta_row  0  delta_col -1
 * 
 *      01234567
 *   3  2222222
 *   4  2     2
 *   5  2  11101
 *   6  2  1  2
 *   7  2 20222
 *   8  2  1
 *   9  2
 * 
 * Result Part 1 = 6
 * Result Part 2 = 30
 * 
 * ------------------------------------------------------------------
 * 
 * Steps Wire 1    290 + Wire 2    334 = 624
 * Steps Wire 1    206 + Wire 2    404 = 610
 * 
 * Result Part 1 = 159
 * Result Part 2 = 610
 * 
 * ------------------------------------------------------------------
 * 
 * Steps Wire 1    404 + Wire 2    232 = 636
 * Steps Wire 1    154 + Wire 2    256 = 410
 * 
 * Result Part 1 = 135
 * Result Part 2 = 410
 * 
 * ------------------------------------------------------------------
 * 
 * Steps Wire 1  75886 + Wire 2   1686 = 77572
 * Steps Wire 1   8001 + Wire 2   4933 = 12934
 * 
 * Result Part 1 = 308
 * Result Part 2 = 12934
 * 
 */

const CHAR_NO_MAP   : number = -1;

const PREFIX_PATH   : string = "PATH_";
const PREFIX_STEPS  : string = "STEPS_";

type PropertieMap = Record< string, number >;


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


function getDebugMap( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += "" + ( pHashMap[ PREFIX_PATH + "R" + cur_row  + "C" + cur_col ] ?? " " );
        }
    }

    return str_result;
}


/*
 * https://github.com/ea234/Advent_of_Code_2018/blob/main/src/de/ea234/aoc2018/day06/Day06_ChronalCoordinates.java#L531
 */
function calcDistance( pPosA : number, pPosB : number ) : number 
{
    if ( ( pPosA >= 0 ) && ( pPosB >= 0 ) )
    {
      if ( pPosB >= pPosA )
      {
        return pPosB - pPosA;
      }

      return pPosA - pPosB;
    }

    if ( ( pPosA <= 0 ) && ( pPosB <= 0 ) )
    {
      if ( pPosB >= pPosA )
      {
        return Math.abs( pPosB - pPosA );
      }

      return Math.abs( pPosA - pPosB );
    }

    return Math.abs( pPosA ) + Math.abs( pPosB );
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    wl( "" );
    wl( "------------------------------------------------------------------" );

    let grid_row_min           : number = 10_000;
    let grid_col_min           : number = 10_000;

    let grid_row_max           : number = -10_000;
    let grid_col_max           : number = -10_000;

    let central_point_row      : number = 10;
    let central_point_col      : number = 10;

    let map_input              : PropertieMap = {};

    let wire_nr                : number = 0;

    let min_manhatten_distance : number = Number.MAX_SAFE_INTEGER;
    let min_steps_intersection : number = Number.MAX_SAFE_INTEGER;

    for ( const cur_input_str of pArray ) 
    {
        wire_nr++;

        let char_wire : number = wire_nr;

        let instructions : string[] = cur_input_str.split( "," );

        let cur_row   : number = central_point_row;
        let cur_col   : number = central_point_col;

        let cur_steps : number = 0;

        for ( let instruction of instructions )
        {
            let direction : string = instruction[0]!;

            let amount    : number = Number( instruction.substring( 1 ) );

            let delta_row : number = 0;
            let delta_col : number = 0;

                 if ( direction == "L" ) { delta_col = -1; }
            else if ( direction == "R" ) { delta_col =  1; }
            else if ( direction == "U" ) { delta_row = -1; }
            else if ( direction == "D" ) { delta_row =  1; }

            if ( pKnzDebug )
            {
                wl( " " + direction + " " + padL( amount, 3 ) + "  delta_row " + padL( delta_row,2 ) + "  delta_col " + padL( delta_col, 2 ) + " " );
            }

            for ( let cur_step : number = 0; cur_step < amount; cur_step++ )
            {
                cur_steps++;

                cur_row += delta_row;
                cur_col += delta_col;

                grid_row_min = Math.min( grid_row_min, cur_row );
                grid_row_max = Math.max( grid_row_max, cur_row );

                grid_col_min = Math.min( grid_col_min, cur_col );
                grid_col_max = Math.max( grid_col_max, cur_col );

                let cur_key_coordinates : string = "R" + cur_row + "C" + cur_col;

                let cur_map_char : number = map_input[ PREFIX_PATH + cur_key_coordinates ]! ?? CHAR_NO_MAP;

                map_input[ PREFIX_STEPS + wire_nr + "_" + cur_key_coordinates ] = cur_steps;

                if (( cur_map_char === CHAR_NO_MAP ) || ( cur_map_char === char_wire ))
                {
                    map_input[ PREFIX_PATH + cur_key_coordinates ] = char_wire;
                }
                else
                {
                    let cur_manhatten_distance : number = calcDistance( cur_row, central_point_row ) + 
                                                          calcDistance( cur_col, central_point_col );

                    if ( cur_manhatten_distance < min_manhatten_distance )
                    {
                        min_manhatten_distance = cur_manhatten_distance;
                    }

                    let cur_steps : number = map_input[ PREFIX_STEPS + "1" + "_" + cur_key_coordinates ]! + 
                                             map_input[ PREFIX_STEPS + "2" + "_" + cur_key_coordinates ]!;
                    
                    if ( cur_steps < min_steps_intersection )
                    {
                        min_steps_intersection = cur_steps;

                        wl( "Steps Wire 1 " + padL( map_input[ PREFIX_STEPS + "1" + "_" + cur_key_coordinates ]!, 6 ) + " + Wire 2 " + padL( map_input[ PREFIX_STEPS + "2" + "_" + cur_key_coordinates ]!, 6 ) + " = " + cur_steps );
                    }

                    map_input[ PREFIX_PATH + cur_key_coordinates ] = 0;
                }
            }
        }

        wl( "" );
        wl( "" );
    }

    if ( pKnzDebug )
    {
        wl( "" );
        wl( getDebugMap( map_input, grid_row_min, grid_col_min, grid_row_max, grid_col_max ) );
        wl( "" );
    }

    wl( "" );
    wl( "Result Part 1 = " + min_manhatten_distance );
    wl( "Result Part 2 = " + min_steps_intersection );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath : string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day03_input.txt";

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

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "R8,U5,L5,D3" );
    array_test.push( "U7,R6,D4,L4" );

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "R75,D30,R83,U83,L12,D49,R71,U7,L72" );
    array_test.push( "U62,R66,U55,R34,D71,R55,D58,R83"    );

    return array_test;
}


function getTestArray3() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51" );
    array_test.push( "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"        );

    return array_test;
}


wl( "" );
wl( "Day 03: Crossed Wires" );
wl( "" );

calcArray( getTestArray1(), true  ); //   6
calcArray( getTestArray2(), false ); // 159
calcArray( getTestArray3(), false ); // 135

checkReaddatei();

wl( "" )
wl( "Day 03 - End " );

