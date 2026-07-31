// Clean Equirectangular / Mercator SVG Path definitions for global countries
export interface WorldPath {
  id: string; // ISO 2-letter uppercase
  name: string;
  d: string;
}

export const WORLD_SVG_PATHS: WorldPath[] = [
  // INDONESIA (ID)
  {
    id: "ID",
    name: "Indonesia",
    d: "M 750,285 L 760,283 L 775,285 L 790,288 L 810,286 L 825,290 L 840,295 L 835,302 L 815,300 L 795,298 L 775,295 L 755,292 Z M 770,270 L 785,268 L 795,273 L 785,278 L 770,275 Z M 800,268 L 815,265 L 825,272 L 810,275 Z M 740,275 L 750,270 L 755,280 L 745,282 Z",
  },
  // UNITED STATES (US)
  {
    id: "US",
    name: "United States",
    d: "M 150,140 L 290,140 L 295,160 L 285,190 L 260,205 L 240,200 L 220,215 L 180,215 L 155,195 L 145,165 Z M 90,80 L 140,80 L 150,110 L 120,120 L 95,100 Z M 215,225 L 225,220 L 220,235 L 210,230 Z",
  },
  // JAPAN (JP)
  {
    id: "JP",
    name: "Japan",
    d: "M 830,160 L 840,150 L 845,170 L 835,185 L 825,175 Z M 820,185 L 830,180 L 825,195 L 815,190 Z",
  },
  // CHINA (CN)
  {
    id: "CN",
    name: "China",
    d: "M 670,150 L 780,145 L 810,180 L 790,210 L 750,225 L 700,220 L 660,195 L 650,170 Z",
  },
  // INDIA (IN)
  {
    id: "IN",
    name: "India",
    d: "M 640,200 L 685,200 L 700,225 L 680,265 L 655,270 L 640,235 Z",
  },
  // AUSTRALIA (AU)
  {
    id: "AU",
    name: "Australia",
    d: "M 760,330 L 845,325 L 870,365 L 850,410 L 780,415 L 745,370 Z M 840,425 L 850,422 L 848,432 L 838,430 Z",
  },
  // RUSSIA (RU)
  {
    id: "RU",
    name: "Russia",
    d: "M 520,60 L 880,50 L 930,95 L 860,135 L 750,130 L 640,140 L 540,125 L 500,90 Z",
  },
  // BRAZIL (BR)
  {
    id: "BR",
    name: "Brazil",
    d: "M 310,270 L 370,250 L 400,280 L 390,340 L 350,365 L 320,330 L 300,290 Z",
  },
  // CANADA (CA)
  {
    id: "CA",
    name: "Canada",
    d: "M 130,50 L 300,45 L 310,130 L 150,130 L 110,85 Z",
  },
  // UNITED KINGDOM (GB)
  {
    id: "GB",
    name: "United Kingdom",
    d: "M 465,115 L 480,110 L 485,135 L 472,145 L 460,130 Z M 452,125 L 460,120 L 462,133 L 454,135 Z",
  },
  // GERMANY (DE)
  {
    id: "DE",
    name: "Germany",
    d: "M 495,130 L 515,128 L 520,150 L 500,155 L 492,142 Z",
  },
  // FRANCE (FR)
  {
    id: "FR",
    name: "France",
    d: "M 470,145 L 495,142 L 502,168 L 478,175 L 465,160 Z",
  },
  // SPAIN (ES)
  {
    id: "ES",
    name: "Spain",
    d: "M 448,172 L 472,168 L 475,190 L 445,192 Z",
  },
  // ITALY (IT)
  {
    id: "IT",
    name: "Italy",
    d: "M 505,162 L 520,165 L 530,195 L 518,200 L 510,180 Z",
  },
  // SINGAPORE (SG)
  {
    id: "SG",
    name: "Singapore",
    d: "M 753,275 L 758,274 L 759,278 L 753,278 Z",
  },
  // MALAYSIA (MY)
  {
    id: "MY",
    name: "Malaysia",
    d: "M 742,260 L 760,258 L 755,270 L 740,272 Z M 772,258 L 795,255 L 790,268 L 770,266 Z",
  },
  // THAILAND (TH)
  {
    id: "TH",
    name: "Thailand",
    d: "M 725,225 L 745,222 L 748,255 L 735,260 L 728,240 Z",
  },
  // VIETNAM (VN)
  {
    id: "VN",
    name: "Vietnam",
    d: "M 748,215 L 760,220 L 752,258 L 744,245 Z",
  },
  // PHILIPPINES (PH)
  {
    id: "PH",
    name: "Philippines",
    d: "M 785,225 L 795,220 L 800,250 L 790,255 Z",
  },
  // SOUTH KOREA (KR)
  {
    id: "KR",
    name: "South Korea",
    d: "M 792,170 L 805,168 L 808,185 L 795,188 Z",
  },
  // SAUDI ARABIA (SA)
  {
    id: "SA",
    name: "Saudi Arabia",
    d: "M 575,200 L 620,195 L 635,245 L 590,248 L 570,225 Z",
  },
  // UNITED ARAB EMIRATES (AE)
  {
    id: "AE",
    name: "United Arab Emirates",
    d: "M 622,222 L 632,220 L 635,230 L 624,232 Z",
  },
  // EGYPT (EG)
  {
    id: "EG",
    name: "Egypt",
    d: "M 530,195 L 568,193 L 565,225 L 532,225 Z",
  },
  // SOUTH AFRICA (ZA)
  {
    id: "ZA",
    name: "South Africa",
    d: "M 515,370 L 560,365 L 555,410 L 510,405 Z",
  },
  // NIGERIA (NG)
  {
    id: "NG",
    name: "Nigeria",
    d: "M 480,260 L 512,258 L 510,290 L 478,290 Z",
  },
  // MEXICO (MX)
  {
    id: "MX",
    name: "Mexico",
    d: "M 160,200 L 230,195 L 245,240 L 195,245 L 155,215 Z",
  },
  // ARGENTINA (AR)
  {
    id: "AR",
    name: "Argentina",
    d: "M 320,365 L 350,360 L 335,445 L 315,440 Z",
  },
  // NETHERLANDS (NL)
  {
    id: "NL",
    name: "Netherlands",
    d: "M 485,125 L 495,123 L 497,133 L 486,134 Z",
  },
  // SWEDEN (SE)
  {
    id: "SE",
    name: "Sweden",
    d: "M 510,80 L 528,78 L 532,122 L 512,120 Z",
  },
  // NORWAY (NO)
  {
    id: "NO",
    name: "Norway",
    d: "M 485,75 L 508,72 L 512,118 L 495,110 Z",
  },
  // FINLAND (FI)
  {
    id: "FI",
    name: "Finland",
    d: "M 532,75 L 552,72 L 555,115 L 534,118 Z",
  },
  // NEW ZEALAND (NZ)
  {
    id: "NZ",
    name: "New Zealand",
    d: "M 910,410 L 925,405 L 935,440 L 920,442 Z M 925,448 L 940,445 L 945,465 L 930,468 Z",
  },
  // TURKEY / TÜRKIYE (TR)
  {
    id: "TR",
    name: "Turkey",
    d: "M 545,168 L 590,165 L 592,185 L 546,188 Z",
  },
  // POLAND (PL)
  {
    id: "PL",
    name: "Poland",
    d: "M 522,128 L 545,125 L 548,148 L 524,150 Z",
  },
  // UKRAINE (UA)
  {
    id: "UA",
    name: "Ukraine",
    d: "M 548,138 L 585,135 L 590,162 L 550,165 Z",
  },
];
