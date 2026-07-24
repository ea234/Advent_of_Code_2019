import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 24: Planet of Discord ---
 * https://adventofcode.com/2019/day/24
 * 
 * https://www.reddit.com/r/adventofcode/comments/18pnycy/2023_day_24_solutions/
 * 
 */

type PropertieMap = Record< string, number >;

const MAP_BUG         : number = 1;
const MAP_EMPTY_SPACE : number = 0;

const MAP_1 : string = "MAP_1";
const MAP_2 : string = "MAP_2";

const STR_COMBINE_SPACER : string = "   "; 


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


function combineStrings( pString1 : string | undefined | null, pString2 : string | undefined | null ) : string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
}


function getDebugMap( pHashMap : PropertieMap, pPrefixMap : string, pMaxRows : number, pMaxCols : number ): string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += ( pHashMap[ pPrefixMap +"R" + cur_row  + "C" + cur_col ] ?? MAP_EMPTY_SPACE ) == MAP_EMPTY_SPACE ? "." : "#";
        }

        str_result += "\n";
    }

    return str_result;
}


function calcCell( pHashMap : PropertieMap, pPrefixMapRead : string, pPrefixMapWrite : string, pRow : number, pCol : number, pKnzDebug : boolean ) : number
{
    let cur_cell_val : number = pHashMap[ pPrefixMapRead + "R" + pRow + "C" + pCol ]! ?? MAP_EMPTY_SPACE;

    let value_right  : number = pHashMap[ pPrefixMapRead + "R" + pRow + "C" + ( pCol + 1 ) ] ?? MAP_EMPTY_SPACE;
    let value_left   : number = pHashMap[ pPrefixMapRead + "R" + pRow + "C" + ( pCol - 1 ) ] ?? MAP_EMPTY_SPACE;
    let value_above  : number = pHashMap[ pPrefixMapRead + "R" + ( pRow - 1 ) + "C" + pCol ] ?? MAP_EMPTY_SPACE;
    let value_below  : number = pHashMap[ pPrefixMapRead + "R" + ( pRow + 1 ) + "C" + pCol ] ?? MAP_EMPTY_SPACE;

    let value_total = value_above + value_below + value_left + value_right;

    /*
     * Bug To Empty Space
     *
     * A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
     */
    if ( cur_cell_val === MAP_BUG )
    {
        if ( value_total == 1 )
        {
            /*
             * If there is exactly one bug adjacent to the current cell,
             * the cell remains a bug.
             */
            pHashMap[ pPrefixMapWrite + "R" + pRow + "C" + pCol ] = MAP_BUG;
        }
        else
        {
            /*
             * If there are more than 1 or 0 bugs adjacent to the current cell,
             * the cell becomes empty space
             */
            pHashMap[ pPrefixMapWrite + "R" + pRow + "C" + pCol ] = MAP_EMPTY_SPACE;
        }
    }


    /*
     * An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
     */

    else if ( cur_cell_val === MAP_EMPTY_SPACE )
    {
        if ( ( value_total == 1 ) || ( value_total == 2 ) )
        {
            pHashMap[ pPrefixMapWrite + "R" + pRow + "C" + pCol ] = MAP_BUG;
        }
        else
        {
            pHashMap[ pPrefixMapWrite + "R" + pRow + "C" + pCol ] = MAP_EMPTY_SPACE;
        }
    }

    return 1;
}


function calcBiodiversityRating( pHashMap : PropertieMap, pPrefixMap : string, pMaxRows : number, pMaxCols : number ): number 
{
    let biodiversity_rating : number = 0;

    let cur_bin = 1;

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            if ( ( pHashMap[ pPrefixMap + "R" + cur_row  + "C" + cur_col ] ?? MAP_EMPTY_SPACE ) === MAP_BUG ) 
            {
                biodiversity_rating += cur_bin;
            }

            cur_bin *= 2;
        }
    }

    return biodiversity_rating;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating the Map from the input values
     * *******************************************************************************************************
     */

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows      : number = 0; 
    let grid_cols      : number = 0;

    let cur_map_prefix_read  : string = MAP_1;
    let cur_map_prefix_write : string = MAP_2;

    let map_input      : PropertieMap = {};
    
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : number = ( cur_input_str[ grid_cols ] ?? "." ) == "." ? MAP_EMPTY_SPACE : MAP_BUG;

            map_input[ cur_map_prefix_write + "R" + grid_rows + "C" + grid_cols ] = cur_char_input;
        }

        grid_rows++;
    }

    grid_cols++;

    let key_map : string = getDebugMap( map_input, cur_map_prefix_write, grid_rows, grid_cols );

    map_input[ key_map ] = 0;

    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    for ( let round_nr : number = 1; round_nr < 2400; round_nr++ )
    {
        /*
         * Switching between the read and write map.
         */
        if ( cur_map_prefix_read === MAP_1 )
        {
            cur_map_prefix_read  = MAP_2;
            cur_map_prefix_write = MAP_1;
        }
        else
        {
            cur_map_prefix_read  = MAP_1;
            cur_map_prefix_write = MAP_2;
        }

        /*
         * Calculating the new value for each grid cell.
         */
        for ( let cur_row = 0; cur_row < grid_rows; cur_row++ )
        {
            for ( let cur_col = 0; cur_col < grid_cols; cur_col++ )
            {
                calcCell( map_input,cur_map_prefix_read, cur_map_prefix_write, cur_row, cur_col, pKnzDebug );
            }
        }

        /*
         * If debug is enabled, do some debug stuff
         */
        if ( pKnzDebug )
        {
            wl( "" );
            wl( "Round " + round_nr + " - biodiversity rating " + calcBiodiversityRating( map_input, cur_map_prefix_write, grid_rows, grid_cols ) );

            wl( combineStrings( getDebugMap( map_input, cur_map_prefix_read, grid_rows, grid_cols ),  getDebugMap( map_input, cur_map_prefix_write, grid_rows, grid_cols ) ) );
        }

        let key_map : string = getDebugMap( map_input, cur_map_prefix_write, grid_rows, grid_cols );

        if ( ( map_input[ key_map ] ?? -1 ) >= 0 )
        {
            wl( "Found first layout to appear twice (first in round " + map_input[ key_map ] + ", second in round " + round_nr + ")" );

            break;
        }
        else
        {
            map_input[ key_map ] = round_nr;
        }
    }

    result_part_01 = calcBiodiversityRating( map_input, cur_map_prefix_write, grid_rows, grid_cols );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath : string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day24_input.txt";

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

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "....#" );
    array_test.push( "#..#." );
    array_test.push( "#..##" );
    array_test.push( "..#.." );
    array_test.push( "#...." );

    return array_test;
}


wl( "" );
wl( "Day 24: Planet of Discord" );
wl( "" );

calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 24 - End " );
