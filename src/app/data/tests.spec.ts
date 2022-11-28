import {winner} from "./winner";
import {play} from "./play";
import {isValid} from "./isValid";
import {TestSuite} from "./tests-definitions";

const Ltests = [
  {
    "id": "CLtMNpXwwUuXorvRyWtK",
    "LtestIds": [
      "9zz2MWHIDHnricejPYEG",
      "zahqfNcLkAAp0Ory4Buc",
      "vkPi4GpRL1LrmTRh3TSg",
      "FyWP3BUb13yHI7CIQV8o",
      "DUyhPA9v5Zvr9i6RDZ7h",
      "BGOU33xCIRtZW6CB3EQP",
      "FEnVgChU97fxlV4VYDe0",
      "SxbbgMi2augHXTfK3T8C",
      "qF0mYupPvMVSaYCW39aD",
      "fu67DJlcPjyvOCri6UPg",
      "31YAoX2NI8suoAfqEwKU",
      "kkE7IxyRo472Ufj4LaNe",
      "JjiR4uAJeN3QI8I8nIxE",
      "hnNcFB6qkdi5WGnIb4uJ",
      "BkokGCD2kKJzQPYlmMIs",
      "WkozxK73wvLURpOAX1QF",
      "fzcWNGNDdT5lk52YAAys",
      "Nm2sEVS2ipHTajEGrctk",
      "afAsUkY0VpkRK9KTWFQT"
    ],
    "label": "Tests centrés sur isValid",
    "tests": [
      {
        "comment": "P1 at start",
        "expect": {
          "valid": true
        },
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          }
        ],
        "id": "9zz2MWHIDHnricejPYEG",
        "op": "isValid"
      },
      {
        "expect": {
          "valid": false,
          "reason": "not the turn of P2"
        },
        "id": "zahqfNcLkAAp0Ory4Buc",
        "comment": "P2 at start is invalid (not the turn of P2)",
        "pass": true,
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P2"
          }
        ],
        "op": "isValid",
        "result": {
          "valid": true
        }
      },
      {
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          }
        ],
        "op": "isValid",
        "comment": "column 1 overload",
        "id": "vkPi4GpRL1LrmTRh3TSg",
        "expect": {
          "valid": false,
          "reason": "column 1 has too much tokens"
        }
      },
      {
        "op": "isValid",
        "pass": true,
        "expect": {
          "valid": false,
          "reason": "column 2 has too much tokens"
        },
        "result": {
          "reason": "column 1 has too much tokens",
          "valid": false
        },
        "comment": "column 2 overload",
        "id": "FyWP3BUb13yHI7CIQV8o",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [],
              [],
              [],
              [],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ]
            ],
            "turn": "P2"
          }
        ]
      },
      {
        "id": "DUyhPA9v5Zvr9i6RDZ7h",
        "result": {
          "valid": false,
          "reason": "column 2 has too much tokens"
        },
        "pass": true,
        "expect": {
          "valid": false,
          "reason": "column 3 has too much tokens"
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [],
              [],
              [],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ]
            ],
            "turn": "P1"
          }
        ],
        "comment": "column 3 overload",
        "op": "isValid"
      },
      {
        "result": {
          "reason": "column 3 has too much tokens",
          "valid": false
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [],
              [],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ]
            ],
            "turn": "P1"
          }
        ],
        "pass": true,
        "comment": "column 4 overload",
        "id": "BGOU33xCIRtZW6CB3EQP",
        "expect": {
          "valid": false,
          "reason": "column 4 has too much tokens"
        },
        "op": "isValid"
      },
      {
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ]
            ],
            "turn": "P1"
          }
        ],
        "expect": {
          "valid": false,
          "reason": "column 5 has too much tokens"
        },
        "comment": "column 5 overload",
        "pass": true,
        "result": {
          "reason": "column 4 has too much tokens",
          "valid": false
        },
        "id": "FEnVgChU97fxlV4VYDe0",
        "op": "isValid"
      },
      {
        "expect": {
          "reason": "column 6 has too much tokens",
          "valid": false
        },
        "id": "SxbbgMi2augHXTfK3T8C",
        "pass": true,
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ]
            ],
            "turn": "P1"
          }
        ],
        "result": {
          "valid": false,
          "reason": "column 5 has too much tokens"
        },
        "comment": "column 6 overload",
        "op": "isValid"
      },
      {
        "comment": "column 7 overload",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ]
            ],
            "turn": "P1"
          }
        ],
        "id": "qF0mYupPvMVSaYCW39aD",
        "pass": true,
        "expect": {
          "valid": false,
          "reason": "column 7 has too much tokens"
        },
        "op": "isValid",
        "result": {
          "valid": false,
          "reason": "column 6 has too much tokens"
        }
      },
      {
        "result": {
          "reason": "column 7 has too much tokens",
          "valid": false
        },
        "comment": "Not the turn of P1",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "id": "fu67DJlcPjyvOCri6UPg",
        "expect": {
          "valid": false,
          "reason": "not the turn of P1"
        },
        "pass": true,
        "op": "isValid"
      },
      {
        "result": {
          "reason": "There cannot be two winners",
          "valid": false
        },
        "op": "isValid",
        "expect": {
          "valid": false,
          "reason": "not the turn of P2"
        },
        "comment": "Not the turn of P2",
        "id": "31YAoX2NI8suoAfqEwKU",
        "pass": false,
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ]
      },
      {
        "op": "isValid",
        "expect": {
          "reason": "There cannot be two winners",
          "valid": false
        },
        "comment": "There cannot be 2 winners",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "pass": true,
        "id": "kkE7IxyRo472Ufj4LaNe",
        "result": {
          "reason": "not the turn of P2",
          "valid": false
        }
      },
      {
        "comment": "There cannot be 2 winners (simple)",
        "expect": {
          "valid": false,
          "reason": "There cannot be two winners"
        },
        "op": "isValid",
        "result": {
          "reason": "There cannot be two winners",
          "valid": false
        },
        "id": "JjiR4uAJeN3QI8I8nIxE",
        "params": [
          {
            "grid": [
              [],
              [
                "P1"
              ],
              [
                "P1",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2"
              ],
              [
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "pass": true
      },
      {
        "id": "hnNcFB6qkdi5WGnIb4uJ",
        "op": "isValid",
        "expect": {
          "valid": false,
          "reason": "There cannot be two winners"
        },
        "pass": true,
        "comment": "There cannot be 2 winners (simple 2 )",
        "params": [
          {
            "grid": [
              [
                "P2",
                "P2"
              ],
              [
                "P1",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P2"
              ],
              [
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "result": {
          "valid": false,
          "reason": "There cannot be two winners"
        }
      },
      {
        "params": [
          {
            "turn": "P2",
            "grid": [
              [
                "P2"
              ],
              [
                "P2"
              ],
              [
                "P2"
              ],
              [
                "P2"
              ],
              [],
              [
                "P1"
              ],
              [
                "P1",
                "P1",
                "P1",
                "P1"
              ]
            ]
          }
        ],
        "comment": "no two winners (P2 first winner to be detected)",
        "op": "isValid",
        "id": "BkokGCD2kKJzQPYlmMIs",
        "expect": {
          "valid": false,
          "reason": "There cannot be two winners"
        }
      },
      {
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "op": "isValid",
        "expect": {
          "reason": "too much token for P1",
          "valid": false
        },
        "id": "WkozxK73wvLURpOAX1QF",
        "pass": true,
        "comment": "Too much token for P1(P2 turn)",
        "result": {
          "exec": "success",
          "returns": {
            "reason": "not the turn of P2",
            "valid": false
          }
        }
      },
      {
        "expect": {
          "valid": false,
          "reason": "too much token for P1"
        },
        "op": "isValid",
        "result": {
          "returns": {
            "reason": "too much token for P1",
            "valid": false
          },
          "exec": "success"
        },
        "comment": "Too much token for P1(P1 turn)",
        "id": "fzcWNGNDdT5lk52YAAys",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "pass": true
      },
      {
        "op": "isValid",
        "result": {
          "returns": {
            "valid": false,
            "reason": "too much token for P1"
          },
          "exec": "success"
        },
        "id": "Nm2sEVS2ipHTajEGrctk",
        "expect": {
          "valid": false,
          "reason": "too much token for P2"
        },
        "pass": true,
        "comment": "Too much token for P2(P1 turn)",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ]
      },
      {
        "comment": "Too much token for P2(P2 turn)",
        "pass": true,
        "op": "isValid",
        "id": "afAsUkY0VpkRK9KTWFQT",
        "expect": {
          "valid": false,
          "reason": "too much token for P2"
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "result": {
          "returns": {
            "reason": "too much token for P2",
            "valid": false
          },
          "exec": "success"
        }
      }
    ]
  },
  {
    "label": "Tests centrés sur winner",
    "LtestIds": [
      "glLaSQXbmUmgBmp6r2Mm",
      "syiCwg8OD3K1W9EF92t9",
      "kW4LcQzWEq6X00x7HBO5",
      "TKHBHQcld9qDMXYQPj7q",
      "5FOBGLPXH8u8QIIX6G0V",
      "beZzzcq4SOmoXL0oGu6w",
      "LuHz9ZxboUtXSIWigbBK",
      "8ujgWEKhQzj6zjuyXSrw",
      "batpdJsyIgc43I7q6xJC",
      "MZAKmTYHM7ilFnG8jvy7",
      "HeBTqTGBhTX1mD2MS5Y0",
      "b92FbWdyOFIRT9j4H1x4",
      "3PLGMtvnuwx2XtWjdl82",
      "wBa7XMsYYhuUE07uxMsj",
      "pcVytVFoXLDk5eQDoaXy",
      "tGMb50UQ2JRMiXRnZOgr",
      "9yWW3X0eQ1MagqBZ0Kwj",
      "s9tb4tbHC18IMnq8Qv1F",
      "Vm2yyQtmdHg5XhKkrIo8",
      "2EozqANDNIsWdZt0rx84"
    ],
    "id": "Iokl5GpxtANX776ava1K",
    "tests": [
      {
        "op": "isValid",
        "expect": {
          "valid": true
        },
        "comment": "First and last column full, no winner yet",
        "id": "glLaSQXbmUmgBmp6r2Mm",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [],
              [],
              [],
              [],
              [],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ]
      },
      {
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          }
        ],
        "expect": "no winner yet",
        "op": "winner",
        "comment": "no winner at beginning",
        "id": "syiCwg8OD3K1W9EF92t9"
      },
      {
        "comment": "valid full grid ",
        "expect": {
          "valid": true
        },
        "pass": true,
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "result": {
          "valid": true
        },
        "id": "kW4LcQzWEq6X00x7HBO5",
        "op": "isValid"
      },
      {
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "expect": "DRAW",
        "op": "winner",
        "result": {
          "valid": true
        },
        "pass": true,
        "id": "TKHBHQcld9qDMXYQPj7q",
        "comment": "valid full grid DRAW"
      },
      {
        "id": "5FOBGLPXH8u8QIIX6G0V",
        "result": "DRAW",
        "expect": {
          "valid": true
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "pass": true,
        "comment": "P1 win is valid (horizontal)",
        "op": "isValid"
      },
      {
        "comment": "P1 win  (horizontal)",
        "result": {
          "valid": true
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "expect": "P1",
        "pass": true,
        "id": "beZzzcq4SOmoXL0oGu6w",
        "op": "winner"
      },
      {
        "id": "LuHz9ZxboUtXSIWigbBK",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "op": "winner",
        "pass": true,
        "comment": "P2 win  (horizontal)",
        "expect": "P2",
        "result": "P1"
      },
      {
        "comment": "P2 win is valid  (horizontal)",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "expect": {
          "valid": true
        },
        "id": "8ujgWEKhQzj6zjuyXSrw",
        "result": "P2",
        "op": "isValid",
        "pass": true
      },
      {
        "comment": "P2 win is valid  (North-East)",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "expect": {
          "valid": true
        },
        "id": "batpdJsyIgc43I7q6xJC",
        "op": "isValid",
        "result": {
          "valid": true
        },
        "pass": true
      },
      {
        "id": "MZAKmTYHM7ilFnG8jvy7",
        "comment": "P2 win  (North-East)",
        "expect": "P2",
        "result": {
          "valid": true
        },
        "pass": true,
        "op": "winner",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ]
      },
      {
        "expect": {
          "valid": true
        },
        "comment": "P1 win is valid (North-East)",
        "op": "isValid",
        "pass": true,
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ]
            ],
            "turn": "P2"
          }
        ],
        "result": "P2",
        "id": "HeBTqTGBhTX1mD2MS5Y0"
      },
      {
        "id": "b92FbWdyOFIRT9j4H1x4",
        "pass": true,
        "expect": "P1",
        "op": "winner",
        "result": {
          "valid": true
        },
        "comment": "P1 win (North-East)",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P1"
              ]
            ],
            "turn": "P2"
          }
        ]
      },
      {
        "result": "P1",
        "expect": "P1",
        "comment": "P1 win (South-East)",
        "id": "3PLGMtvnuwx2XtWjdl82",
        "pass": true,
        "op": "winner",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ]
      },
      {
        "id": "wBa7XMsYYhuUE07uxMsj",
        "result": {
          "valid": true
        },
        "pass": true,
        "comment": "P1 win is valid (South-East)",
        "op": "isValid",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "expect": {
          "valid": true
        }
      },
      {
        "pass": true,
        "comment": "P2 win is valid (South-East)",
        "expect": {
          "valid": true
        },
        "result": {
          "valid": true
        },
        "op": "isValid",
        "id": "pcVytVFoXLDk5eQDoaXy",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ]
      },
      {
        "op": "isValid",
        "pass": true,
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ],
        "result": {
          "valid": true
        },
        "comment": "P1 win is valid (Vertical)",
        "expect": {
          "valid": true
        },
        "id": "tGMb50UQ2JRMiXRnZOgr"
      },
      {
        "op": "winner",
        "pass": true,
        "comment": "P1 win (Vertical)",
        "expect": "P1",
        "id": "9yWW3X0eQ1MagqBZ0Kwj",
        "result": {
          "valid": true
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P2"
              ]
            ],
            "turn": "P2"
          }
        ]
      },
      {
        "expect": {
          "valid": true
        },
        "pass": true,
        "result": "P1",
        "comment": "P2 win is valid (Vertical)",
        "id": "s9tb4tbHC18IMnq8Qv1F",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "op": "isValid"
      },
      {
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P2",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "id": "Vm2yyQtmdHg5XhKkrIo8",
        "result": {
          "valid": true
        },
        "pass": true,
        "comment": "P2 win (Vertical)",
        "expect": "P2",
        "op": "winner"
      },
      {
        "op": "winner",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P2",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "comment": "P2 win (South-East)",
        "expect": "P2",
        "id": "2EozqANDNIsWdZt0rx84",
        "result": {
          "valid": true
        },
        "pass": true
      }
    ]
  },
  {
    "label": "Tests centrés sur play",
    "id": "vLSmQjtYL408m9TPGq5G",
    "tests": [
      {
        "op": "play",
        "expect": {
          "success": true,
          "state": {
            "grid": [
              [
                "P1"
              ],
              [
                "P2"
              ],
              [],
              [
                "P1"
              ],
              [],
              [],
              []
            ],
            "turn": "P2"
          }
        },
        "params": [
          {
            "grid": [
              [
                "P1"
              ],
              [
                "P2"
              ],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          },
          4
        ],
        "comment": "second coup sur 4",
        "id": "b4kZF25jBSAuBzFN2qXJ"
      },
      {
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          },
          1
        ],
        "id": "qcfoC7J2Xuyco68urGt5",
        "op": "play",
        "comment": "play at 1",
        "expect": {
          "state": {
            "grid": [
              [
                "P1"
              ],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P2"
          },
          "success": true
        }
      },
      {
        "id": "R2CYLCliEJ6NMzhwinXP",
        "expect": {
          "reason": "no such column",
          "success": false
        },
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          },
          2.1
        ],
        "op": "play",
        "comment": "impossible to play at 2.1"
      },
      {
        "expect": {
          "reason": "no such column",
          "success": false
        },
        "op": "play",
        "id": "yChU1qBNQNgh6JQ6WvWH",
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          },
          0
        ],
        "comment": "impossible to play at 0"
      },
      {
        "comment": "possible to play at 7",
        "op": "play",
        "id": "iCqK3kWJzOMsJ2sc8T9h",
        "params": [
          {
            "grid": [
              [
                "P1"
              ],
              [
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1"
              ],
              [
                "P1"
              ],
              [
                "P2",
                "P2"
              ],
              [
                "P1"
              ],
              [
                "P2",
                "P1"
              ]
            ],
            "turn": "P2"
          },
          7
        ],
        "expect": {
          "state": {
            "grid": [
              [
                "P1"
              ],
              [
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1"
              ],
              [
                "P1"
              ],
              [
                "P2",
                "P2"
              ],
              [
                "P1"
              ],
              [
                "P2",
                "P1",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          "success": true
        }
      },
      {
        "id": "Q27G8Ha2dR9bYTvUoL6M",
        "params": [
          {
            "grid": [
              [],
              [],
              [],
              [],
              [],
              [],
              []
            ],
            "turn": "P1"
          },
          8
        ],
        "expect": {
          "success": false,
          "reason": "no such column"
        },
        "op": "play",
        "comment": "Impossible to play at 8"
      },
      {
        "expect": {
          "valid": true
        },
        "id": "ID1QEDyJelNSuQX31wsq",
        "op": "isValid",
        "comment": "Full grid is valid",
        "pass": true,
        "result": {
          "success": false,
          "reason": "no such column"
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ]
      },
      {
        "result": {
          "valid": true
        },
        "comment": "Draw with full grid and player 1 turn",
        "op": "winner",
        "pass": true,
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          }
        ],
        "id": "wrhW8AJ3bqGfIBraGO7E",
        "expect": "DRAW"
      },
      {
        "pass": true,
        "result": "DRAW",
        "id": "wyjsQEs96yujowPxSvyK",
        "comment": "Draw grid, cannot play at 1",
        "op": "play",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          1
        ],
        "expect": {
          "reason": "column is full",
          "success": false
        }
      },
      {
        "pass": true,
        "expect": {
          "reason": "column is full",
          "success": false
        },
        "id": "phjLRjzsSpDMaFN9TPxm",
        "result": {
          "reason": "column is full",
          "success": false
        },
        "comment": "Draw grid, cannot play at 2",
        "op": "play",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          2
        ]
      },
      {
        "op": "play",
        "pass": true,
        "result": {
          "reason": "column is full",
          "success": false
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          3
        ],
        "comment": "Draw grid, cannot play at 3",
        "id": "QAU8unGFzPlAePNGcj7B",
        "expect": {
          "reason": "column is full",
          "success": false
        }
      },
      {
        "id": "9Y6TAKJm1vlKbkfN5TcA",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          5
        ],
        "result": {
          "success": false,
          "reason": "column is full"
        },
        "pass": true,
        "expect": {
          "reason": "column is full",
          "success": false
        },
        "op": "play",
        "comment": "Draw grid, cannot play at 5"
      },
      {
        "id": "THzFebM3mnvxc8eWE62A",
        "expect": {
          "success": false,
          "reason": "column is full"
        },
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          6
        ],
        "pass": true,
        "result": {
          "success": false,
          "reason": "column is full"
        },
        "op": "play",
        "comment": "Draw grid, cannot play at 6"
      },
      {
        "result": {
          "success": false,
          "reason": "column is full"
        },
        "pass": true,
        "comment": "Draw grid, cannot play at 7",
        "op": "play",
        "params": [
          {
            "grid": [
              [
                "P1",
                "P2",
                "P1",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P2",
                "P1",
                "P1",
                "P1",
                "P2"
              ],
              [
                "P1",
                "P1",
                "P2",
                "P2",
                "P1",
                "P2"
              ],
              [
                "P2",
                "P1",
                "P2",
                "P1",
                "P2",
                "P1"
              ],
              [
                "P2",
                "P1",
                "P1",
                "P1",
                "P2",
                "P2"
              ]
            ],
            "turn": "P1"
          },
          7
        ],
        "id": "7sPqLgqlM5YuZmpT8o54",
        "expect": {
          "success": false,
          "reason": "column is full"
        }
      }
    ]
  }
] as TestSuite[];

for (const ts of Ltests) {
  describe(ts.label, () => {
    for (const tc of ts.tests) {
      it (tc.comment, () => {
        const res = tc.op === "play" ? play(...tc.params)
                  : tc.op === "winner" ? winner(...tc.params)
                  : isValid(...tc.params);
        expect( res ).toEqual( tc.expect );
      })
    }
  })
}
