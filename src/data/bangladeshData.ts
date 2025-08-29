// Bangladesh Cities, Divisions, and Postal Codes Data
export interface PostalCode {
  code: string;
  area: string;
}

export interface Division {
  name: string;
  postalCodes: PostalCode[];
}

export interface City {
  name: string;
  divisions: Division[];
}

export const bangladeshData: City[] = [
  {
    name: "Dhaka",
    divisions: [
      {
        name: "Dhaka",
        postalCodes: [
          { code: "1000", area: "GPO Dhaka" },
          { code: "1100", area: "Ramna" },
          { code: "1200", area: "Dhanmondi" },
          { code: "1205", area: "Kalabagan" },
          { code: "1207", area: "New Market" },
          { code: "1209", area: "Elephant Road" },
          { code: "1212", area: "Lalmatia" },
          { code: "1213", area: "Mohammadpur" },
          { code: "1215", area: "Adabar" },
          { code: "1216", area: "Shukrabad" },
          { code: "1217", area: "Dhanmondi 32" },
        ]
      },
      {
        name: "Gazipur",
        postalCodes: [
          { code: "1700", area: "Gazipur Sadar" },
          { code: "1701", area: "Kaliakoir" },
          { code: "1703", area: "Kapasia" },
          { code: "1704", area: "Sreepur" },
          { code: "1705", area: "Kaliganj" },
        ]
      },
      {
        name: "Narayanganj",
        postalCodes: [
          { code: "1400", area: "Narayanganj Sadar" },
          { code: "1401", area: "Araihazar" },
          { code: "1402", area: "Bandar" },
          { code: "1403", area: "Rupganj" },
          { code: "1404", area: "Sonargaon" },
        ]
      },
      {
        name: "Manikganj",
        postalCodes: [
          { code: "1800", area: "Manikganj Sadar" },
          { code: "1801", area: "Singair" },
          { code: "1802", area: "Shibalaya" },
          { code: "1803", area: "Saturia" },
          { code: "1804", area: "Harirampur" },
        ]
      }
    ]
  },
  {
    name: "Chittagong",
    divisions: [
      {
        name: "Chittagong",
        postalCodes: [
          { code: "4000", area: "GPO Chittagong" },
          { code: "4100", area: "Agrabad" },
          { code: "4203", area: "Halishahar" },
          { code: "4210", area: "Panchlaish" },
          { code: "4220", area: "Khulshi" },
          { code: "4300", area: "Double Mooring" },
        ]
      },
      {
        name: "Cox's Bazar",
        postalCodes: [
          { code: "4700", area: "Cox's Bazar Sadar" },
          { code: "4750", area: "Teknaf" },
          { code: "4760", area: "Ukhia" },
          { code: "4770", area: "Ramu" },
        ]
      },
      {
        name: "Comilla",
        postalCodes: [
          { code: "3500", area: "Comilla Sadar" },
          { code: "3501", area: "Barura" },
          { code: "3502", area: "Brahmanpara" },
          { code: "3503", area: "Burichang" },
        ]
      }
    ]
  },
  {
    name: "Sylhet",
    divisions: [
      {
        name: "Sylhet",
        postalCodes: [
          { code: "3100", area: "Sylhet Sadar" },
          { code: "3101", area: "Balaganj" },
          { code: "3102", area: "Beanibazar" },
          { code: "3103", area: "Bishwanath" },
          { code: "3104", area: "Companiganj" },
        ]
      },
      {
        name: "Moulvibazar",
        postalCodes: [
          { code: "3200", area: "Moulvibazar Sadar" },
          { code: "3201", area: "Barlekha" },
          { code: "3202", area: "Juri" },
          { code: "3203", area: "Kamalganj" },
        ]
      }
    ]
  },
  {
    name: "Rajshahi",
    divisions: [
      {
        name: "Rajshahi",
        postalCodes: [
          { code: "6000", area: "Rajshahi Sadar" },
          { code: "6001", area: "Bagha" },
          { code: "6002", area: "Bagmara" },
          { code: "6003", area: "Charghat" },
        ]
      },
      {
        name: "Bogura",
        postalCodes: [
          { code: "5800", area: "Bogura Sadar" },
          { code: "5801", area: "Adamdighi" },
          { code: "5802", area: "Dhunat" },
          { code: "5803", area: "Dhupchanchia" },
        ]
      }
    ]
  },
  {
    name: "Khulna",
    divisions: [
      {
        name: "Khulna",
        postalCodes: [
          { code: "9000", area: "Khulna Sadar" },
          { code: "9100", area: "Batiaghata" },
          { code: "9200", area: "Dacope" },
          { code: "9300", area: "Dumuria" },
        ]
      },
      {
        name: "Jessore",
        postalCodes: [
          { code: "7400", area: "Jessore Sadar" },
          { code: "7401", area: "Abhaynagar" },
          { code: "7402", area: "Bagherpara" },
          { code: "7403", area: "Chaugachha" },
        ]
      }
    ]
  },
  {
    name: "Barisal",
    divisions: [
      {
        name: "Barisal",
        postalCodes: [
          { code: "8200", area: "Barisal Sadar" },
          { code: "8201", area: "Agailjhara" },
          { code: "8202", area: "Babuganj" },
          { code: "8203", area: "Bakerganj" },
        ]
      },
      {
        name: "Patuakhali",
        postalCodes: [
          { code: "8600", area: "Patuakhali Sadar" },
          { code: "8601", area: "Bauphal" },
          { code: "8602", area: "Dashmina" },
          { code: "8603", area: "Dumki" },
        ]
      }
    ]
  },
  {
    name: "Rangpur",
    divisions: [
      {
        name: "Rangpur",
        postalCodes: [
          { code: "5400", area: "Rangpur Sadar" },
          { code: "5401", area: "Badarganj" },
          { code: "5402", area: "Gangachara" },
          { code: "5403", area: "Kaunia" },
        ]
      },
      {
        name: "Dinajpur",
        postalCodes: [
          { code: "5200", area: "Dinajpur Sadar" },
          { code: "5201", area: "Birampur" },
          { code: "5202", area: "Birganj" },
          { code: "5203", area: "Bochaganj" },
        ]
      }
    ]
  },
  {
    name: "Mymensingh",
    divisions: [
      {
        name: "Mymensingh",
        postalCodes: [
          { code: "2200", area: "Mymensingh Sadar" },
          { code: "2201", area: "Bhaluka" },
          { code: "2202", area: "Dhobaura" },
          { code: "2203", area: "Fulbaria" },
        ]
      },
      {
        name: "Jamalpur",
        postalCodes: [
          { code: "2000", area: "Jamalpur Sadar" },
          { code: "2001", area: "Baksiganj" },
          { code: "2002", area: "Dewanganj" },
          { code: "2003", area: "Islampur" },
        ]
      }
    ]
  }
];

// Helper functions to get data based on selection
export const getCitiesList = (): string[] => {
  return bangladeshData.map(city => city.name);
};

export const getDivisionsByCity = (cityName: string): string[] => {
  const city = bangladeshData.find(city => city.name === cityName);
  return city ? city.divisions.map(division => division.name) : [];
};

export const getPostalCodesByDivision = (cityName: string, divisionName: string): PostalCode[] => {
  const city = bangladeshData.find(city => city.name === cityName);
  if (!city) return [];
  
  const division = city.divisions.find(division => division.name === divisionName);
  return division ? division.postalCodes : [];
};
