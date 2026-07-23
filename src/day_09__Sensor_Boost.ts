import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 9: Sensor Boost ---
 * https://adventofcode.com/2019/day/9
 * 
 * https://www.reddit.com/r/adventofcode/comments/e85b6d/2019_day_9_solutions/
 * 
 * 
 * Refers to:
 * https://adventofcode.com/2019/day/2
 * https://adventofcode.com/2019/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/e4u0rw/2019_day_2_solutions/
 * https://github.com/ea234/Advent_of_Code_2019/blob/main/src/day_02__1202_Program_Alarm.ts
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Sensor_Boost.js
 * 
 * Day 9: Sensor Boost
 * 
 * ----------------------------------------------------------------------
 * (3) [104, 1125899906842624, 99]
 * ROUND     0 - IP     0 IPP | OUT    104 | 1125899906842624        -> 1125899906842624 | 1125899906842624              ->  1125899906842624
 * output buffer
 * 
 * 1125899906842624
 * (3) [104, 1125899906842624, 99]
 * 
 * ----------------------------------------------------------------------
 * (8) [1102, 34915192, 34915192, 7, 4, 7, 99, 0]
 * ROUND     0 - IP     0 IIP | MUL   1102 | 34915192 34915192 ->          7 |   34915192 *   34915192 ->  1219070632396864
 * ROUND     1 - IP     4 PPP | OUT      4 |      7        ->          7 | 1219070632396864              ->  1219070632396864
 * output buffer
 * 
 * 1219070632396864
 * (8) [1102, 34915192, 34915192, 7, 4, 7, 99, 0]
 * 
 * ----------------------------------------------------------------------
 * (16) [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99]
 * ROUND     0 - IP     0 IPP | ADB    109 |      1                      |          1 +          0 ->           1
 * ROUND     1 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        109              ->         109
 * ROUND     2 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          0 +          1 ->           1
 * ROUND     3 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          1 =         16 ->           0 false
 * ROUND     4 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND     5 - IP     0 IPP | ADB    109 |      1                      |          1 +          1 ->           2
 * ROUND     6 - IP     2 RPP | OUT    204 |     -1        ->         -1 |          1              ->           1
 * ROUND     7 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          1 +          1 ->           2
 * ROUND     8 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          2 =         16 ->           0 false
 * ROUND     9 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    10 - IP     0 IPP | ADB    109 |      1                      |          1 +          2 ->           3
 * ROUND    11 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        204              ->         204
 * ROUND    12 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          2 +          1 ->           3
 * ROUND    13 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          3 =         16 ->           0 false
 * ROUND    14 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    15 - IP     0 IPP | ADB    109 |      1                      |          1 +          3 ->           4
 * ROUND    16 - IP     2 RPP | OUT    204 |     -1        ->         -1 |         -1              ->          -1
 * ROUND    17 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          3 +          1 ->           4
 * ROUND    18 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          4 =         16 ->           0 false
 * ROUND    19 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    20 - IP     0 IPP | ADB    109 |      1                      |          1 +          4 ->           5
 * ROUND    21 - IP     2 RPP | OUT    204 |     -1        ->         -1 |       1001              ->        1001
 * ROUND    22 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          4 +          1 ->           5
 * ROUND    23 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          5 =         16 ->           0 false
 * ROUND    24 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    25 - IP     0 IPP | ADB    109 |      1                      |          1 +          5 ->           6
 * ROUND    26 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        100              ->         100
 * ROUND    27 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          5 +          1 ->           6
 * ROUND    28 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          6 =         16 ->           0 false
 * ROUND    29 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    30 - IP     0 IPP | ADB    109 |      1                      |          1 +          6 ->           7
 * ROUND    31 - IP     2 RPP | OUT    204 |     -1        ->         -1 |          1              ->           1
 * ROUND    32 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          6 +          1 ->           7
 * ROUND    33 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          7 =         16 ->           0 false
 * ROUND    34 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    35 - IP     0 IPP | ADB    109 |      1                      |          1 +          7 ->           8
 * ROUND    36 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        100              ->         100
 * ROUND    37 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          7 +          1 ->           8
 * ROUND    38 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          8 =         16 ->           0 false
 * ROUND    39 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    40 - IP     0 IPP | ADB    109 |      1                      |          1 +          8 ->           9
 * ROUND    41 - IP     2 RPP | OUT    204 |     -1        ->         -1 |       1008              ->        1008
 * ROUND    42 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          8 +          1 ->           9
 * ROUND    43 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |          9 =         16 ->           0 false
 * ROUND    44 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    45 - IP     0 IPP | ADB    109 |      1                      |          1 +          9 ->          10
 * ROUND    46 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        100              ->         100
 * ROUND    47 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |          9 +          1 ->          10
 * ROUND    48 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         10 =         16 ->           0 false
 * ROUND    49 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    50 - IP     0 IPP | ADB    109 |      1                      |          1 +         10 ->          11
 * ROUND    51 - IP     2 RPP | OUT    204 |     -1        ->         -1 |         16              ->          16
 * ROUND    52 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |         10 +          1 ->          11
 * ROUND    53 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         11 =         16 ->           0 false
 * ROUND    54 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    55 - IP     0 IPP | ADB    109 |      1                      |          1 +         11 ->          12
 * ROUND    56 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        101              ->         101
 * ROUND    57 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |         11 +          1 ->          12
 * ROUND    58 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         12 =         16 ->           0 false
 * ROUND    59 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    60 - IP     0 IPP | ADB    109 |      1                      |          1 +         12 ->          13
 * ROUND    61 - IP     2 RPP | OUT    204 |     -1        ->         -1 |       1006              ->        1006
 * ROUND    62 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |         12 +          1 ->          13
 * ROUND    63 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         13 =         16 ->           0 false
 * ROUND    64 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    65 - IP     0 IPP | ADB    109 |      1                      |          1 +         13 ->          14
 * ROUND    66 - IP     2 RPP | OUT    204 |     -1        ->         -1 |        101              ->         101
 * ROUND    67 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |         13 +          1 ->          14
 * ROUND    68 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         14 =         16 ->           0 false
 * ROUND    69 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    70 - IP     0 IPP | ADB    109 |      1                      |          1 +         14 ->          15
 * ROUND    71 - IP     2 RPP | OUT    204 |     -1        ->         -1 |          0              ->           0
 * ROUND    72 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |         14 +          1 ->          15
 * ROUND    73 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         15 =         16 ->           0 false
 * ROUND    74 - IP    12 PIP | J -   1006 |    101        ->       true |          0              ->           0
 * ROUND    75 - IP     0 IPP | ADB    109 |      1                      |          1 +         15 ->          16
 * ROUND    76 - IP     2 RPP | OUT    204 |     -1        ->         -1 |         99              ->          99
 * ROUND    77 - IP     4 PIP | ADD   1001 |    100      1 ->        100 |         15 +          1 ->          16
 * ROUND    78 - IP     8 PIP | EQL   1008 |    100     16 ->        101 |         16 =         16 ->           1 true
 * ROUND    79 - IP    12 PIP | J -   1006 |    101        ->      false |          1              ->           0
 * output buffer
 * 
 * 109
 * 1
 * 204
 * -1
 * 1001
 * 100
 * 1
 * 100
 * 1008
 * 100
 * 16
 * 101
 * 1006
 * 101
 * 0
 * 99
 * (16) [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99]
 * 
 * ----------------------------------------------------------------------------------------------
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Sensor_Boost.js
 * 
 * Day 9: Sensor Boost
 * 
 * ROUND     0 - IP     0 IIP | MUL   1102 | 34463338 34463338 ->         63 |   34463338 *   34463338 ->  1187721666102244
 * ROUND     1 - IP     4 PIP | LES   1007 |     63 34463338 ->         63 | 1187721666102244 <   34463338 ->           0 false
 * ROUND     2 - IP     8 PIP | J +   1005 |     63     53 ->      false |          0              ->           0
 * ROUND     3 - IP    11 IIP | ADD   1101 |      3      0 ->       1000 |          3 +          0 ->           3
 * ROUND     4 - IP    15 IPP | ADB    109 |    988                      |        988 +          0 ->         988
 * ROUND     5 - IP    17 RPP | ADB    209 |     12                      |          3 +        988 ->         991
 * ROUND     6 - IP    19 PPP | ADB      9 |   1000                      |          3 +        991 ->         994
 * ROUND     7 - IP    21 RPP | ADB    209 |      6                      |          3 +        994 ->         997
 * 
 * ...
 * 
 * ROUND   194 - IP   845 RIP | J +   1205 |     -1    853 ->       true |          1              ->         853
 * ROUND   195 - IP   853 PIP | ADD   1001 |     64      1 ->         64 |  693930766 +          1 ->   693930767
 * ROUND   196 - IP   857 PIP | MUL   1002 |     64      2 ->         64 |  693930767 *          2 ->  1387861534
 * ROUND   197 - IP   861 IPP | ADB    109 |     -2                      |         -2 +       1022 ->        1020
 * ROUND   198 - IP   863 IRP | J -   2106 |      0        ->       true |          0              ->         875
 * ROUND   199 - IP   875 PIP | MUL   1002 |     64      2 ->         64 | 1387861534 *          2 ->  2775723068
 * ROUND   200 - IP   879 IPP | ADB    109 |     -8                      |         -8 +       1020 ->        1012
 * ROUND   201 - IP   881 IIR | ADD  21101 |     47      0 ->         -2 |         47 +          0 ->          47
 * ROUND   202 - IP   885 PIP | EQL   1008 |   1010     47 ->         63 |         47 =         47 ->           1 true
 * ROUND   203 - IP   889 PIP | J +   1005 |     63    897 ->       true |          1              ->         897
 * ROUND   204 - IP   897 PIP | ADD   1001 |     64      1 ->         64 | 2775723068 +          1 ->  2775723069
 * ROUND   205 - IP   901 PPP | OUT      4 |     64        ->         64 | 2775723069              ->  2775723069
 * output buffer
 * 
 * 2775723069
 * 
 * Result Part 1 = 2775723069
 * Result Part 2 = 49115
 */

const OP_CODE_HALT      : number = 99;
const OP_CODE_ADD       : number =  1;
const OP_CODE_MULTIPLY  : number =  2;
const OP_CODE_INPUT     : number =  3;
const OP_CODE_OUTPUT    : number =  4;
const OP_CODE_JMP_TRUE  : number =  5;
const OP_CODE_JMP_FALSE : number =  6;
const OP_CODE_IF_LESS   : number =  7;
const OP_CODE_IF_EQUAL  : number =  8;

const OP_CODE_ADJUST_RELATIVE_BASE : number = 9;

const POSITION_MODE     : number = 0;
const IMMEDIATE_MODE    : number = 1;
const RELATIVE_MODE     : number = 2;


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


function calcIntCode( pIntCodePrg : number[], pInputValue : number, pKnzDebug : boolean ) : number 
{
    let int_code_prg : number[] = [...pIntCodePrg];

    let prg_length   : number = pIntCodePrg.length;

    let max_round           : number = 10_000_000;
    let round_nr            : number = 0;
    let instruction_pointer : number = 0;
    let last_out_value      : number = 0;

    let relative_base       : number = 0;

    let out_put_buf         : string = "";

    const getOpParameter = ( pOpParamNumber : number ) : number => 
    {
        return int_code_prg[ instruction_pointer + pOpParamNumber ]! ?? 0;
    };

    const getValue = ( pParameterMode : number, pOpParameter : number ) : number => 
    {
        switch ( pParameterMode ) 
        {
            case POSITION_MODE  : return int_code_prg[ pOpParameter ]! ?? 0;

            case IMMEDIATE_MODE : return pOpParameter;

            case RELATIVE_MODE  : return int_code_prg[ pOpParameter + relative_base ]! ?? 0;

            default: throw new Error(`getValue() - Unknown parameter mode ${pParameterMode}`);
        }
    };

    const setValue = ( pParameterMode : number, pOpParameter : number, pValue : number ) : void => 
    {
        switch ( pParameterMode ) 
        {
            case POSITION_MODE  : int_code_prg[ pOpParameter ] = pValue; break;

            case IMMEDIATE_MODE : int_code_prg[ pOpParameter ] = pValue; break;

            case RELATIVE_MODE  : int_code_prg[ pOpParameter + relative_base ] = pValue; break;

            default: throw new Error(`setValue() - Unknown parameter mode  ${pParameterMode}`);
        }
    };

    const getDbgParamMode = ( pParameterMode : number ) : string => 
    {
        switch ( pParameterMode ) 
        {
            case POSITION_MODE  : return "P";

            case IMMEDIATE_MODE : return "I";

            case RELATIVE_MODE  : return "R"

            default: throw new Error(`getDbgParamMode() - Unknown parameter mode ${pParameterMode}`);
        }
    };

    while ( ( int_code_prg[ instruction_pointer ]! !== OP_CODE_HALT ) && ( round_nr < max_round ) )
    {
        if ( round_nr === 1000 )
        {
            pKnzDebug = false;
        }

        if (( !pKnzDebug ) && ( ( round_nr % 10_000 ) === 0 ))
        {
            wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) );
        }

        let inc_ip          : number = 1;

        let cur_instruction : number = int_code_prg[ instruction_pointer ]!;

        let op_code         : number = cur_instruction % 100;

        let param_mode_p1   : number = Math.floor( cur_instruction / 100 ) % 10;
        let param_mode_p2   : number = Math.floor( cur_instruction / 1000 ) % 10;
        let param_mode_p3   : number = Math.floor( cur_instruction / 10000 ) % 10;

        let dbg_param_mode  : string = getDbgParamMode( param_mode_p1 ) + getDbgParamMode( param_mode_p2 ) + getDbgParamMode( param_mode_p3 );

        let parameter_1     : number = getOpParameter( 1 );
        let parameter_2     : number = getOpParameter( 2 );
        let parameter_3     : number = getOpParameter( 3 );

        let var_a           : number = getValue( param_mode_p1, parameter_1 );
        let var_b           : number = getValue( param_mode_p2, parameter_2 );

        let result          : number = 0;

        if ( op_code === OP_CODE_ADD )
        {
            result = var_a + var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | ADD " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " + " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            setValue( param_mode_p3, parameter_3, result ); 

            inc_ip = 4;
        }
        else if ( op_code === OP_CODE_MULTIPLY )
        {
            result = var_a * var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | MUL " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " * " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            setValue( param_mode_p3, parameter_3, result );

            inc_ip = 4;
        }
        else if ( op_code === OP_CODE_INPUT )
        {
            let var_a : number = pInputValue;

            result = var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | SET " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( parameter_1, 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            setValue( param_mode_p1, parameter_1, result ); 

            inc_ip = 2;
        }
        else if ( op_code === OP_CODE_OUTPUT )
        {
            result = var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | OUT " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( parameter_1, 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            out_put_buf += "\n" + result;

            last_out_value = result;

            inc_ip = 2;
        }
        else if ( op_code === OP_CODE_JMP_TRUE )
        {
            /*
             * Opcode 5 is jump-if-true: if the first parameter is non-zero, 
             * it sets the instruction pointer to the value from the second parameter. 
             * Otherwise, it does nothing.
             */
            result = ( var_a !== 0 ) ? var_b : 0;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | J + " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( "" + ( var_a !== 0 ), 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            if ( var_a !== 0 )
            {
                instruction_pointer = result;

                inc_ip = 0;
            }
            else
            {
                inc_ip = 3;
            }
        }
        else if ( op_code === OP_CODE_JMP_FALSE )
        {
            /*
             * Opcode 6 is jump-if-false: if the first parameter is zero, it sets the 
             * instruction pointer to the value from the second parameter. 
             * Otherwise, it does nothing.
             */
            result = ( var_a === 0 ) ? var_b : 0;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | J - " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( "" + ( var_a === 0 ), 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            if ( var_a === 0 )
            {
                instruction_pointer = result;

                inc_ip = 0;
            }
            else
            {
                inc_ip = 3;
            }
        }        
        else if ( op_code === OP_CODE_ADJUST_RELATIVE_BASE )
        {
            /*
             * Opcode 9 adjusts the relative base by the value of its only parameter. 
             * The relative base increases (or decreases, if the value is negative) 
             * by the value of the parameter.
             */
            result =  relative_base + var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | ADB " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + "    " + padL( "", 10 ) + " | " + padL( var_a, 10 ) + " + " + padL( relative_base, 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            relative_base = result;

            inc_ip = 2;
        }
        else if ( op_code === OP_CODE_IF_LESS )
        {
            /*
             * Opcode 7 is less than: if the first parameter is less than 
             * the second parameter, it stores 1 in the position given by the third parameter. 
             * Otherwise, it stores 0.
             */
            result = var_a < var_b ? 1 : 0;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | LES " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " < " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " + (var_a < var_b) )
            }

            setValue( param_mode_p3, parameter_3, result );

            inc_ip = 4;
        }
        else if ( op_code === OP_CODE_IF_EQUAL )
        {
            /*
             * Opcode 8 is equals: if the first parameter is equal to the second parameter, 
             * it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
             */
            result = var_a === var_b ? 1 : 0;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | EQL " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " = " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " + (var_a === var_b) )
            }

            setValue( param_mode_p3, parameter_3, result );

            inc_ip = 4;
        }
        else
        {
            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + dbg_param_mode + " | --- " + padL( int_code_prg[ instruction_pointer ] ?? -99, 6 ) );
            }
        }

        instruction_pointer += inc_ip;

        if ( instruction_pointer >= prg_length )
        {
            throw new Error( "Instruction Pointer exceeds programm length. IP = " + instruction_pointer + "  PRG LEN = " + prg_length );
        }

        round_nr++;
    }

    wl( "output buffer" );
    wl( out_put_buf     );
   
   return last_out_value;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let int_code_prg   : number[] = pArray[0]!.split( "," ).map( Number );

    result_part_01 = calcIntCode( int_code_prg, 1, true );
    result_part_02 = calcIntCode( int_code_prg, 2, true );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath : string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day09_input.txt";

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


function testIntCode( pString : string, pInput : number )
{
    wl( "" );
    wl( "----------------------------------------------------------------------" );

    const int_code_prg : number[] = pString.split( "," ).map( Number );

    console.log( int_code_prg );
    
    calcIntCode( int_code_prg, pInput, true );

    console.log( int_code_prg );
}


wl( "" );
wl( "Day 09: Sensor Boost" );
wl( "" );

testIntCode( "104,1125899906842624,99",                                   8 );
testIntCode( "1102,34915192,34915192,7,4,7,99,0",                         8 );
testIntCode( "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99", 8 );

/*
testIntCode( "3,3,1107,-1,8,3,4,3,99",                   8 );

testIntCode( "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", 1 );
testIntCode( "3,3,1105,-1,9,1101,0,0,12,4,12,99,1",      1 );

testIntCode( "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", 0 );
testIntCode( "3,3,1105,-1,9,1101,0,0,12,4,12,99,1",      0 );

testIntCode( "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99", 8 );
*/

checkReaddatei();

wl( "" )
wl( "Day 09 - End " );


