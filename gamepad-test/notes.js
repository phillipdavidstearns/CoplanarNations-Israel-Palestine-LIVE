var notes = {};

// assumes 44.1Khz sample rate

var D_dorian = [
  [
    "D1",
    "E1",
    "F1",
    "G1",
    "A1",
    "B1",
    "C2",
    "D2"
  ],
  [
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
    "D3"
  ],
  [
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3",
    "C4",
    "D4"
  ],
  [
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5"
  ],
  [
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B5",
    "C6",
    "D6"
  ],
];

var B_locrian = [
  [
    "B0",
    "C1",
    "D1",
    "E1",
    "F1",
    "G1",
    "A1",
    "B1"
  ],
  [
    "B1",
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2"
  ],
  [
    "B2",
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3"
  ],
  [
    "B3",
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B4"
  ],
  [
    "B4",
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B5"
  ],
  [
    "B5",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B6"
  ],
];


notes["F#0"] = 1907;
notes["G0"] = 1800;
notes["G#0"] = 1699;
notes["A0"] = 1604;
notes["A#0"] = 1513;
notes["B0"] = 1429;
notes["C1"] = 1349;
notes["C1#"] = 1273;
notes["D1"] = 1201;
notes["D1#"] = 1134;
notes["E1"] = 1070;
notes["F1"] = 1010;
notes["F#1"] = 954;
notes["G1"] = 900;
notes["G#1"] = 849;
notes["A1"] = 802;
notes["A#1"] = 757;
notes["B1"] = 714;
notes["C2"] = 674;
notes["C#2"] = 636;
notes["D2"] = 601;
notes["D#2"] = 567;
notes["E2"] = 535;
notes["F2"] = 505;
notes["F#2"] = 477;
notes["G2"] = 450;
notes["G#2"] = 425;
notes["A2"] = 401;
notes["A#2"] = 378;
notes["B2"] = 354;
notes["C3"] = 337;
notes["C#3"] = 318;
notes["D3"] = 300;
notes["D#3"] = 289;
notes["E3"] = 268;
notes["F3"] = 253;
notes["F#3"] = 238;
notes["G3"] = 225;
notes["G#3"] = 212;
notes["A3"] = 200;
notes["A#3"] = 189;
notes["B3"] = 179;
notes["C4"] = 169;
notes["C#4"] = 159;
notes["D4"] = 150;
notes["D#4"] = 142;
notes["E4"] = 134;
notes["F4"] = 126;
notes["F#4"] = 119;
notes["G4"] = 112;
notes["G#4"] = 106;
notes["A4"] = 100;
notes["A#4"] = 95;
notes["B4"] = 89;
notes["C5"] = 84;
notes["C#5"] = 80;
notes["D5"] = 75;
notes["D#5"] = 71;
notes["E5"] = 67;
notes["F5"] = 63;
notes["F#5"] = 60;
notes["G5"] = 56;
notes["G#5"] = 53;
notes["A5"] = 50;
notes["A#5"] = 47;
notes["B5"] = 45;
notes["C6"] = 42;
notes["C#6"] = 40;
notes["D6"] = 38;
notes["D#6"] = 35;
notes["E6"] = 33;
notes["F6"] = 32;
notes["F#6"] = 30;
notes["G6"] = 28;
notes["G#6"] = 27;
notes["A6"] = 25;
notes["A#6"] = 24;
notes["B6"] = 22;
notes["C7"] = 21;
notes["C#7"] = 20;
notes["D7"] = 19;
notes["D#7"] = 18;
notes["E7"] = 17;
notes["F7"] = 16;
notes["F#7"] = 15;
notes["G7"] = 14;
notes["G#7"] = 13;
notes["A#7"] = 12;
notes["B7"] = 11;
notes["C#8"] = 10;
notes["D#8"] = 9;
notes["F8"] = 8;
notes["G8"] = 7;
notes["A#8"] = 6;
notes["C#9"] = 5;
notes["F9"] = 4;
notes["A#9"] = 3;
notes["F10"] = 2;
