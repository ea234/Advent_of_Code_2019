import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 8: Space Image Format ---
 * https://adventofcode.com/2019/day/8
 * 
 * https://www.reddit.com/r/adventofcode/comments/e7pkmt/2019_day_8_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day08/day_08__Space_Image_Format.js
 * 
 * Day 08: Space Image Format
 * 
 * ----------------------------------------------------------------------
 * Input length  12
 * Input         123456789012
 * Width         3
 * Height        2
 * 
 * Layer   1   Zero   0   One   1   Two   1
 * Layer   2   Zero   1   One   1   Two   1
 * 
 * Layer   2   Zero   1   One   1   Two   1
 * 
 * Result Part 1 = 1
 * Result Part 2
 * 
 *     #..
 *     ...
 * 
 * ----------------------------------------------------------------------
 * Input length  16
 * Input         0222112222120000
 * Width         2
 * Height        2
 * 
 * Layer   1   Zero   1   One   0   Two   3
 * Layer   2   Zero   0   One   2   Two   2
 * Layer   3   Zero   0   One   1   Two   3
 * Layer   4   Zero   4   One   0   Two   0
 * 
 * Layer   1   Zero   1   One   0   Two   3
 * 
 * Result Part 1 = 0
 * Result Part 2
 * 
 *      #
 *     #
 * 
 * ----------------------------------------------------------------------
 * Input length  15000
 * Input         22222222222222222122222222202222222222221220212022...
 * Width         25
 * Height        6
 * 
 * Layer   7   Zero   7   One  23   Two 120
 * 
 * Result Part 1 = 2760
 * Result Part 2
 * 
 *      ##   ##  #  # #### ###
 *     #  # #  # #  # #    #  #
 *     #  # #    #  # ###  ###
 *     #### # ## #  # #    #  #
 *     #  # #  # #  # #    #  #
 *     #  #  ###  ##  #### ###
 * 
 * AGUEB
 * 
 * 
 */

type PropertieMap = Record< string, number >;

const PIXEL_BLACK          = 0;
const PIXEL_WHITE          = 1;
const PIXEL_TRANSPARENT    = 2;

const CHAR_MAP_BLACK       = " ";
const CHAR_MAP_WHITE       = "#";
const CHAR_MAP_TRANSPARENT = ".";


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


class Layer 
{
    id        : number = 0;

    pixel_map : PropertieMap = {};

    count_nr  : number[] = new Array( 3 ).fill( 0 );

    constructor( pID : number, pInput : string, pWidth : number, pHeight : number, pIndex : number )
    {
        this.id = pID;

        let idx_end : number = pIndex + ( pWidth * pHeight );

        let cur_row : number = 0;

        let cur_col : number = 0;

        for ( let cur_idx = pIndex; cur_idx < idx_end; cur_idx++ )
        {
            this.pixel_map[ "R" + cur_row + "C" + cur_col ] = Number( pInput[ cur_idx ]! );

            this.count_nr[ pInput.charCodeAt( cur_idx ) - 48 ]!++;

            cur_col++;

            if ( cur_col == pWidth )
            { 
                cur_col = 0;

                cur_row++;
            }
        }
    }

    public getResultPart01(): number 
    {
        return this.count_nr[ 1 ]! * this.count_nr[ 2 ]!;
    }

    public getZeroCount(): number 
    {
        return this.count_nr[ 0 ]!
    }

    public getPixel( pRow : number, pCol : number ) : number 
    {
        return  this.pixel_map[ "R" + pRow + "C" + pCol ] ?? 4;
    }

    public toString() : string
    {
        return "Layer " + padL( this.id, 3 ) + "   Zero " + padL( this.count_nr[ 0 ]!, 3 ) + "   One " + padL( this.count_nr[ 1 ]!, 3 ) + "   Two " + padL( this.count_nr[ 2 ]!, 3 );
    }
}


function calcArray( pInput : string, pWidth : number, pHeight : number,  pKnzDebug : boolean = true ) : void 
{
    wl( "" );
    wl( "----------------------------------------------------------------------" );
    wl( "Input length  " + pInput.length );

    if ( pInput.length < 50 )
    {
        wl( "Input         " + pInput );
    }
    else
    {
        wl( "Input         " + pInput.substring( 0, 50 ) + "..." );
    }

    wl( "Width         " + pWidth  );
    wl( "Height        " + pHeight );

    /*
     * *******************************************************************************************************
     * Creating the vektor of layers
     * *******************************************************************************************************
     */

    let cur_idx : number = 0;

    let idx_end : number = cur_idx + ( pWidth * pHeight );

    let layer_array : Layer[] = [];

    while ( idx_end <= pInput.length ) 
    {
        layer_array.push( new Layer( layer_array.length + 1, pInput, pWidth, pHeight, cur_idx ) );

        cur_idx = idx_end;

        idx_end = cur_idx + ( pWidth * pHeight );
    }

    /*
     * *******************************************************************************************************
     * Part 01: Determine the layer with the fewest 0 count 
     * *******************************************************************************************************
     */

    wl( "" );

    let min_0_value : number = 1_000;

    let min_0_layer : Layer | undefined = undefined;

    for ( let cur_layer of layer_array )
    {
        if ( ( cur_layer.getZeroCount() > 0 ) && ( cur_layer.getZeroCount() < min_0_value ) )
        {
            min_0_value = cur_layer.getZeroCount();

            min_0_layer = cur_layer;
        }

        if ( pKnzDebug )
        {
            wl( cur_layer.toString() );
        }
    }

    /*
     * *******************************************************************************************************
     * Part 02: Rendering the image
     * *******************************************************************************************************
     */

    let result_part_02 : string = "";

    /*
     * Loop over all rows
     */
    for ( let cur_row = 0; cur_row < pHeight; cur_row++ )
    {
        result_part_02 += "    ";

        /*
         * Loop over all columns
         */
        for ( let cur_col = 0; cur_col < pWidth; cur_col++ )
        {
            /*
             * For each row/col the current pixel is initially set to transparent
             */
            let cur_pixel : number = PIXEL_TRANSPARENT;

            /*
             * Loop over all layers.
             * The first layer with a pixel value other than transparent,
             * sets the pixel for the current row column coordinates.
             */
            for ( let cur_layer of layer_array )
            {
                if ( cur_pixel === PIXEL_TRANSPARENT )
                {
                    cur_pixel = cur_layer.getPixel( cur_row, cur_col );
                }

                if ( cur_pixel !== PIXEL_TRANSPARENT )
                {
                    break;
                }
            }

            /*
             * Setting the pixel in the result map.
             */
            switch ( cur_pixel ) 
            {
                case PIXEL_BLACK:

                    result_part_02 += CHAR_MAP_BLACK;
                    
                    break;
            
                case PIXEL_WHITE:

                    result_part_02 += CHAR_MAP_WHITE;
                    
                    break;
            
                default:

                    result_part_02 += CHAR_MAP_TRANSPARENT;
            }
        }

        result_part_02 += "\n";
    }

    wl( "" );
    wl( min_0_layer!.toString() );
    wl( "" );
    wl( "" );
    wl( "Result Part 1 = " + min_0_layer!.getResultPart01() );
    wl( "Result Part 2   " );
    wl( "" );
    wl( result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day08_input.txt";

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

        calcArray( arrFromFile[0]!, 25, 6, false );
    } )();
}


wl( "" );
wl( "Day 08: Space Image Format" );
wl( "" );

calcArray( "123456789012",     3, 2, true );

calcArray( "0222112222120000", 2, 2, true );

checkReaddatei();

wl( "" )
wl( "Day 08 - End " );
