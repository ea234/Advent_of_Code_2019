import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 7: Amplification Circuit ---
 * https://adventofcode.com/2019/day/7
 * 
 * https://www.reddit.com/r/adventofcode/comments/e7a4nj/2019_day_7_solutions/
 * 
 * 
 * Refers to:
 * https://adventofcode.com/2019/day/2
 * https://adventofcode.com/2019/day/5
 * https://adventofcode.com/2019/day/9
 * 
 * 
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


function calcIntCode( pIntCodePrg : number[], pInputValue : number[], pKnzDebug : boolean ) : number 
{
    let int_code_prg : number[] = [...pIntCodePrg];

    let prg_length   : number = pIntCodePrg.length;

    let max_round           : number = 10_000_000;
    let round_nr            : number = 0;
    let instruction_pointer : number = 0;
    let last_out_value      : number = 0;

    let relative_base       : number = 0;

    let input_idx           : number = 0;

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
            let var_a : number = pInputValue[ input_idx ]!;

            input_idx++;

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


function getPermutations<T>( arr : T[] ): T[][] 
{
  const result : T[][] = [];

  const used = new Array( arr.length ).fill( false );

  function backtrack( path : T[]) 
  {
    if ( path.length === arr.length ) 
    {
      result.push([...path]);

      return;
    }

    for ( let cur_idx = 0; cur_idx < arr.length; cur_idx++) 
    {
      if ( used[ cur_idx ] ) continue;

      used[ cur_idx ] = true;

      path.push( arr[ cur_idx ]! );

      backtrack( path );

      path.pop();

      used[ cur_idx ] = false;
    }
  }

  backtrack( [] );

  return result;
}


function calcAmplifier( pString : string ) : number 
{
    const permutations = getPermutations([0, 1, 2, 3, 4]);

    const int_code_prg : number[] = pString.split( "," ).map(Number);

    let max_thrust   : number = 0;
    //let max_perm_idx : number = 0;

    for ( let perm_idx : number = 0; perm_idx < permutations.length; perm_idx++ )
    {
        let combination : number[] = permutations[ perm_idx ]!;

        let cur_output : number = 0;

        for ( let cur_idx : number = 0; cur_idx < combination.length; cur_idx++ )
        {
            cur_output = calcIntCode( int_code_prg, [ combination[ cur_idx ]!, cur_output ], false );
        }

        if ( cur_output > max_thrust )
        {
            wl( "Combination " + padL( perm_idx, 3 )  + " " + ( combination ) + " - " + cur_output + " " );

            max_thrust = cur_output;
            //max_perm_idx = perm_idx;
        }
    }

    return max_thrust;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let int_code_prg   : number[] = pArray[0]!.split( "," ).map(Number);

    result_part_01 = calcAmplifier( pArray[0]! );
    //result_part_02 = calcIntCode( int_code_prg, [2], true );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath : string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2019__day07_input.txt";

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


function testIntCode1( pString : string, pInput : number )
{
    wl( "" );
    wl( "----------------------------------------------------------------------" );

    const int_code_prg : number[] = pString.split( "," ).map(Number);

    console.log(int_code_prg);
    
    calcIntCode( int_code_prg, [pInput], true );

    console.log(int_code_prg);
}


function testIntCode( pString : string, pInput : number[] ) : number
{
    let cur_output : number = 0;

    const int_code_prg : number[] = pString.split( "," ).map(Number);

    for ( let cur_idx : number = 0; cur_idx < pInput.length; cur_idx++ )
    {
       cur_output = calcIntCode( int_code_prg, [ pInput[ cur_idx ]!, cur_output ], false );
    }

    return cur_output;   
}


wl( "" );
wl( "Day 7: Amplification Circuit" );
wl( "" );

//testIntCode( "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0",                            [ 4,3,2,1,0 ] ); // 43210
//testIntCode( "3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0",  [ 0,1,2,3,4 ] ); // 54321

calcAmplifier( "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0" ); // 43210

checkReaddatei();

wl( "" )
wl( "Day 7 - End " );
