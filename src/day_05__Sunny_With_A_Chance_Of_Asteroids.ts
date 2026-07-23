import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 5: Sunny with a Chance of Asteroids ---
 * https://adventofcode.com/2019/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/e6carb/2019_day_5_solutions/
 * 
 * 
 * Refers to:
 * https://adventofcode.com/2019/day/2
 * https://adventofcode.com/2019/day/9
 *
 * https://www.reddit.com/r/adventofcode/comments/e4u0rw/2019_day_2_solutions/
 * https://github.com/ea234/Advent_of_Code_2019/blob/main/src/day_02__1202_Program_Alarm.ts
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__Sunny_With_A_Chance_Of_Asteroids.js
 * 
 * Day 05: Sunny with a Chance of Asteroids
 * 
 * ----------------------------------------------------------------------
 * (11) [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]
 * ROUND     0 - IP     0 PP | SET      3 |      9        ->          9 |          8              ->           8
 * ROUND     1 - IP     2 PP | EQL      8 |      9     10 ->          9 |          8 =          8 ->           1 true
 * ROUND     2 - IP     6 PP | OUT      4 |      9        ->          9 |          1              ->           1
 * output buffer
 * 
 * 1
 * (11) [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]
 * 
 * ----------------------------------------------------------------------
 * (11) [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]
 * ROUND     0 - IP     0 PP | SET      3 |      9        ->          9 |          8              ->           8
 * ROUND     1 - IP     2 PP | LES      7 |      9     10 ->          9 |          8 <          8 ->           0 false
 * ROUND     2 - IP     6 PP | OUT      4 |      9        ->          9 |          0              ->           0
 * output buffer
 * 
 * 0
 * (11) [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]
 * 
 * ----------------------------------------------------------------------
 * (9) [3, 3, 1108, -1, 8, 3, 4, 3, 99]
 * ROUND     0 - IP     0 PP | SET      3 |      3        ->          3 |          8              ->           8
 * ROUND     1 - IP     2 II | EQL   1108 |      8      8 ->          3 |          8 =          8 ->           1 true
 * ROUND     2 - IP     6 PP | OUT      4 |      3        ->          3 |          1              ->           1
 * output buffer
 * 
 * 1
 * (9) [3, 3, 1108, -1, 8, 3, 4, 3, 99]
 * 
 * ----------------------------------------------------------------------
 * (9) [3, 3, 1107, -1, 8, 3, 4, 3, 99]
 * ROUND     0 - IP     0 PP | SET      3 |      3        ->          3 |          8              ->           8
 * ROUND     1 - IP     2 II | LES   1107 |      8      8 ->          3 |          8 <          8 ->           0 false
 * ROUND     2 - IP     6 PP | OUT      4 |      3        ->          3 |          0              ->           0
 * output buffer
 * 
 * 0
 * (9) [3, 3, 1107, -1, 8, 3, 4, 3, 99]
 * 
 * ----------------------------------------------------------------------
 * (16) [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]
 * ROUND     0 - IP     0 PP | SET      3 |     12        ->         12 |          1              ->           1
 * ROUND     1 - IP     2 PP | J -      6 |     12        ->      false |          1              ->           0
 * ROUND     2 - IP     5 PP | ADD      1 |     13     14 ->         13 |          0 +          1 ->           1
 * ROUND     3 - IP     9 PP | OUT      4 |     13        ->         13 |          1              ->           1
 * output buffer
 * 
 * 1
 * (16) [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]
 * 
 * ----------------------------------------------------------------------
 * (13) [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]
 * ROUND     0 - IP     0 PP | SET      3 |      3        ->          3 |          1              ->           1
 * ROUND     1 - IP     2 II | J +   1105 |      1      9 ->       true |          1              ->           9
 * ROUND     2 - IP     9 PP | OUT      4 |     12        ->         12 |          1              ->           1
 * output buffer
 * 
 * 1
 * (13) [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]
 * 
 * ----------------------------------------------------------------------
 * (16) [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]
 * ROUND     0 - IP     0 PP | SET      3 |     12        ->         12 |          0              ->           0
 * ROUND     1 - IP     2 PP | J -      6 |     12        ->       true |          0              ->           9
 * ROUND     2 - IP     9 PP | OUT      4 |     13        ->         13 |          0              ->           0
 * output buffer
 * 
 * 0
 * (16) [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]
 * 
 * ----------------------------------------------------------------------
 * (13) [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]
 * ROUND     0 - IP     0 PP | SET      3 |      3        ->          3 |          0              ->           0
 * ROUND     1 - IP     2 II | J +   1105 |      0      9 ->      false |          0              ->           0
 * ROUND     2 - IP     5 II | ADD   1101 |      0      0 ->         12 |          0 +          0 ->           0
 * ROUND     3 - IP     9 PP | OUT      4 |     12        ->         12 |          0              ->           0
 * output buffer
 * 
 * 0
 * (13) [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]
 * 
 * ----------------------------------------------------------------------
 * (47) [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99]
 * ROUND     0 - IP     0 PP | SET      3 |     21        ->         21 |          8              ->           8
 * ROUND     1 - IP     2 PI | EQL   1008 |     21      8 ->         20 |          8 =          8 ->           1 true
 * ROUND     2 - IP     6 PI | J +   1005 |     20     22 ->       true |          1              ->          22
 * ROUND     3 - IP    22 PI | MUL   1002 |     21    125 ->         20 |          8 *        125 ->        1000
 * ROUND     4 - IP    26 PP | OUT      4 |     20        ->         20 |       1000              ->        1000
 * ROUND     5 - IP    28 II | J +   1105 |      1     46 ->       true |          1              ->          46
 * output buffer
 * 
 * 1000
 * (47) [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99]
 * 
 * Day 05 - End
 * ROUND     0 - IP     0 PP | SET      3 |    225        ->        225 |          1              ->           1
 * ROUND     1 - IP     2 PP | ADD      1 |    225      6 ->          6 |          1 +       1100 ->        1101
 * ROUND     2 - IP     6 II | ADD   1101 |      1    238 ->        225 |          1 +        238 ->         239
 * ROUND     3 - IP    10 IP | OUT    104 |      0        ->          0 |          0              ->           0
 * ROUND     4 - IP    12 II | ADD   1101 |     11     91 ->        225 |         11 +         91 ->         102
 * ROUND     5 - IP    16 PI | MUL   1002 |    121     77 ->        224 |         82 *         77 ->        6314
 * ROUND     6 - IP    20 IP | ADD    101 |  -6314    224 ->        224 |      -6314 +       6314 ->           0
 * ROUND     7 - IP    24 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND     8 - IP    26 PI | MUL   1002 |    223      8 ->        223 |          0 *          8 ->           0
 * ROUND     9 - IP    30 PI | ADD   1001 |    224      3 ->        224 |          0 +          3 ->           3
 * ROUND    10 - IP    34 PP | ADD      1 |    223    224 ->        223 |          0 +          3 ->           3
 * ROUND    11 - IP    38 II | MUL   1102 |     74     62 ->        225 |         74 *         62 ->        4588
 * ROUND    12 - IP    42 II | MUL   1102 |     82      7 ->        224 |         82 *          7 ->         574
 * ROUND    13 - IP    46 PI | ADD   1001 |    224   -574 ->        224 |        574 +       -574 ->           0
 * ROUND    14 - IP    50 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    15 - IP    52 IP | MUL    102 |      8    223 ->        223 |          8 *          3 ->          24
 * ROUND    16 - IP    56 PI | ADD   1001 |    224      3 ->        224 |          0 +          3 ->           3
 * ROUND    17 - IP    60 PP | ADD      1 |    224    223 ->        223 |          3 +         24 ->          27
 * ROUND    18 - IP    64 II | ADD   1101 |     28     67 ->        225 |         28 +         67 ->          95
 * ROUND    19 - IP    68 II | MUL   1102 |     42     15 ->        225 |         42 *         15 ->         630
 * ROUND    20 - IP    72 PP | MUL      2 |    196     96 ->        224 |         78 *         57 ->        4446
 * ROUND    21 - IP    76 IP | ADD    101 |  -4446    224 ->        224 |      -4446 +       4446 ->           0
 * ROUND    22 - IP    80 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    23 - IP    82 IP | MUL    102 |      8    223 ->        223 |          8 *         27 ->         216
 * ROUND    24 - IP    86 IP | ADD    101 |      6    224 ->        224 |          6 +          0 ->           6
 * ROUND    25 - IP    90 PP | ADD      1 |    223    224 ->        223 |        216 +          6 ->         222
 * ROUND    26 - IP    94 II | ADD   1101 |     86     57 ->        225 |         86 +         57 ->         143
 * ROUND    27 - IP    98 PP | ADD      1 |    148     69 ->        224 |         35 +         42 ->          77
 * ROUND    28 - IP   102 PI | ADD   1001 |    224    -77 ->        224 |         77 +        -77 ->           0
 * ROUND    29 - IP   106 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    30 - IP   108 IP | MUL    102 |      8    223 ->        223 |          8 *        222 ->        1776
 * ROUND    31 - IP   112 PI | ADD   1001 |    224      2 ->        224 |          0 +          2 ->           2
 * ROUND    32 - IP   116 PP | ADD      1 |    223    224 ->        223 |       1776 +          2 ->        1778
 * ROUND    33 - IP   120 II | ADD   1101 |     82     83 ->        225 |         82 +         83 ->         165
 * ROUND    34 - IP   124 IP | ADD    101 |     87     14 ->        224 |         87 +         91 ->         178
 * ROUND    35 - IP   128 PI | ADD   1001 |    224   -178 ->        224 |        178 +       -178 ->           0
 * ROUND    36 - IP   132 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    37 - IP   134 PI | MUL   1002 |    223      8 ->        223 |       1778 *          8 ->       14224
 * ROUND    38 - IP   138 IP | ADD    101 |      7    224 ->        224 |          7 +          0 ->           7
 * ROUND    39 - IP   142 PP | ADD      1 |    223    224 ->        223 |      14224 +          7 ->       14231
 * ROUND    40 - IP   146 II | ADD   1101 |     38     35 ->        225 |         38 +         35 ->          73
 * ROUND    41 - IP   150 IP | MUL    102 |     31     65 ->        224 |         31 *         28 ->         868
 * ROUND    42 - IP   154 PI | ADD   1001 |    224   -868 ->        224 |        868 +       -868 ->           0
 * ROUND    43 - IP   158 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    44 - IP   160 PI | MUL   1002 |    223      8 ->        223 |      14231 *          8 ->      113848
 * ROUND    45 - IP   164 PI | ADD   1001 |    224      5 ->        224 |          0 +          5 ->           5
 * ROUND    46 - IP   168 PP | ADD      1 |    223    224 ->        223 |     113848 +          5 ->      113853
 * ROUND    47 - IP   172 II | ADD   1101 |     57     27 ->        224 |         57 +         27 ->          84
 * ROUND    48 - IP   176 PI | ADD   1001 |    224    -84 ->        224 |         84 +        -84 ->           0
 * ROUND    49 - IP   180 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    50 - IP   182 IP | MUL    102 |      8    223 ->        223 |          8 *     113853 ->      910824
 * ROUND    51 - IP   186 PI | ADD   1001 |    224      7 ->        224 |          0 +          7 ->           7
 * ROUND    52 - IP   190 PP | ADD      1 |    223    224 ->        223 |     910824 +          7 ->      910831
 * ROUND    53 - IP   194 II | ADD   1101 |     61     78 ->        225 |         61 +         78 ->         139
 * ROUND    54 - IP   198 PI | ADD   1001 |     40     27 ->        224 |         62 +         27 ->          89
 * ROUND    55 - IP   202 IP | ADD    101 |    -89    224 ->        224 |        -89 +         89 ->           0
 * ROUND    56 - IP   206 PP | OUT      4 |    224        ->        224 |          0              ->           0
 * ROUND    57 - IP   208 PI | MUL   1002 |    223      8 ->        223 |     910831 *          8 ->     7286648
 * ROUND    58 - IP   212 PI | ADD   1001 |    224      1 ->        224 |          0 +          1 ->           1
 * ROUND    59 - IP   216 PP | ADD      1 |    224    223 ->        223 |          1 +    7286648 ->     7286649
 * ROUND    60 - IP   220 PP | OUT      4 |    223        ->        223 |    7286649              ->     7286649
 * output buffer
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
 * ROUND     0 - IP     0 PP | SET      3 |    225        ->        225 |          5              ->           5
 * ROUND     1 - IP     2 PP | ADD      1 |    225      6 ->          6 |          5 +       1100 ->        1105
 * ROUND     2 - IP     6 II | J +   1105 |      1    238 ->       true |          1              ->         238
 * ROUND     3 - IP   238 II | J +   1105 |      0  99999 ->      false |          0              ->           0
 * ROUND     4 - IP   241 II | J +   1105 |    227    247 ->       true |        227              ->         247
 * ROUND     5 - IP   247 PI | J +   1005 |    227  99999 ->      false |          0              ->           0
 * ROUND     6 - IP   250 PI | J +   1005 |      0    256 ->       true |          3              ->         256
 * ROUND     7 - IP   256 II | J -   1106 |    227        ->      false |        227              ->           0
 * ROUND     8 - IP   259 II | J -   1106 |      0        ->       true |          0              ->         265
 * ROUND     9 - IP   265 PI | J -   1006 |      0        ->      false |          3              ->           0
 * ROUND    10 - IP   268 PI | J -   1006 |    227        ->       true |          0              ->         274
 * ROUND    11 - IP   274 II | J +   1105 |      1    280 ->       true |          1              ->         280
 * ROUND    12 - IP   280 PP | ADD      1 |    225    225 ->        225 |          5 +          5 ->          10
 * ROUND    13 - IP   284 II | ADD   1101 |    294      0 ->          0 |        294 +          0 ->         294
 * ROUND    14 - IP   288 IP | J +    105 |      1      0 ->       true |          1              ->         294
 * ROUND    15 - IP   294 II | J -   1106 |      0        ->       true |          0              ->         300
 * ROUND    16 - IP   300 PP | ADD      1 |    225    225 ->        225 |         10 +         10 ->          20
 * ROUND    17 - IP   304 II | ADD   1101 |    314      0 ->          0 |        314 +          0 ->         314
 * ROUND    18 - IP   308 IP | J -    106 |      0        ->       true |          0              ->         314
 * ROUND    19 - IP   314 PI | EQL   1008 |    677    226 ->        224 |        226 =        226 ->           1 true
 * ROUND    20 - IP   318 PI | MUL   1002 |    223      2 ->        223 |          0 *          2 ->           0
 * ROUND    21 - IP   322 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    22 - IP   325 IP | ADD    101 |      1    223 ->        223 |          1 +          0 ->           1
 * ROUND    23 - IP   329 PP | EQL      8 |    226    677 ->        224 |        677 =        226 ->           0 false
 * ROUND    24 - IP   333 IP | MUL    102 |      2    223 ->        223 |          2 *          1 ->           2
 * ROUND    25 - IP   337 PI | J +   1005 |    224    344 ->      false |          0              ->           0
 * ROUND    26 - IP   340 IP | ADD    101 |      1    223 ->        223 |          1 +          2 ->           3
 * ROUND    27 - IP   344 II | LES   1107 |    226    677 ->        224 |        226 <        677 ->           1 true
 * ROUND    28 - IP   348 IP | MUL    102 |      2    223 ->        223 |          2 *          3 ->           6
 * ROUND    29 - IP   352 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    30 - IP   355 IP | ADD    101 |      1    223 ->        223 |          1 +          6 ->           7
 * ROUND    31 - IP   359 PI | LES   1007 |    226    226 ->        224 |        677 <        226 ->           0 false
 * ROUND    32 - IP   363 IP | MUL    102 |      2    223 ->        223 |          2 *          7 ->          14
 * ROUND    33 - IP   367 PI | J -   1006 |    224        ->       true |          0              ->         374
 * ROUND    34 - IP   374 PP | LES      7 |    677    677 ->        224 |        226 <        226 ->           0 false
 * ROUND    35 - IP   378 IP | MUL    102 |      2    223 ->        223 |          2 *         14 ->          28
 * ROUND    36 - IP   382 PI | J +   1005 |    224    389 ->      false |          0              ->           0
 * ROUND    37 - IP   385 PI | ADD   1001 |    223      1 ->        223 |         28 +          1 ->          29
 * ROUND    38 - IP   389 IP | EQL    108 |    677    677 ->        224 |        677 =        226 ->           0 false
 * ROUND    39 - IP   393 PI | MUL   1002 |    223      2 ->        223 |         29 *          2 ->          58
 * ROUND    40 - IP   397 PI | J +   1005 |    224    404 ->      false |          0              ->           0
 * ROUND    41 - IP   400 IP | ADD    101 |      1    223 ->        223 |          1 +         58 ->          59
 * ROUND    42 - IP   404 PI | EQL   1008 |    226    226 ->        224 |        677 =        226 ->           0 false
 * ROUND    43 - IP   408 IP | MUL    102 |      2    223 ->        223 |          2 *         59 ->         118
 * ROUND    44 - IP   412 PI | J +   1005 |    224    419 ->      false |          0              ->           0
 * ROUND    45 - IP   415 PI | ADD   1001 |    223      1 ->        223 |        118 +          1 ->         119
 * ROUND    46 - IP   419 II | LES   1107 |    677    226 ->        224 |        677 <        226 ->           0 false
 * ROUND    47 - IP   423 IP | MUL    102 |      2    223 ->        223 |          2 *        119 ->         238
 * ROUND    48 - IP   427 PI | J +   1005 |    224    434 ->      false |          0              ->           0
 * ROUND    49 - IP   430 PI | ADD   1001 |    223      1 ->        223 |        238 +          1 ->         239
 * ROUND    50 - IP   434 II | EQL   1108 |    677    677 ->        224 |        677 =        677 ->           1 true
 * ROUND    51 - IP   438 IP | MUL    102 |      2    223 ->        223 |          2 *        239 ->         478
 * ROUND    52 - IP   442 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    53 - IP   445 PI | ADD   1001 |    223      1 ->        223 |        478 +          1 ->         479
 * ROUND    54 - IP   449 PP | LES      7 |    226    677 ->        224 |        677 <        226 ->           0 false
 * ROUND    55 - IP   453 IP | MUL    102 |      2    223 ->        223 |          2 *        479 ->         958
 * ROUND    56 - IP   457 PI | J +   1005 |    224    464 ->      false |          0              ->           0
 * ROUND    57 - IP   460 IP | ADD    101 |      1    223 ->        223 |          1 +        958 ->         959
 * ROUND    58 - IP   464 PI | EQL   1008 |    677    677 ->        224 |        226 =        677 ->           0 false
 * ROUND    59 - IP   468 IP | MUL    102 |      2    223 ->        223 |          2 *        959 ->        1918
 * ROUND    60 - IP   472 PI | J +   1005 |    224    479 ->      false |          0              ->           0
 * ROUND    61 - IP   475 IP | ADD    101 |      1    223 ->        223 |          1 +       1918 ->        1919
 * ROUND    62 - IP   479 PI | LES   1007 |    226    677 ->        224 |        677 <        677 ->           0 false
 * ROUND    63 - IP   483 PI | MUL   1002 |    223      2 ->        223 |       1919 *          2 ->        3838
 * ROUND    64 - IP   487 PI | J -   1006 |    224        ->       true |          0              ->         494
 * ROUND    65 - IP   494 PP | EQL      8 |    677    226 ->        224 |        226 =        677 ->           0 false
 * ROUND    66 - IP   498 PI | MUL   1002 |    223      2 ->        223 |       3838 *          2 ->        7676
 * ROUND    67 - IP   502 PI | J +   1005 |    224    509 ->      false |          0              ->           0
 * ROUND    68 - IP   505 IP | ADD    101 |      1    223 ->        223 |          1 +       7676 ->        7677
 * ROUND    69 - IP   509 PI | LES   1007 |    677    677 ->        224 |        226 <        677 ->           1 true
 * ROUND    70 - IP   513 PI | MUL   1002 |    223      2 ->        223 |       7677 *          2 ->       15354
 * ROUND    71 - IP   517 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    72 - IP   520 IP | ADD    101 |      1    223 ->        223 |          1 +      15354 ->       15355
 * ROUND    73 - IP   524 IP | LES    107 |    226    226 ->        224 |        226 <        677 ->           1 true
 * ROUND    74 - IP   528 IP | MUL    102 |      2    223 ->        223 |          2 *      15355 ->       30710
 * ROUND    75 - IP   532 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    76 - IP   535 IP | ADD    101 |      1    223 ->        223 |          1 +      30710 ->       30711
 * ROUND    77 - IP   539 IP | LES    107 |    226    677 ->        224 |        226 <        226 ->           0 false
 * ROUND    78 - IP   543 IP | MUL    102 |      2    223 ->        223 |          2 *      30711 ->       61422
 * ROUND    79 - IP   547 PI | J +   1005 |    224    554 ->      false |          0              ->           0
 * ROUND    80 - IP   550 PI | ADD   1001 |    223      1 ->        223 |      61422 +          1 ->       61423
 * ROUND    81 - IP   554 PP | LES      7 |    677    226 ->        224 |        226 <        677 ->           1 true
 * ROUND    82 - IP   558 IP | MUL    102 |      2    223 ->        223 |          2 *      61423 ->      122846
 * ROUND    83 - IP   562 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    84 - IP   565 PI | ADD   1001 |    223      1 ->        223 |     122846 +          1 ->      122847
 * ROUND    85 - IP   569 IP | LES    107 |    677    677 ->        224 |        677 <        226 ->           0 false
 * ROUND    86 - IP   573 PI | MUL   1002 |    223      2 ->        223 |     122847 *          2 ->      245694
 * ROUND    87 - IP   577 PI | J +   1005 |    224    584 ->      false |          0              ->           0
 * ROUND    88 - IP   580 IP | ADD    101 |      1    223 ->        223 |          1 +     245694 ->      245695
 * ROUND    89 - IP   584 II | LES   1107 |    677    677 ->        224 |        677 <        677 ->           0 false
 * ROUND    90 - IP   588 IP | MUL    102 |      2    223 ->        223 |          2 *     245695 ->      491390
 * ROUND    91 - IP   592 PI | J +   1005 |    224    599 ->      false |          0              ->           0
 * ROUND    92 - IP   595 IP | ADD    101 |      1    223 ->        223 |          1 +     491390 ->      491391
 * ROUND    93 - IP   599 II | EQL   1108 |    226    677 ->        224 |        226 =        677 ->           0 false
 * ROUND    94 - IP   603 IP | MUL    102 |      2    223 ->        223 |          2 *     491391 ->      982782
 * ROUND    95 - IP   607 PI | J -   1006 |    224        ->       true |          0              ->         614
 * ROUND    96 - IP   614 PP | EQL      8 |    226    226 ->        224 |        677 =        677 ->           1 true
 * ROUND    97 - IP   618 IP | MUL    102 |      2    223 ->        223 |          2 *     982782 ->     1965564
 * ROUND    98 - IP   622 PI | J -   1006 |    224        ->      false |          1              ->           0
 * ROUND    99 - IP   625 IP | ADD    101 |      1    223 ->        223 |          1 +    1965564 ->     1965565
 * ROUND   100 - IP   629 IP | EQL    108 |    226    677 ->        224 |        226 =        226 ->           1 true
 * ROUND   101 - IP   633 IP | MUL    102 |      2    223 ->        223 |          2 *    1965565 ->     3931130
 * ROUND   102 - IP   637 PI | J +   1005 |    224    644 ->       true |          1              ->         644
 * ROUND   103 - IP   644 IP | EQL    108 |    226    226 ->        224 |        226 =        677 ->           0 false
 * ROUND   104 - IP   648 IP | MUL    102 |      2    223 ->        223 |          2 *    3931130 ->     7862260
 * ROUND   105 - IP   652 PI | J +   1005 |    224    659 ->      false |          0              ->           0
 * ROUND   106 - IP   655 IP | ADD    101 |      1    223 ->        223 |          1 +    7862260 ->     7862261
 * ROUND   107 - IP   659 II | EQL   1108 |    677    226 ->        224 |        677 =        226 ->           0 false
 * ROUND   108 - IP   663 IP | MUL    102 |      2    223 ->        223 |          2 *    7862261 ->    15724522
 * ROUND   109 - IP   667 PI | J -   1006 |    224        ->       true |          0              ->         674
 * ROUND   110 - IP   674 PP | OUT      4 |    223        ->        223 |   15724522              ->    15724522
 * output buffer
 * 
 * 15724522
 * 
 * Result Part 1 = 7286649
 * Result Part 2 = 15724522
 * 
 * Day 05 - End
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

const POSITION_MODE     : number = 0;
const IMMEDIATE_MODE    : number = 1;


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


function calcIntCode( pIntCodePrg : number[], pInputValue : number, pNoun : number, pVerb : number, pKnzDebug : boolean ) : number 
{
    let int_code_prg : number[] = pIntCodePrg.slice();

    let prg_length   : number = pIntCodePrg.length;

    if ( pNoun >= 0 ) int_code_prg[ 1 ] = pNoun;
    if ( pVerb >= 0 ) int_code_prg[ 2 ] = pVerb;

    let max_round           : number = 600_000;
    let round_nr            : number = 0;
    let instruction_pointer : number = 0;
    let last_out_value      : number = 0;

    let out_put_buf         : string = "";

    while ( ( int_code_prg[ instruction_pointer ]! !== OP_CODE_HALT ) && ( round_nr < max_round ) )
    {
        let inc_ip : number = 1;
        let result : number = 0;

        let cur_instruction : number = int_code_prg[ instruction_pointer ]!;

        let op_code : number = cur_instruction % 100;

        let param_mode_p1 : number = Math.floor( cur_instruction / 100 ) % 10;

        let param_mode_p2 : number = Math.floor( cur_instruction / 1000 ) % 10;

        let inst_str : string = (( param_mode_p1 === IMMEDIATE_MODE ) ? "I" : "P" ) + (( param_mode_p2 === IMMEDIATE_MODE ) ? "I" : "P" )

        if ( op_code === OP_CODE_ADD )
        {
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 : number = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_mode_p2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            result = var_a + var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | ADD " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " + " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else if ( op_code === OP_CODE_MULTIPLY )
        {
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 : number = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_mode_p2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            result = var_a * var_b;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | MUL " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " * " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else if ( op_code === OP_CODE_INPUT )
        {
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;

            let var_a : number = pInputValue;// ( param_m1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;

            result = var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | SET " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( parameter_1, 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
            }

            int_code_prg[ parameter_1 ] = result;

            inc_ip = 2;
        }
        else if ( op_code === OP_CODE_OUTPUT )
        {
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;

            result = var_a;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | OUT " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( parameter_1, 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
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
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 : number = int_code_prg[ instruction_pointer + 2 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_mode_p2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            if ( var_a !== 0 )
            {
                result = var_b;
            }
            else
            {
                result = 0;
            }

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | J + " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( "" + ( var_a !== 0 ), 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
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
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 : number = int_code_prg[ instruction_pointer + 2 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_mode_p2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            if ( var_a === 0 )
            {
                result = var_b;
            }
            else
            {
                result = 0;
            }

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | J - " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( "", 6 ) + " -> " + padL( "" + ( var_a === 0 ), 10 ) + " | " + padL( var_a, 10 ) + "   " + padL( "", 10 ) + " ->  " + padL( result, 10 ) + " " )
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
        else if ( op_code === OP_CODE_IF_LESS )
        {
            /*
             * Opcode 7 is less than: if the first parameter is less than 
             * the second parameter, it stores 1 in the position given by the third parameter. 
             * Otherwise, it stores 0.
             */
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 : number = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_mode_p2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            result = var_a < var_b ? 1 : 0;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | LES " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " < " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " + (var_a < var_b) )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else if ( op_code === OP_CODE_IF_EQUAL )
        {
            /*
             * Opcode 8 is equals: if the first parameter is equal to the second parameter, 
             * it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
             */
            let parameter_1 : number = int_code_prg[ instruction_pointer + 1 ]!;
            let parameter_2 : number = int_code_prg[ instruction_pointer + 2 ]!;
            let parameter_3 = int_code_prg[ instruction_pointer + 3 ]!;

            let var_a : number = ( param_mode_p1 === IMMEDIATE_MODE ) ? parameter_1 : int_code_prg[ parameter_1 ]!;
            let var_b : number = ( param_mode_p2 === IMMEDIATE_MODE ) ? parameter_2 : int_code_prg[ parameter_2 ]!;

            result = var_a === var_b ? 1 : 0;

            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | EQL " + padL( int_code_prg[ instruction_pointer ]!, 6 ) + " | " + padL( parameter_1, 6 ) + " " + padL( parameter_2, 6 ) + " -> " + padL( parameter_3, 10 ) + " | " + padL( var_a, 10 ) + " = " + padL( var_b, 10 ) + " ->  " + padL( result, 10 ) + " " + (var_a === var_b) )
            }

            int_code_prg[ parameter_3 ] = result;

            inc_ip = 4;
        }
        else
        {
            if ( pKnzDebug )
            {
                wl( "ROUND " + padL( round_nr, 5 ) + " - IP " + padL( instruction_pointer, 5 ) + " " + inst_str + " | --- " + padL( int_code_prg[ instruction_pointer ] ?? -99, 6 ) );
            }
        }

        instruction_pointer += inc_ip;

        if ( instruction_pointer >= prg_length )
        {
            throw new Error( "Instruction Pointer exceeds programm length. IP = " + instruction_pointer + "  PRG LEN = " + int_code_prg.length );
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

    let int_code_prg   : number[] = pArray[0]!.split( "," ).map(Number);

    result_part_01 = calcIntCode( int_code_prg, 1, -1, -1, true );
    result_part_02 = calcIntCode( int_code_prg, 5, -1, -1, true );

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


function testIntCode( pString : string, pInput : number )
{
    wl( "" );
    wl( "----------------------------------------------------------------------" );

    const int_code_prg : number[] = pString.split( "," ).map(Number);

    console.log(int_code_prg);
    
    calcIntCode( int_code_prg, pInput, -1, -1, true );

    console.log(int_code_prg);
}


wl( "" );
wl( "Day 05: Sunny with a Chance of Asteroids" );
wl( "" );

testIntCode( "3,9,8,9,10,9,4,9,99,-1,8",                 8 );
testIntCode( "3,9,7,9,10,9,4,9,99,-1,8",                 8 );
testIntCode( "3,3,1108,-1,8,3,4,3,99",                   8 );
testIntCode( "3,3,1107,-1,8,3,4,3,99",                   8 );

testIntCode( "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", 1 );
testIntCode( "3,3,1105,-1,9,1101,0,0,12,4,12,99,1",      1 );

testIntCode( "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", 0 );
testIntCode( "3,3,1105,-1,9,1101,0,0,12,4,12,99,1",      0 );

testIntCode( "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99", 8 );

checkReaddatei();

wl( "" )
wl( "Day 05 - End " );

