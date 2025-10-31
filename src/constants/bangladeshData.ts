
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
          { code: "1206", area: "Khamarbari" },
          { code: "1207", area: "New Market" },
          { code: "1209", area: "Elephant Road" },
          { code: "1212", area: "Lalmatia" },
          { code: "1213", area: "Mohammadpur" },
          { code: "1215", area: "Adabar" },
          { code: "1216", area: "Shukrabad" },
          { code: "1217", area: "Dhanmondi R/A" },
          { code: "1219", area: "Jigatola" },
          { code: "1222", area: "Hazaribagh" },
          { code: "1223", area: "Shyamoli" },
          { code: "1225", area: "Mirpur" },
          { code: "1229", area: "Pallabi" },
          { code: "1230", area: "Kafrul" },
          { code: "1232", area: "Agargaon" },
          { code: "1310", area: "Motijheel" },
          { code: "1311", area: "Gulshan" },
          { code: "1312", area: "Banani" },
          { code: "1313", area: "Baridhara" },
          { code: "1321", area: "Uttara" },
          { code: "1322", area: "Uttara Model Town" },
          { code: "1323", area: "Uttara Sector No. 1" },
          { code: "1324", area: "Uttara Sector No. 2" },
          { code: "1325", area: "Uttara Sector No. 3" },
          { code: "1340", area: "Khilgaon" },
          { code: "1341", area: "Malibagh" },
          { code: "1342", area: "Shantinagar" },
          { code: "1343", area: "Mugda" },
          { code: "1344", area: "Basabo" },
          { code: "1345", area: "Sabujbagh" },
          { code: "1346", area: "Gandaria" },
          { code: "1347", area: "Demra" },
          { code: "1348", area: "Matuail" },
          { code: "1349", area: "Shahjahanpur" },
          { code: "1350", area: "Kamalapur" },
          { code: "1351", area: "Dakshinkhan" },
          { code: "1360", area: "Tejgaon" },
          { code: "1361", area: "Tejgaon I/A" },
          { code: "1362", area: "Farmgate" },
          { code: "1363", area: "Kawran Bazar" },
          { code: "1364", area: "Mohakhali" },
          { code: "1365", area: "Niketan" },
          { code: "1366", area: "Banani Dohs" },
          { code: "1367", area: "Cantonment" },
          { code: "1368", area: "Kakoli" },
          { code: "1369", area: "Badda" },
          { code: "1370", area: "Rampura" },
          { code: "1371", area: "Merul" },
          { code: "1372", area: "Beraid" },
          { code: "1373", area: "Khilket" },
          { code: "1374", area: "Nurer Chala" },
          { code: "1375", area: "Kuril" },
          { code: "1376", area: "Vatara" },
          { code: "1377", area: "Dania" },
          { code: "1400", area: "Narayanganj Sadar" },
          { code: "1401", area: "Bandar" },
          { code: "1402", area: "Fatullah" },
          { code: "1403", area: "Rupganj" },
          { code: "1404", area: "Sonargaon" },
          { code: "1405", area: "Araihazar" },
          { code: "1406", area: "Siddirganj" },
        ]
      },
      {
        name: "Gazipur",
        postalCodes: [
          { code: "1700", area: "Gazipur Sadar" },
          { code: "1701", area: "Kaliakoir" },
          { code: "1702", area: "Tongi" },
          { code: "1703", area: "Kapasia" },
          { code: "1704", area: "Sreepur" },
          { code: "1705", area: "Kaliganj" },
          { code: "1710", area: "Kashimpur" },
          { code: "1711", area: "Joydebpur" },
          { code: "1712", area: "B.R.R. Cantonment" },
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
          { code: "1805", area: "Ghior" },
          { code: "1806", area: "Daulatpur" },
        ]
      },
      {
        name: "Munshiganj",
        postalCodes: [
          { code: "1500", area: "Munshiganj Sadar" },
          { code: "1501", area: "Sreenagar" },
          { code: "1502", area: "Sirajdikhan" },
          { code: "1503", area: "Lohajang" },
          { code: "1504", area: "Gajaria" },
          { code: "1505", area: "Tongibari" },
        ]
      },
      {
        name: "Narsingdi",
        postalCodes: [
          { code: "1600", area: "Narsingdi Sadar" },
          { code: "1601", area: "Belabo" },
          { code: "1602", area: "Monohardi" },
          { code: "1603", area: "Palash" },
          { code: "1604", area: "Raipura" },
          { code: "1605", area: "Shibpur" },
        ]
      },
      {
        name: "Faridpur",
        postalCodes: [
          { code: "7800", area: "Faridpur Sadar" },
          { code: "7801", area: "Bhanga" },
          { code: "7802", area: "Nagarkanda" },
          { code: "7803", area: "Boalmari" },
          { code: "7804", area: "Alfadanga" },
          { code: "7805", area: "Madhukhali" },
          { code: "7806", area: "Sadarpur" },
          { code: "7807", area: "Charbhadrasan" },
        ]
      },
      {
        name: "Gopalganj",
        postalCodes: [
          { code: "8100", area: "Gopalganj Sadar" },
          { code: "8101", area: "Kashiani" },
          { code: "8102", area: "Kotalipara" },
          { code: "8103", area: "Muksudpur" },
          { code: "8104", area: "Tungipara" },
        ]
      },
      {
        name: "Kishoreganj",
        postalCodes: [
          { code: "2300", area: "Kishoreganj Sadar" },
          { code: "2301", area: "Bajitpur" },
          { code: "2302", area: "Bhairab" },
          { code: "2303", area: "Hossainpur" },
          { code: "2304", area: "Karimganj" },
          { code: "2305", area: "Katiadi" },
          { code: "2306", area: "Kuliarchar" },
          { code: "2307", area: "Mithamain" },
          { code: "2308", area: "Nikli" },
          { code: "2309", area: "Pakundia" },
          { code: "2310", area: "Tarail" },
        ]
      },
      {
        name: "Madaripur",
        postalCodes: [
          { code: "7900", area: "Madaripur Sadar" },
          { code: "7901", area: "Rajoir" },
          { code: "7902", area: "Shibchar" },
          { code: "7903", area: "Kalkini" },
        ]
      },
      {
        name: "Rajbari",
        postalCodes: [
          { code: "7700", area: "Rajbari Sadar" },
          { code: "7701", area: "Baliakandi" },
          { code: "7702", area: "Goalandaghat" },
          { code: "7703", area: "Pangsha" },
          { code: "7704", area: "Kalukhali" },
        ]
      },
      {
        name: "Shariatpur",
        postalCodes: [
          { code: "8000", area: "Shariatpur Sadar" },
          { code: "8001", area: "Bhedarganj" },
          { code: "8002", area: "Damudya" },
          { code: "8003", area: "Gosairhat" },
          { code: "8004", area: "Naria" },
          { code: "8005", area: "Zajira" },
        ]
      },
      {
        name: "Tangail",
        postalCodes: [
          { code: "1900", area: "Tangail Sadar" },
          { code: "1901", area: "Basail" },
          { code: "1902", area: "Bhuapur" },
          { code: "1903", area: "Delduar" },
          { code: "1904", area: "Ghatail" },
          { code: "1905", area: "Gopalpur" },
          { code: "1906", area: "Kalihati" },
          { code: "1907", area: "Madhupur" },
          { code: "1908", area: "Mirzapur" },
          { code: "1909", area: "Nagarpur" },
          { code: "1910", area: "Sakhipur" },
          { code: "1911", area: "Dhanbari" },
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
          { code: "4202", area: "Bayezid" },
          { code: "4203", area: "Halishahar" },
          { code: "4204", area: "Chandgaon" },
          { code: "4205", area: "Pahartali" },
          { code: "4206", area: "Panchlaish" },
          { code: "4207", area: "Kotwali" },
          { code: "4208", area: "Bandar" },
          { code: "4209", area: "Patenga" },
          { code: "4210", area: "Karnaphuli" },
          { code: "4211", area: "EPZ" },
          { code: "4212", area: "Sandwip" },
          { code: "4213", area: "Satkania" },
          { code: "4214", area: "Lohagara" },
          { code: "4215", area: "Hathazari" },
          { code: "4216", area: "Fatikchhari" },
          { code: "4217", area: "Raozan" },
          { code: "4218", area: "Rangunia" },
          { code: "4219", area: "Mirsharai" },
          { code: "4220", area: "Sitakunda" },
          { code: "4221", area: "Banshkhali" },
          { code: "4222", area: "Boalkhali" },
          { code: "4223", area: "Anwara" },
          { code: "4224", area: "Chandanaish" },
          { code: "4225", area: "Satkani" },
          { code: "4226", area: "Patiya" },
          { code: "4227", area: "Khulshi" },
          { code: "4228", area: "Double Mooring" },
          { code: "4229", area: "Bakalia" },
        ]
      },
      {
        name: "Bandarban",
        postalCodes: [
          { code: "4600", area: "Bandarban Sadar" },
          { code: "4610", area: "Thanchi" },
          { code: "4611", area: "Lama" },
          { code: "4612", area: "Naikhongchhari" },
          { code: "4613", area: "Ali kadam" },
          { code: "4614", area: "Rowangchhari" },
          { code: "4615", area: "Ruma" },
        ]
      },
      {
        name: "Brahmanbaria",
        postalCodes: [
          { code: "3400", area: "Brahmanbaria Sadar" },
          { code: "3401", area: "Ashuganj" },
          { code: "3402", area: "Nasirnagar" },
          { code: "3403", area: "Sarail" },
          { code: "3404", area: "Shahbazpur" },
          { code: "3405", area: "Kasba" },
          { code: "3406", area: "Akhaura" },
          { code: "3407", area: "Nabinagar" },
          { code: "3408", area: "Bancharampur" },
          { code: "3409", area: "Bijoynagar" },
        ]
      },
      {
        name: "Chandpur",
        postalCodes: [
          { code: "3600", area: "Chandpur Sadar" },
          { code: "3601", area: "Faridganj" },
          { code: "3602", area: "Haimchar" },
          { code: "3603", area: "Hajiganj" },
          { code: "3604", area: "Kachua" },
          { code: "3605", area: "Matlab Dakshin" },
          { code: "3606", area: "Matlab Uttar" },
          { code: "3607", area: "Shahrasti" },
        ]
      },
      {
        name: "Comilla",
        postalCodes: [
          { code: "3500", area: "Comilla Sadar" },
          { code: "3501", area: "Barura" },
          { code: "3502", area: "Brahmanpara" },
          { code: "3503", area: "Burichang" },
          { code: "3504", area: "Chandina" },
          { code: "3505", area: "Chauddagram" },
          { code: "3506", area: "Daudkandi" },
          { code: "3507", area: "Debidwar" },
          { code: "3508", area: "Homna" },
          { code: "3509", area: "Laksam" },
          { code: "3510", area: "Monohorgonj" },
          { code: "3511", area: "Meghna" },
          { code: "3512", area: "Muradnagar" },
          { code: "3513", area: "Nangalkot" },
          { code: "3514", area: "Comilla Adarsha Sadar" },
          { code: "3515", area: "Titas" },
          { code: "3516", area: "Sadar Dakshin" },
        ]
      },
      {
        name: "Cox's Bazar",
        postalCodes: [
          { code: "4700", area: "Cox's Bazar Sadar" },
          { code: "4701", area: "Chakaria" },
          { code: "4702", area: "Kutubdia" },
          { code: "4703", area: "Ramu" },
          { code: "4704", area: "Teknaf" },
          { code: "4705", area: "Ukhia" },
          { code: "4706", area: "Moheshkhali" },
          { code: "4707", area: "Pekua" },
        ]
      },
      {
        name: "Feni",
        postalCodes: [
          { code: "3900", area: "Feni Sadar" },
          { code: "3901", area: "Chhagalnaiya" },
          { code: "3902", area: "Daganbhuiyan" },
          { code: "3903", area: "Parshuram" },
          { code: "3904", area: "Fulgazi" },
          { code: "3905", area: "Sonagazi" },
        ]
      },
      {
        name: "Khagrachhari",
        postalCodes: [
          { code: "4400", area: "Khagrachhari Sadar" },
          { code: "4410", area: "Dighinala" },
          { code: "4411", area: "Panchhari" },
          { code: "4412", area: "Laxmichhari" },
          { code: "4413", area: "Mohalchari" },
          { code: "4414", area: "Manikchari" },
          { code: "4415", area: "Ramgarh" },
          { code: "4416", area: "Matiranga" },
          { code: "4417", area: "Guimara" },
        ]
      },
      {
        name: "Lakshmipur",
        postalCodes: [
          { code: "3700", area: "Lakshmipur Sadar" },
          { code: "3701", area: "Raipur" },
          { code: "3702", area: "Ramganj" },
          { code: "3703", area: "Ramgati" },
          { code: "3704", area: "Kamalnagar" },
        ]
      },
      {
        name: "Noakhali",
        postalCodes: [
          { code: "3800", area: "Noakhali Sadar" },
          { code: "3801", area: "Begumganj" },
          { code: "3802", area: "Chatkhil" },
          { code: "3803", area: "Companiganj" },
          { code: "3804", area: "Hatiya" },
          { code: "3805", area: "Senbagh" },
          { code: "3806", area: "Kabirhat" },
          { code: "3807", area: "Sonaimuri" },
          { code: "3808", area: "Subarnachar" },
        ]
      },
      {
        name: "Rangamati",
        postalCodes: [
          { code: "4500", area: "Rangamati Sadar" },
          { code: "4510", area: "Bagaichhari" },
          { code: "4511", area: "Barkal" },
          { code: "4512", area: "Kawkhali" },
          { code: "4513", area: "Belai Chhari" },
          { code: "4514", area: "Kaptai" },
          { code: "4515", area: "Juraichhari" },
          { code: "4516", area: "Langadu" },
          { code: "4517", area: "Naniarchar" },
          { code: "4518", area: "Rajasthali" },
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
          { code: "3105", area: "Fenchuganj" },
          { code: "3106", area: "Golapganj" },
          { code: "3107", area: "Gowainghat" },
          { code: "3108", area: "Jaintiapur" },
          { code: "3109", area: "Kanaighat" },
          { code: "3110", area: "Osmaninagar" },
          { code: "3111", area: "Zakiganj" },
          { code: "3112", area: "South Surma" },
          { code: "3113", area: "Dakshin Surma" },
        ]
      },
      {
        name: "Habiganj",
        postalCodes: [
          { code: "3300", area: "Habiganj Sadar" },
          { code: "3301", area: "Ajmiriganj" },
          { code: "3302", area: "Baniachong" },
          { code: "3303", area: "Bahubal" },
          { code: "3304", area: "Chunarughat" },
          { code: "3305", area: "Lakhai" },
          { code: "3306", area: "Madhabpur" },
          { code: "3307", area: "Nabiganj" },
        ]
      },
      {
        name: "Moulvibazar",
        postalCodes: [
          { code: "3200", area: "Moulvibazar Sadar" },
          { code: "3201", area: "Barlekha" },
          { code: "3202", area: "Juri" },
          { code: "3203", area: "Kamalganj" },
          { code: "3204", area: "Kulaura" },
          { code: "3205", area: "Rajnagar" },
          { code: "3206", area: "Sreemangal" },
        ]
      },
      {
        name: "Sunamganj",
        postalCodes: [
          { code: "3000", area: "Sunamganj Sadar" },
          { code: "3001", area: "Bishwambarpur" },
          { code: "3002", area: "Chhatak" },
          { code: "3003", area: "Derai" },
          { code: "3004", area: "Dharampasha" },
          { code: "3005", area: "Dowarabazar" },
          { code: "3006", area: "Jagannathpur" },
          { code: "3007", area: "Jamalganj" },
          { code: "3008", area: "Sullah" },
          { code: "3009", area: "Tahirpur" },
          { code: "3010", area: "South Sunamganj" },
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
          { code: "6004", area: "Durgapur" },
          { code: "6005", area: "Godagari" },
          { code: "6006", area: "Mohanpur" },
          { code: "6007", area: "Paba" },
          { code: "6008", area: "Puthia" },
          { code: "6009", area: "Tanore" },
        ]
      },
      {
        name: "Bogura",
        postalCodes: [
          { code: "5800", area: "Bogura Sadar" },
          { code: "5801", area: "Adamdighi" },
          { code: "5802", area: "Dhunat" },
          { code: "5803", area: "Dhupchanchia" },
          { code: "5804", area: "Gabtali" },
          { code: "5805", area: "Kahaloo" },
          { code: "5806", area: "Nandigram" },
          { code: "5807", area: "Sariakandi" },
          { code: "5808", area: "Shajahanpur" },
          { code: "5809", area: "Sherpur" },
          { code: "5810", area: "Shibganj" },
          { code: "5811", area: "Sonatola" },
        ]
      },
      {
        name: "Chapainawabganj",
        postalCodes: [
          { code: "6300", area: "Chapainawabganj Sadar" },
          { code: "6301", area: "Bholahat" },
          { code: "6302", area: "Gomastapur" },
          { code: "6303", area: "Nachole" },
          { code: "6304", area: "Shibganj" },
        ]
      },
      {
        name: "Joypurhat",
        postalCodes: [
          { code: "5900", area: "Joypurhat Sadar" },
          { code: "5901", area: "Akkelpur" },
          { code: "5902", area: "Kalai" },
          { code: "5903", area: "Khetlal" },
          { code: "5904", area: "Panchbibi" },
        ]
      },
      {
        name: "Naogaon",
        postalCodes: [
          { code: "6500", area: "Naogaon Sadar" },
          { code: "6501", area: "Atrai" },
          { code: "6502", area: "Badalgachi" },
          { code: "6503", area: "Dhamoirhat" },
          { code: "6504", area: "Manda" },
          { code: "6505", area: "Mahadebpur" },
          { code: "6506", area: "Niamatpur" },
          { code: "6507", area: "Patnitala" },
          { code: "6508", area: "Porsha" },
          { code: "6509", area: "Raninagar" },
          { code: "6510", area: "Sapahar" },
        ]
      },
      {
        name: "Natore",
        postalCodes: [
          { code: "6400", area: "Natore Sadar" },
          { code: "6401", area: "Baraigram" },
          { code: "6402", area: "Bagatipara" },
          { code: "6403", area: "Gurudaspur" },
          { code: "6404", area: "Lalpur" },
          { code: "6405", area: "Singra" },
        ]
      },
      {
        name: "Pabna",
        postalCodes: [
          { code: "6600", area: "Pabna Sadar" },
          { code: "6601", area: "Atgharia" },
          { code: "6602", area: "Bera" },
          { code: "6603", area: "Bhangura" },
          { code: "6604", area: "Chatmohar" },
          { code: "6605", area: "Faridpur" },
          { code: "6606", area: "Ishwardi" },
          { code: "6607", area: "Santhia" },
          { code: "6608", area: "Sujanagar" },
        ]
      },
      {
        name: "Sirajganj",
        postalCodes: [
          { code: "6700", area: "Sirajganj Sadar" },
          { code: "6701", area: "Belkuchi" },
          { code: "6702", area: "Chauhali" },
          { code: "6703", area: "Kamarkhanda" },
          { code: "6704", area: "Kazipur" },
          { code: "6705", area: "Raiganj" },
          { code: "6706", area: "Shahjadpur" },
          { code: "6707", area: "Tarash" },
          { code: "6708", area: "Ullahpara" },
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
          { code: "9001", area: "Sonadanga" },
          { code: "9002", area: "Khalishpur" },
          { code: "9003", area: "Daulatpur" },
          { code: "9004", area: "Rupsha" },
          { code: "9005", area: "Batiaghata" },
          { code: "9006", area: "Dacope" },
          { code: "9007", area: "Dumuria" },
          { code: "9008", area: "Dighalia" },
          { code: "9009", area: "Koyra" },
          { code: "9010", area: "Paikgachha" },
          { code: "9011", area: "Phultala" },
          { code: "9012", area: "Rupsha" },
          { code: "9013", area: "Terokhada" },
        ]
      },
      {
        name: "Bagerhat",
        postalCodes: [
          { code: "9300", area: "Bagerhat Sadar" },
          { code: "9301", area: "Chitalmari" },
          { code: "9302", area: "Fakirhat" },
          { code: "9303", area: "Kachua" },
          { code: "9304", area: "Mollahat" },
          { code: "9305", area: "Mongla" },
          { code: "9306", area: "Morrelganj" },
          { code: "9307", area: "Rampal" },
          { code: "9308", area: "Sarankhola" },
        ]
      },
      {
        name: "Chuadanga",
        postalCodes: [
          { code: "7200", area: "Chuadanga Sadar" },
          { code: "7201", area: "Alamdanga" },
          { code: "7202", area: "Damurhuda" },
          { code: "7203", area: "Jibannagar" },
        ]
      },
      {
        name: "Jashore",
        postalCodes: [
          { code: "7400", area: "Jashore Sadar" },
          { code: "7401", area: "Abhaynagar" },
          { code: "7402", area: "Bagherpara" },
          { code: "7403", area: "Chaugachha" },
          { code: "7404", area: "Jhikargachha" },
          { code: "7405", area: "Keshabpur" },
          { code: "7406", area: "Manirampur" },
          { code: "7407", area: "Sharsha" },
        ]
      },
      {
        name: "Jhenaidah",
        postalCodes: [
          { code: "7300", area: "Jhenaidah Sadar" },
          { code: "7301", area: "Harinakunda" },
          { code: "7302", area: "Kaliganj" },
          { code: "7303", area: "Kotchandpur" },
          { code: "7304", area: "Maheshpur" },
          { code: "7305", area: "Shailkupa" },
        ]
      },
      {
        name: "Kushtia",
        postalCodes: [
          { code: "7000", area: "Kushtia Sadar" },
          { code: "7001", area: "Bheramara" },
          { code: "7002", area: "Daulatpur" },
          { code: "7003", area: "Khoksa" },
          { code: "7004", area: "Kumarkhali" },
          { code: "7005", area: "Mirpur" },
        ]
      },
      {
        name: "Magura",
        postalCodes: [
          { code: "7600", area: "Magura Sadar" },
          { code: "7601", area: "Mohammadpur" },
          { code: "7602", area: "Shalikha" },
          { code: "7603", area: "Sreepur" },
        ]
      },
      {
        name: "Meherpur",
        postalCodes: [
          { code: "7100", area: "Meherpur Sadar" },
          { code: "7101", area: "Gangni" },
          { code: "7102", area: "Mujibnagar" },
        ]
      },
      {
        name: "Narail",
        postalCodes: [
          { code: "7500", area: "Narail Sadar" },
          { code: "7501", area: "Kalia" },
          { code: "7502", area: "Lohagara" },
        ]
      },
      {
        name: "Satkhira",
        postalCodes: [
          { code: "9400", area: "Satkhira Sadar" },
          { code: "9401", area: "Assasuni" },
          { code: "9402", area: "Debhata" },
          { code: "9403", area: "Kalaroa" },
          { code: "9404", area: "Kaliganj" },
          { code: "9405", area: "Shyamnagar" },
          { code: "9406", area: "Tala" },
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
          { code: "8204", area: "Banaripara" },
          { code: "8205", area: "Gaurnadi" },
          { code: "8206", area: "Hizla" },
          { code: "8207", area: "Mehendiganj" },
          { code: "8208", area: "Muladi" },
          { code: "8209", area: "Wazirpur" },
        ]
      },
      {
        name: "Barguna",
        postalCodes: [
          { code: "8700", area: "Barguna Sadar" },
          { code: "8701", area: "Amtali" },
          { code: "8702", area: "Bamna" },
          { code: "8703", area: "Betagi" },
          { code: "8704", area: "Patharghata" },
        ]
      },
      {
        name: "Bhola",
        postalCodes: [
          { code: "8300", area: "Bhola Sadar" },
          { code: "8301", area: "Burhanuddin" },
          { code: "8302", area: "Char Fasson" },
          { code: "8303", area: "Daulatkhan" },
          { code: "8304", area: "Lalmohan" },
          { code: "8305", area: "Manpura" },
          { code: "8306", area: "Tazumuddin" },
        ]
      },
      {
        name: "Jhalokati",
        postalCodes: [
          { code: "8400", area: "Jhalokati Sadar" },
          { code: "8401", area: "Kathalia" },
          { code: "8402", area: "Nalchity" },
          { code: "8403", area: "Rajapur" },
        ]
      },
      {
        name: "Patuakhali",
        postalCodes: [
          { code: "8600", area: "Patuakhali Sadar" },
          { code: "8601", area: "Bauphal" },
          { code: "8602", area: "Dashmina" },
          { code: "8603", area: "Dumki" },
          { code: "8604", area: "Galachipa" },
          { code: "8605", area: "Kalapara" },
          { code: "8606", area: "Mirzaganj" },
          { code: "8607", area: "Rangabali" },
        ]
      },
      {
        name: "Pirojpur",
        postalCodes: [
          { code: "8500", area: "Pirojpur Sadar" },
          { code: "8501", area: "Bhandaria" },
          { code: "8502", area: "Kawkhali" },
          { code: "8503", area: "Mathbaria" },
          { code: "8504", area: "Nazirpur" },
          { code: "8505", area: "Nesarabad" },
          { code: "8506", area: "Zianagar" },
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
          { code: "5404", area: "Mithapukur" },
          { code: "5405", area: "Pirgachha" },
          { code: "5406", area: "Pirganj" },
          { code: "5407", area: "Taraganj" },
        ]
      },
      {
        name: "Dinajpur",
        postalCodes: [
          { code: "5200", area: "Dinajpur Sadar" },
          { code: "5201", area: "Birampur" },
          { code: "5202", area: "Birganj" },
          { code: "5203", area: "Bochaganj" },
          { code: "5204", area: "Chirirbandar" },
          { code: "5205", area: "Fulbari" },
          { code: "5206", area: "Ghoraghat" },
          { code: "5207", area: "Hakimpur" },
          { code: "5208", area: "Kaharole" },
          { code: "5209", area: "Khansama" },
          { code: "5210", area: "Nawabganj" },
          { code: "5211", area: "Parbatipur" },
        ]
      },
      {
        name: "Gaibandha",
        postalCodes: [
          { code: "5700", area: "Gaibandha Sadar" },
          { code: "5701", area: "Fulchhari" },
          { code: "5702", area: "Gobindaganj" },
          { code: "5703", area: "Palashbari" },
          { code: "5704", area: "Sadullapur" },
          { code: "5705", area: "Saghata" },
          { code: "5706", area: "Sundarganj" },
        ]
      },
      {
        name: "Kurigram",
        postalCodes: [
          { code: "5600", area: "Kurigram Sadar" },
          { code: "5601", area: "Bhurungamari" },
          { code: "5602", area: "Char Rajibpur" },
          { code: "5603", area: "Chilmari" },
          { code: "5604", area: "Phulbari" },
          { code: "5605", area: "Nageshwari" },
          { code: "5606", area: "Rajarhat" },
          { code: "5607", area: "Raomari" },
          { code: "5608", area: "Ulipur" },
        ]
      },
      {
        name: "Lalmonirhat",
        postalCodes: [
          { code: "5500", area: "Lalmonirhat Sadar" },
          { code: "5501", area: "Aditmari" },
          { code: "5502", area: "Hatibandha" },
          { code: "5503", area: "Kaliganj" },
          { code: "5504", area: "Patgram" },
          { code: "5505", area: "Tushbhandar" },
        ]
      },
      {
        name: "Nilphamari",
        postalCodes: [
          { code: "5300", area: "Nilphamari Sadar" },
          { code: "5301", area: "Dimla" },
          { code: "5302", area: "Domar" },
          { code: "5303", area: "Jaldhaka" },
          { code: "5304", area: "Kishoreganj" },
          { code: "5305", area: "Syedpur" },
        ]
      },
      {
        name: "Panchagarh",
        postalCodes: [
          { code: "5000", area: "Panchagarh Sadar" },
          { code: "5001", area: "Atwari" },
          { code: "5002", area: "Boda" },
          { code: "5003", area: "Debiganj" },
          { code: "5004", area: "Tetulia" },
        ]
      },
      {
        name: "Thakurgaon",
        postalCodes: [
          { code: "5100", area: "Thakurgaon Sadar" },
          { code: "5101", area: "Baliadangi" },
          { code: "5102", area: "Haripur" },
          { code: "5103", area: "Pirganj" },
          { code: "5104", area: "Ranisankail" },
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
          { code: "2204", area: "Gaffargaon" },
          { code: "2205", area: "Gauripur" },
          { code: "2206", area: "Haluaghat" },
          { code: "2207", area: "Ishwarganj" },
          { code: "2208", area: "Muktagachha" },
          { code: "2209", area: "Nandail" },
          { code: "2210", area: "Phulpur" },
          { code: "2211", area: "Trishal" },
          { code: "2212", area: "Tara Khanda" },
        ]
      },
      {
        name: "Jamalpur",
        postalCodes: [
          { code: "2000", area: "Jamalpur Sadar" },
          { code: "2001", area: "Baksiganj" },
          { code: "2002", area: "Dewanganj" },
          { code: "2003", area: "Islampur" },
          { code: "2004", area: "Madarganj" },
          { code: "2005", area: "Melandaha" },
          { code: "2006", area: "Sarishabari" },
        ]
      },
      {
        name: "Netrokona",
        postalCodes: [
          { code: "2400", area: "Netrokona Sadar" },
          { code: "2401", area: "Atpara" },
          { code: "2402", area: "Barhatta" },
          { code: "2403", area: "Durgapur" },
          { code: "2404", area: "Khaliajuri" },
          { code: "2405", area: "Kalmakanda" },
          { code: "2406", area: "Kendua" },
          { code: "2407", area: "Madan" },
          { code: "2408", area: "Mohanganj" },
          { code: "2409", area: "Purbadhala" },
        ]
      },
      {
        name: "Sherpur",
        postalCodes: [
          { code: "2100", area: "Sherpur Sadar" },
          { code: "2101", area: "Jhenaigati" },
          { code: "2102", area: "Nakla" },
          { code: "2103", area: "Nalitabari" },
          { code: "2104", area: "Sreebardi" },
        ]
      }
    ]
  }
];

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

