import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 4: Secure Container ---
 * https://adventofcode.com/2019/day/4
 * 
 * https://www.reddit.com/r/adventofcode/comments/e5u5fv/2019_day_4_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2019/blob/main/src/day_04__Secure_Container.ts
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day04/day_04__Secure_Container.js
 * 
 * Day 04: Secure Container
 * 
 * + Round NR     27  Result P01      5  Result P02      1  Cur Number 236677
 * + Round NR     28  Result P01      6  Result P02      2  Cur Number 236678
 * + Round NR     29  Result P01      7  Result P02      3  Cur Number 236679
 * + Round NR     30  Result P01      8  Result P02      4  Cur Number 236688
 * + Round NR     31  Result P01      9  Result P02      5  Cur Number 236689
 * + Round NR     32  Result P01     10  Result P02      6  Cur Number 236699
 * + Round NR     34  Result P01     12  Result P02      7  Cur Number 236778
 * + Round NR     35  Result P01     13  Result P02      8  Cur Number 236779
 * + Round NR     36  Result P01     14  Result P02      9  Cur Number 236788
 * + Round NR     38  Result P01     15  Result P02     10  Cur Number 236799
 * + Round NR     40  Result P01     17  Result P02     11  Cur Number 236889
 * + Round NR     41  Result P01     18  Result P02     12  Cur Number 236899
 * + Round NR     46  Result P01     23  Result P02     13  Cur Number 237788
 * + Round NR     47  Result P01     24  Result P02     14  Cur Number 237789
 * + Round NR     48  Result P01     25  Result P02     15  Cur Number 237799
 * + Round NR     50  Result P01     27  Result P02     16  Cur Number 237889
 * + Round NR     51  Result P01     28  Result P02     17  Cur Number 237899
 * + Round NR     55  Result P01     32  Result P02     18  Cur Number 238899
 * + Round NR     64  Result P01     41  Result P02     19  Cur Number 244455
 * + Round NR     69  Result P01     46  Result P02     20  Cur Number 244466
 * 
 * ...
 * 
 * 
 * + Round NR   1184  Result P01   1148  Result P02    748  Cur Number 669999
 * + Round NR   1188  Result P01   1152  Result P02    749  Cur Number 677788
 * + Round NR   1190  Result P01   1154  Result P02    750  Cur Number 677799
 * + Round NR   1191  Result P01   1155  Result P02    751  Cur Number 677888
 * + Round NR   1192  Result P01   1156  Result P02    752  Cur Number 677889
 * + Round NR   1193  Result P01   1157  Result P02    753  Cur Number 677899
 * + Round NR   1194  Result P01   1158  Result P02    754  Cur Number 677999
 * + Round NR   1197  Result P01   1161  Result P02    755  Cur Number 678899
 * + Round NR   1202  Result P01   1166  Result P02    756  Cur Number 688899
 * + Round NR   1203  Result P01   1167  Result P02    757  Cur Number 688999
 *   Round NR   1206  Result P01   1169  Result P02    757  Cur Number 777777
 * 
 * Result Part 1 =  1169
 * Result Part 2 =  757
 * 
 * Day 04 - End 
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


function checkNumberForTwoSeperateSameAdjacentDigits( pNumArr : number[] ) : number
{
    for ( let cur_idx = 1; cur_idx < pNumArr.length; cur_idx++ ) 
    {
        /*
         * Check for 2 same adjacent digits
         */
        if ( pNumArr[ cur_idx ]! === pNumArr[ cur_idx - 1 ]! ) 
        {
            let knz_front_digit_is_different : boolean = true;
            let knz_back_digit_is_different  : boolean = true;

            /*
             * If the current index is greater than 1, the digit in front 
             * of the number has to be checked.
             * 
             * The number at the current index - 2 has to be different from 
             * digit at the current index.
             */
            if ( cur_idx > 1 ) 
            {
                knz_front_digit_is_different = ( pNumArr[ cur_idx ]! !== pNumArr[ cur_idx - 2 ]! );
            }

            /*
             * If the current index hasn't reached the end of the array,
             * the number after the two adjacent numbers has to be checked.
             * 
             * The number at the current index + 1 has to be different from 
             * digit at the current index.
             */
            if ( ( cur_idx + 1 ) < pNumArr.length ) 
            {
                knz_back_digit_is_different = ( pNumArr[ cur_idx ]! !== pNumArr[ cur_idx + 1 ]! );
            }

            /*
             * If both digits in the front and in the back are different, 
             * then 1 is returned.
             */
            if ( knz_front_digit_is_different && knz_back_digit_is_different ) 
            {
                return 1;
            }
        }
    }

    return 0;
}


function checkNumberPart01( pNumArr : number[] ) : boolean
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


function incNumber( pNumArr : number[], pCurIdx : number ) : number
{
    /*
     * Increment the number at the current index
     */
    pNumArr[ pCurIdx ]!++;

    /*
     * If the number is 10, then ...
     */
    if ( pNumArr[ pCurIdx ]! == 10 )
    {
        if ( pCurIdx == 0 )
        {
            /*
             * If the number is 10 and the index is 0, then there 
             * is no further number. 
             * 
             * The overflow on index 0 results in the number 0 at the index 0.
             */
            pNumArr[ pCurIdx ] = 0;
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
            pNumArr[ pCurIdx ] = incNumber( pNumArr, pCurIdx - 1 );
        }    
    }

    return pNumArr[ pCurIdx ]!;
}


function digitsToNumber( pNumArr : number[] ) : number 
{
    return Number( pNumArr.join( "" ) );
}


wl( "" );
wl( "Day 04: Secure Container" );
wl( "" );

let min_number       : string = "236491";

let max_number       : number = 713787;

let cur_number_array : number[] = min_number.split( "" ).map( Number );

let index_start_inc  : number = cur_number_array.length - 1;

let result_part_01   : number = 0;

let result_part_02   : number = 0;

for ( let round_nr = 0; round_nr < 10_000; round_nr++ )
{
    incNumber( cur_number_array, index_start_inc )

    if ( digitsToNumber( cur_number_array ) >  max_number )
    { 
        wl( "  Round NR " + padL( round_nr, 6 ) + "  Result P01 " + padL( result_part_01, 6 ) + "  Result P02 " + padL( result_part_02, 6 ) + "  Cur Number " + digitsToNumber( cur_number_array ) );

        break; 
    }

    if ( checkNumberPart01( cur_number_array ) )
    {
        result_part_01++;

        let knz_inc_part_02 : number = checkNumberForTwoSeperateSameAdjacentDigits( cur_number_array );

        if ( knz_inc_part_02 === 1 )
        {
            result_part_02++;

            wl( "+ Round NR " + padL( round_nr, 6 ) + "  Result P01 " + padL( result_part_01, 6 ) + "  Result P02 " + padL( result_part_02, 6 ) + "  Cur Number " + digitsToNumber( cur_number_array ) );
        }
    }
}

wl( "" )
wl( "Result Part 1 =  " + result_part_01 );
wl( "Result Part 2 =  " + result_part_02 );
wl( "" )
wl( "Day 04 - End " );

