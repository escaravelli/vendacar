export interface CarModel {
  name: string;
  models: string[];
}

export const carBrands: CarModel[] = [
  // Car Brands
  {
    name: "AUDI",
    models: [
      "A1", "A3 Sedan", "A3", "A4 Avant", "A4 Sedan", "A5", "A6", "A7", "A8",
      "Q3", "Q5", "Q7", "Q8", "R8", "R8 GT", "RS 3 Sportback", "RS5",
      "RS6 Avant", "RS7", "S3", "S4", "S5", "S6", "S7", "S8",
      "TT Coupe", "TT Roadster", "e-tron", "e-tron GT"
    ]
  },
  {
    name: "BMW",
    models: [
      "116i", "118i", "120i", "125i", "130i", "135i",
      "218i", "220i", "225i", "228i", "230i", "235i",
      "316i", "318i", "320i", "325i", "328i", "330i", "335i",
      "418i", "420i", "425i", "428i", "430i", "435i",
      "520i", "525i", "528i", "530i", "535i", "540i", "550i",
      "640i", "650i",
      "728i", "730i", "735i", "740i", "750i",
      "M2", "M3", "M4", "M5", "M6", "M8",
      "X1", "X2", "X3", "X4", "X5", "X6", "X7",
      "Z4"
    ]
  },
  {
    name: "CHEVROLET",
    models: [
      "Agile", "Astra", "Blazer", "Camaro", "Captiva", "Celta", "Cobalt",
      "Corsa", "Cruze", "Equinox", "Joy", "Malibu", "Montana", "Onix",
      "Prisma", "S10", "Spin", "Tracker", "TrailBlazer", "Vectra", "Zafira"
    ]
  },
  {
    name: "CITROËN",
    models: [
      "Aircross", "Berlingo", "C3", "C4 Cactus", "C4 Lounge", "C4 Pallas",
      "C4 Picasso", "C5", "DS3", "DS4", "DS5", "Grand C4 Picasso", "Jumper",
      "Xsara Picasso"
    ]
  },
  {
    name: "FIAT",
    models: [
      "500", "Argo", "Bravo", "Cronos", "Doblo", "Ducato", "Fastback",
      "Fiorino", "Freemont", "Grand Siena", "Idea", "Linea", "Marea",
      "Mobi", "Palio", "Pulse", "Punto", "Siena", "Stilo", "Strada",
      "Toro", "Uno", "Weekend"
    ]
  },
  {
    name: "FORD",
    models: [
      "Bronco", "EcoSport", "Edge", "Escort", "Fiesta", "Focus", "Fusion",
      "Ka", "Maverick", "Mustang", "Ranger", "Territory", "Transit"
    ]
  },
  {
    name: "HONDA",
    models: [
      "Accord", "City", "Civic", "CR-V", "Fit", "HR-V", "WR-V"
    ]
  },
  {
    name: "HYUNDAI",
    models: [
      "Azera", "Creta", "Elantra", "HB20", "HB20S", "HB20X", "HR",
      "i30", "ix35", "Santa Fe", "Sonata", "Tucson", "Veloster"
    ]
  },
  {
    name: "JEEP",
    models: [
      "Cherokee", "Commander", "Compass", "Grand Cherokee", "Renegade",
      "Wrangler"
    ]
  },
  {
    name: "KIA",
    models: [
      "Bongo", "Cadenza", "Carnival", "Cerato", "Mohave", "Optima",
      "Picanto", "Sorento", "Sportage", "Stinger"
    ]
  },
  {
    name: "LAND ROVER",
    models: [
      "Defender", "Discovery", "Discovery Sport", "Evoque", "Range Rover",
      "Range Rover Sport", "Range Rover Velar"
    ]
  },
  {
    name: "MERCEDES-BENZ",
    models: [
      "Classe A", "Classe B", "Classe C", "Classe E", "Classe G", "Classe S",
      "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "Sprinter"
    ]
  },
  {
    name: "MITSUBISHI",
    models: [
      "ASX", "Eclipse Cross", "L200", "Lancer", "Outlander", "Pajero",
      "Pajero Full", "Pajero Sport"
    ]
  },
  {
    name: "NISSAN",
    models: [
      "Frontier", "Kicks", "Leaf", "March", "Sentra", "Versa"
    ]
  },
  {
    name: "PEUGEOT",
    models: [
      "2008", "206", "207", "208", "3008", "306", "307", "308", "408",
      "5008", "Expert", "Partner"
    ]
  },
  {
    name: "PORSCHE",
    models: [
      "718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera",
      "Taycan"
    ]
  },
  {
    name: "RENAULT",
    models: [
      "Captur", "Clio", "Duster", "Fluence", "Kangoo", "Kwid", "Logan",
      "Master", "Oroch", "Sandero", "Stepway"
    ]
  },
  {
    name: "TOYOTA",
    models: [
      "Camry", "Corolla", "Corolla Cross", "Etios", "Hilux", "Prius",
      "RAV4", "SW4", "Yaris"
    ]
  },
  {
    name: "VOLKSWAGEN",
    models: [
      "Amarok", "Arteon", "Bora", "Fox", "Fusca", "Gol", "Golf",
      "Jetta", "Nivus", "Passat", "Polo", "Saveiro", "T-Cross",
      "Taos", "Tiguan", "Touareg", "Up", "Virtus", "Voyage"
    ]
  },
  {
    name: "VOLVO",
    models: [
      "C30", "C40", "S60", "S90", "V40", "V60", "V90", "XC40",
      "XC60", "XC90"
    ]
  },

  // Motorcycle Brands
  {
    name: "HONDA MOTOS",
    models: [
      "Biz 110i", "Biz 125", "CB 250F Twister", "CB 300F", "CB 500F",
      "CB 650R", "CBR 650R", "CG 160 Fan", "CG 160 Start", "CG 160 Titan",
      "Elite 125", "NC 750X", "NX 400i Falcon", "PCX", "Pop 110i",
      "Shadow 750", "XRE 190", "XRE 300", "ADV"
    ]
  },
  {
    name: "YAMAHA",
    models: [
      "Crosser 150", "Factor 125", "Fazer 250", "FZ25", "Lander 250",
      "MT-03", "MT-07", "MT-09", "Neo 125", "NMax 160", "R3", "R6", "R1",
      "Tenere 700", "XJ6", "XT 660R", "YBR 150", "YZF-R1", "YZF-R3",
      "YZF-R6"
    ]
  },
  {
    name: "KAWASAKI",
    models: [
      "Ninja 300", "Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R",
      "Ninja ZX-14R", "Versys 650", "Versys 1000", "Vulcan S", "Z300",
      "Z400", "Z650", "Z750", "Z800", "Z900", "Z1000", "ZX-10R", "H2",
      "H2R"
    ]
  },
  {
    name: "SUZUKI",
    models: [
      "Boulevard M800", "Boulevard M1800R", "DL 650 V-Strom", "DL 1000 V-Strom",
      "GSX-R 750", "GSX-R 1000", "GSX-S 750", "GSX-S 1000", "Hayabusa",
      "Intruder 125", "V-Strom 650", "V-Strom 1000"
    ]
  },
  {
    name: "HARLEY-DAVIDSON",
    models: [
      "Breakout", "Deluxe", "Fat Bob", "Fat Boy", "Heritage Classic",
      "Iron 883", "Low Rider", "Pan America", "Road Glide", "Road King",
      "Softail", "Sport Glide", "Street 750", "Street Bob", "Street Glide",
      "Street Rod", "Ultra Limited"
    ]
  },
  {
    name: "BMW MOTORRAD",
    models: [
      "C 400 GT", "F 750 GS", "F 850 GS", "F 900 R", "F 900 XR",
      "G 310 GS", "G 310 R", "K 1600 GTL", "M 1000 RR", "R 1250 GS",
      "R 1250 GS Adventure", "R 1250 RT", "R 18", "S 1000 R", "S 1000 RR",
      "S 1000 XR"
    ]
  },
  {
    name: "DUCATI",
    models: [
      "Diavel", "Hypermotard", "Monster", "Multistrada", "Panigale V2",
      "Panigale V4", "Scrambler", "Streetfighter V4", "SuperSport",
      "XDiavel"
    ]
  },
  {
    name: "TRIUMPH",
    models: [
      "Bonneville T100", "Bonneville T120", "Daytona", "Rocket 3",
      "Scrambler", "Speed Triple", "Street Triple", "Tiger 800",
      "Tiger 900", "Tiger 1200", "Trident 660", "Thruxton"
    ]
  },

  // Truck Brands
  {
    name: "VOLKSWAGEN CAMINHÕES",
    models: [
      "Constellation 13.180", "Constellation 15.190", "Constellation 17.260",
      "Constellation 19.320", "Constellation 19.360", "Constellation 24.280",
      "Constellation 25.360", "Constellation 26.280", "Delivery 4.150",
      "Delivery 6.160", "Delivery 9.170", "Delivery 11.180", "e-Delivery",
      "Worker 8.160", "Worker 11.180", "Worker 13.180", "Worker 17.230"
    ]
  },
  {
    name: "MERCEDES-BENZ CAMINHÕES",
    models: [
      "Accelo 815", "Accelo 1016", "Accelo 1316", "Actros 2651",
      "Actros 2655", "Actros 3344", "Arocs 3345", "Arocs 4145",
      "Atego 1315", "Atego 1419", "Atego 1719", "Atego 2426",
      "Atron 1319", "Axor 2035", "Axor 2544", "Axor 3344"
    ]
  },
  {
    name: "VOLVO CAMINHÕES",
    models: [
      "FH 460", "FH 500", "FH 540", "FH 750", "FM 370", "FM 410",
      "FM 460", "FM 500", "FMX 400", "FMX 440", "FMX 500", "FMX 540",
      "NH 380", "NH 400", "NH 440", "NH 500", "VM 220", "VM 270",
      "VM 330"
    ]
  },
  {
    name: "SCANIA",
    models: [
      "G 360", "G 410", "G 440", "G 500", "P 250", "P 310", "P 360",
      "P 410", "R 450", "R 500", "R 540", "R 620", "R 730", "S 450",
      "S 500", "S 540", "S 730", "XT P280", "XT P310", "XT G410",
      "XT R450"
    ]
  },
  {
    name: "IVECO",
    models: [
      "Daily 30-130", "Daily 35-150", "Daily 40-170", "Daily 45-170",
      "Daily 70-170", "Eurocargo 170E21", "Eurocargo 170E28",
      "Hi-Road 600S44T", "Hi-Street 240E28", "Hi-Way 600S44T",
      "Hi-Way 600S48T", "Stralis 480", "Stralis 570", "Tector 150E21",
      "Tector 170E22", "Tector 240E28"
    ]
  },
  {
    name: "DAF",
    models: [
      "CF 85.360", "CF 85.410", "CF 85.460", "LF 210", "LF 220",
      "LF 260", "LF 290", "XF 105.410", "XF 105.460", "XF 105.510",
      "XF 480", "XF 530"
    ]
  },
  {
    name: "MAN",
    models: [
      "TGX 28.440", "TGX 29.440", "TGX 29.480", "TGX 33.440",
      "TGX 33.480", "TGS 26.440", "TGS 28.440", "TGS 33.440",
      "TGM 15.190", "TGM 17.190", "TGM 23.280", "TGL 10.190",
      "TGL 12.190"
    ]
  },
  {
    name: "FORD CAMINHÕES",
    models: [
      "Cargo 816", "Cargo 1119", "Cargo 1319", "Cargo 1419", "Cargo 1519",
      "Cargo 1719", "Cargo 2429", "Cargo 2629", "Cargo 3129", "F-MAX"
    ]
  }
];