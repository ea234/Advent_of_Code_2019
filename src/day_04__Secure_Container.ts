import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 4: Secure Container ---
 * https://adventofcode.com/2019/day/4
 * 
 * https://www.reddit.com/r/adventofcode/comments/e5u5fv/2019_day_4_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day04/day_04__Secure_Container.js
 * 
 * Day 04: Secure Container
 * 
 * + Round NR     23  Result P01      1  Cur Number 236666
 * + Round NR     24  Result P01      2  Cur Number 236667
 * + Round NR     25  Result P01      3  Cur Number 236668
 * + Round NR     26  Result P01      4  Cur Number 236669
 * + Round NR     27  Result P01      5  Cur Number 236677
 * + Round NR     28  Result P01      6  Cur Number 236678
 * + Round NR     29  Result P01      7  Cur Number 236679
 * + Round NR     30  Result P01      8  Cur Number 236688
 * + Round NR     31  Result P01      9  Cur Number 236689
 * + Round NR     32  Result P01     10  Cur Number 236699
 * + Round NR     33  Result P01     11  Cur Number 236777
 * + Round NR     34  Result P01     12  Cur Number 236778
 * + Round NR     35  Result P01     13  Cur Number 236779
 * + Round NR     36  Result P01     14  Cur Number 236788
 * + Round NR     38  Result P01     15  Cur Number 236799
 * + Round NR     39  Result P01     16  Cur Number 236888
 * + Round NR     40  Result P01     17  Cur Number 236889
 * + Round NR     41  Result P01     18  Cur Number 236899
 * + Round NR     42  Result P01     19  Cur Number 236999
 * + Round NR     43  Result P01     20  Cur Number 237777
 * + Round NR     44  Result P01     21  Cur Number 237778
 * + Round NR     45  Result P01     22  Cur Number 237779
 * + Round NR     46  Result P01     23  Cur Number 237788
 * 
 * ...
 * 
 * + Round NR   1086  Result P01   1050  Cur Number 557889
 * + Round NR   1087  Result P01   1051  Cur Number 557899
 * + Round NR   1088  Result P01   1052  Cur Number 557999
 * + Round NR   1089  Result P01   1053  Cur Number 558888
 * + Round NR   1090  Result P01   1054  Cur Number 558889
 * + Round NR   1091  Result P01   1055  Cur Number 558899
 * + Round NR   1092  Result P01   1056  Cur Number 558999
 * + Round NR   1093  Result P01   1057  Cur Number 559999
 * + Round NR   1094  Result P01   1058  Cur Number 566666
 * 
 * ...
 * 
 * + Round NR   1201  Result P01   1165  Cur Number 688889
 * + Round NR   1202  Result P01   1166  Cur Number 688899
 * + Round NR   1203  Result P01   1167  Cur Number 688999
 * + Round NR   1204  Result P01   1168  Cur Number 689999
 * + Round NR   1205  Result P01   1169  Cur Number 699999
 *   Round NR   1206  Result P01   1169  Cur Number 777777
 * 
 * Result Part 1 = 1169
 * 
 * Day 04 - End 
 *  
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


function checkNumber( pNumArr : number[] ) : boolean
{
    let two_digits_the_same : number = 0;

    for ( let cur_idx = 1; cur_idx < pNumArr.length; cur_idx++ )
    {
        /*
         * Going from left to right, the digits never decrease.
         * They only ever increase.
         * 
         * If the current number is less than the previous, the 
         * number is not valid. 
         */
        if ( pNumArr[ cur_idx ]! < pNumArr[ cur_idx - 1 ]! )
        {
            return false;
        }

        /*
         * Two adjacent digits are the same (like 22 in 122345).
         */
        if ( pNumArr[ cur_idx ]! ===  pNumArr[ cur_idx - 1 ]! )
        {
            two_digits_the_same++;
        }
    }

    return two_digits_the_same > 0;
}


function incNumber( pNumArr : number[], pCurIndex : number ) : number
{
    /*
     * Increment the number at the current index
     */
    pNumArr[ pCurIndex ]!++;

    /*
     * If the number is 10, then ...
     */
    if ( pNumArr[ pCurIndex ]! == 10 )
    {
        if ( pCurIndex == 0 )
        {
            /*
             * If the number is 10 and the index is 0, then there 
             * is no further number. 
             * 
             * The overflow on index 0 results in the number 0 at the index 0.
             */
            pNumArr[ pCurIndex ] = 0;
        }
        else
        {
            /*
             * If the number is 10 and the index is not 0, then  
             * the next number (cur_index - 1) has to be incremented.
             * This is done with recursion. 
             * 
             * The current number is set to the return-value from recursion-function.
             */
            pNumArr[ pCurIndex ] = incNumber( pNumArr, pCurIndex - 1 );
        }    
    }

    return pNumArr[ pCurIndex ]!;
}


function digitsToNumber( pNumArr: number[]): number 
{
    return Number( pNumArr.join("") );
}


wl( "" );
wl( "Day 04: Secure Container" );
wl( "" );

let min_number       : string = "236491";

let max_number       : number = 713787;

let cur_number_array : number[] = min_number.split( "" ).map( Number );

let index_start_inc  : number = cur_number_array.length - 1;

let result_part_01   : number = 0;

for ( let round_nr = 0; round_nr < 800_000; round_nr++ )
{
    incNumber( cur_number_array, index_start_inc )

    if ( digitsToNumber( cur_number_array ) >  max_number )
    { 
        wl( "  Round NR " + padL( round_nr, 6 ) + "  Result P01 " + padL( result_part_01, 6 ) + "  Cur Number " + digitsToNumber( cur_number_array ) );

        break; 
    }

    if ( checkNumber( cur_number_array ) )
    {
        result_part_01++;

        wl( "+ Round NR " + padL( round_nr, 6 ) + "  Result P01 " + padL( result_part_01, 6 ) + "  Cur Number " + digitsToNumber( cur_number_array ) );
    }
}

wl( "" )
wl( "result_part_01 " + result_part_01 );
wl( "" )
wl( "Day 04 - End " );
