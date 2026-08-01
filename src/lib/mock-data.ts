import type { Unit } from "@/types/unit";

export const availableUnits: Unit[] = [
  {
    id: 1,
    name: "Teridox Heights A12",
    property: "Teridox Heights",
    location: "Kuningan, Jakarta Selatan",
    address: "Jl. Rasuna Said, Kuningan, Jakarta Selatan 12940",
    price: "Rp 2.500.000",
    priceNumeric: 2500000,
    type: "Studio",
    status: "Tersedia",
    rating: 4.8,
    amenities: [
      { icon: "wifi", label: "WiFi" },
      { icon: "ac_unit", label: "AC" },
      { icon: "shower", label: "Kamar Mandi Dalam" },
    ],
    sqft: "36.5 m²",
    bedType: "Queen Size",
    floorLevel: "Lantai 12",
    description:
      "Rasakan puncak hunian urban di Teridox Heights A12. Unit studio premium ini dirancang secara teliti untuk para profesional yang mencari keseimbangan antara elegansi arsitektural dan kenyamanan fungsional. Terletak di jantung Kuningan, Jakarta Selatan, penghuni menikmati akses tak tertandingi ke pusat bisnis utama kota.\n\nInterior mengikuti estetika modernis korporat, menampilkan finishing berkualitas tinggi, integrasi smart home, dan tata letak luas yang memaksimalkan produktivitas dan relaksasi. Tim manajemen properti kami yang berdedikasi memastikan pengalaman hunian yang mulus dengan dukungan 24/7 dan layanan perawatan premium.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBoAqAfY_wppKKneRIA81VG4G6ST_lZDkbekRUNwOXOoeRbUgV7egGWsYtKD2MsXZMdYr8LzlIzweV1pHspjSYDbDd1BfS8V2UmopR4ZNf5L-SpWglU3bjL_yIa9MSbEjjJ0YEwPnv_Ri6WzxjQRB79b0cDChz0but7PBBfILXPzgFh7Jw6H-jQxIXmxW7uI5bgvgrlXrwg9YEzOXCLQE3IOb7PBWNnMcgdyVmD9LBXTLt0NMheMBMgA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7qEJ5VukOD33uHLPFOjNo56Ih10XdMgkfDNbfAxU1khqG2YBTWfKskQBuIlR3GgFbQ40eoeQiYMnQuxt6Ry_NTN9IduFgEX3KQHfLJUdyTkETwhvQRBd3JpvFsTvDvMabdsJyOSlmkYFlgraawfvuyKFJq97bbDSl2Z0RVhCUKecYYGy5_XHoiSdE7Ch5ny6NPSVVvLvMLgmBIUQGcIMB3LfCit1-qq4QEgFDhIbNYWFi6FfwH0JfwA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaEzSrLFJauza7C786q1wdad2iTpLYkmadV44Cr_FMffHwxvNZOeQrdpx7KJYUu7LmYm4itwzvTIHIPZzP3JZeo6o0TrSh_3md1cX3WGIWG7jKb0LXdoA86twXf_wFrkP0no7XdAoeeiS2AtZZRfOEcug0oM20ine1GrYclHxrz7PdHqglyk6bJ2JODp1hqbAEq7dbm-EF4-eY_D-y98uTiQ2bRD6NJ5uzddDu4pzEGHNH5CaHqNrJ6A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBj6JzB3K3j-ydC2yQvMFC0nRi89VWMRT1SNPfLgKuSMc3sbfhkgMhGkvnhWbDQrqQ6uHPoZWny4ONXx2lYAV4ZdcI-FxYqti8353Gyz-kddO0h5sUHKT8SltNrbNT9pkxU6rs0AVUheEzs_58cxWqULj0_Uf_N-48wBqGkWG2rbWJ1dPqAr4TLq1kqqzLvKbIGNK4so8pInvrohWnvxtE7tRonZ8tM-OoJEOxgHvKQN_AWNDAmN18kpg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGGYrL94NVqHVu_K-zQ9WdKSEqY2zylCmsCVhP-u_8ih_gtyXsRi5L8K09t9JuRcLPvTmrA4BwKrFXO5kuW5qJDSqOTXiLeDc2f9uPNvlzCPSQS7ek4STEVIN47lZtVulaoIng9OyrMNAsvxwDtEswVWpKB50_sPf7CsMNaMKGZoe2-Ihv7WDy7izmZ4m_6toyXax4knNycUwukY7sHBj38zA5_RfM1N9cwEmFyKU3E5ZYAcIn6guoJA",
    ],
    agent: {
      name: "Sarah Wijaya",
      title: "Agen Utama",
      rating: 4.9,
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1r47bSiri4pxlhnLdZHUjAJSk0_S4W3QLD7drx_DRhvA1Ls15W3OctJXqAZJrEWZ5cjqBiXRcbtSsxQWeMhoWjp20rZHiSta3e2i-jmLN_FN-m0BVeouzYIuRz7vsRS-QCSijDwdgKr_PaJqziSaklyyZpNsBhiovbtJWYQoh8-HJ73WonV_Obk3k8WDZqZ91bZWQJk_Nj0AbuL6xh4g1qLYRB4h_pcpX_xtTOGK9i8Yhq_IQVf_Reg",
    },
  },
  {
    id: 2,
    name: "Urban Loft C-04",
    property: "Urban Loft Residence",
    location: "Senayan, Jakarta Pusat",
    address: "Jl. Asia Afrika, Senayan, Jakarta Pusat 10270",
    price: "Rp 3.800.000",
    priceNumeric: 3800000,
    type: "Loft",
    status: "Maintenance",
    rating: 4.9,
    amenities: [
      { icon: "ac_unit", label: "AC" },
      { icon: "security", label: "Keamanan 24 Jam" },
    ],
    sqft: "48 m²",
    bedType: "King Size",
    floorLevel: "Lantai 4",
    description:
      "Unit loft bergaya industrial modern di kawasan elit Senayan. Dilengkapi dengan langit-langit tinggi, elemen bata ekspos, dan meja kerja ergonomis premium. Lokasi strategis dekat SCBD dan GBK.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-dWVBFA9QncwqbifG9WYWtW2rw-kfP9kHdShRtz7ueKd1ofX8BU8yXkbZs-PFvgd84RJJNTdyEtjsUUIuP4MXNnS7PcTHvc1UvQZDWXL_sYufvtwK5P7Owmdio-_NRwtvtcEc3y40Hiy_cQEnTTSv1EcbDELacLy2m1YT0zcwpJscOgavE18Vqc4YxB2j-OBdHx6iQ-HdKGI867JgOT6Yk18bv4nm6YJ6CC8OJ1YF7YbzS5271_CYmw",
    ],
    agent: {
      name: "Sarah Wijaya",
      title: "Agen Utama",
      rating: 4.9,
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1r47bSiri4pxlhnLdZHUjAJSk0_S4W3QLD7drx_DRhvA1Ls15W3OctJXqAZJrEWZ5cjqBiXRcbtSsxQWeMhoWjp20rZHiSta3e2i-jmLN_FN-m0BVeouzYIuRz7vsRS-QCSijDwdgKr_PaJqziSaklyyZpNsBhiovbtJWYQoh8-HJ73WonV_Obk3k8WDZqZ91bZWQJk_Nj0AbuL6xh4g1qLYRB4h_pcpX_xtTOGK9i8Yhq_IQVf_Reg",
    },
  },
  {
    id: 3,
    name: "Eco Residence G-09",
    property: "Eco Residence",
    location: "BSD, Tangerang",
    address: "Jl. BSD Raya, Tangerang Selatan 15345",
    price: "Rp 1.800.000",
    priceNumeric: 1800000,
    type: "Standard",
    status: "Tersedia",
    rating: 4.6,
    amenities: [
      { icon: "mode_fan", label: "Non-AC" },
      { icon: "cleaning_services", label: "Laundry Mingguan" },
    ],
    sqft: "24 m²",
    bedType: "Single",
    floorLevel: "Lantai 9",
    description:
      "Kamar standar yang bersih dan terang dengan desain Skandinavia minimalis. Dilengkapi jendela besar menghadap taman. Cocok untuk mahasiswa dan pekerja muda yang menginginkan lingkungan tenang.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmZ9Q1Q86MU5GK-zAZSw_EYgv8TKphbQqFt4c2GFRauE1T9yATOUq45Z_IXggnHjX4NLyKOyTzfwo1CGTe--VA_lEDKeYXfFSMLy3LXQt5JOQGoHrldvvTJiJmZMI8KAIWh3Ji5UuU-Iza1UlA8p9bjFcuXAz3DeQr_0K9UVApnCzyUR99aWb0GQkVoKuMbqHqh44JRBpgAwZ9yBIybZ8OgFBNExCE7HZtDEoLFZZoFzb86C3sP5xf0A",
    ],
  },
  {
    id: 4,
    name: "Smart Studio X-1",
    property: "Smart Living",
    location: "Thamrin, Jakarta Pusat",
    address: "Jl. MH Thamrin, Jakarta Pusat 10350",
    price: "Rp 4.500.000",
    priceNumeric: 4500000,
    type: "Studio",
    status: "Tersedia",
    rating: 5.0,
    amenities: [
      { icon: "ac_unit", label: "AC" },
      { icon: "wifi", label: "WiFi" },
      { icon: "shower", label: "Kamar Mandi Dalam" },
    ],
    sqft: "32 m²",
    bedType: "Queen Size",
    floorLevel: "Lantai 1",
    description:
      "Studio bergaya korporat dengan smart home terintegrasi dan tata letak berkepadatan tinggi namun terasa lega. Panel kayu gelap, dapur tersembunyi, dan tekstil navy premium.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfaLqurmdZYo3sYuypPOnCNtb-Nl462YnKnHiSpFCnOSb2EWRWyboeYusHTXO_y1p244lIvSgFCBScQRPRpyqzsGE4FTcK1oos2AhUvFp6RwFUldUP5KDLWWpIW1s2nrmXQ0GZo1CY8k3Kb0D4xqAPHeBxK0_8YZrLo1qxztRvf0Vh1IvpOJOjroHcO7xaGMedD-g1LRkCbZG4KU9CrsIc4bY8lzUvsbQBUZfNQZRgdrr52jYVWYITnw",
    ],
  },
  {
    id: 5,
    name: "Garden View Room",
    property: "Garden Residence",
    location: "Bintaro, Jakarta Selatan",
    address: "Jl. Bintaro Utama, Jakarta Selatan 12330",
    price: "Rp 2.100.000",
    priceNumeric: 2100000,
    type: "Standard",
    status: "Tersedia",
    rating: 4.7,
    amenities: [
      { icon: "ac_unit", label: "AC" },
      { icon: "wifi", label: "WiFi" },
    ],
    sqft: "28 m²",
    bedType: "Single",
    floorLevel: "Lantai Dasar",
    description:
      "Kamar nyaman namun profesional di kawasan residensial, menampilkan ruang yang terorganisir rapi dengan jendela besar menghadap taman. Cocok untuk mahasiswa atau pekerja muda.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ1m59Z6zg-qjDHIHrx0kG9m4WRKsSNXpVDRpsV5B8GSYdth-bwUvpFDVdX7O309EhHiJO4RUHlR7qJZu1UlmpWGtAZXENy6mQOgmhYxSNID1WksN-rdAh_SzEwRK6JVIG2Idytzn_YNtN6vMD21pZiPkOyK8Q6UgjbgmMjrv3nxchzWYOV8JbJv57o98qdRDT3bFTLjOnYjdFXlBYvuLv8yTAI_SgGh_in-OIfj22Slp9Z3a6RLr1wg",
    ],
  },
  {
    id: 6,
    name: "Executive Suite 402",
    property: "Executive Tower",
    location: "SCBD, Jakarta Selatan",
    address: "Jl. Jend. Sudirman, SCBD, Jakarta Selatan 12190",
    price: "Rp 5.500.000",
    priceNumeric: 5500000,
    type: "Suite",
    status: "Tersedia",
    rating: 4.9,
    amenities: [
      { icon: "ac_unit", label: "AC" },
      { icon: "wifi", label: "WiFi" },
      { icon: "shower", label: "Kamar Mandi Dalam" },
      { icon: "local_parking", label: "Parkir" },
    ],
    sqft: "52 m²",
    bedType: "King Size",
    floorLevel: "Lantai 4",
    description:
      "Suite eksekutif minimalis dengan furnitur premium dan skema warna monokromatik abu-abu yang dipadu elemen dekoratif biru tua. Terasa luas berkat partisi kaca dan efek cermin.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQhATSb2eQMIrKIfqSeq4AOku6mey1CagLq4DMWmT580yiGfev-Czol3LO9OMPHRutbIKPYbblHEINRTiJco-8jfwIlfyfZiqAiTGXt3xzckj8tntwfcKWOg_fqSdlGKlNdrAO3-iMyQNMgfhoGnETsuhIMsqW8iKqF26sGbYm7GIhg8KlbBOpoTmGmVY58pQ5x7ZxQWV2if50ANkCEgMA74It_2szJ2S0OjCJir7eHyX8kMp_WzeGYg",
    ],
  },
];

// Hero image for home page
export const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDwuxVTdQU1vXS7XVD_GxlgwSQfsUyxntkKExszlXxVVMk6TtgcG3foGT3LqmTIRT78_GzI3Nm4zMtdBbdqzJHb66BCo_tvz3LYjuHGqNQWOl3gpfonPyF8LDhWIEyUUzY1Yk9DOh07inrO1kE9ktupId2jxa1uE_PlPyNndGDb69zI0u65G4af-34nRK5tZZRVUeo3rKOBSZAqAwbDYNlYdxbkqE9QLsY6ThhP-Rh3jg6dLslE1Gcp7A";

// About page images
export const aboutImages = {
  banner:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDJxx-Tr_CmIoR8KCXu8K7UmiylEtjJVwHVpU3y0mAYx0MAYaVi5yR7jP9vSpsKvh-WOnQEEU_NBhJTzmhsV5fNe6n8moj8oK0nxSMBEy2QrbWFlU5eTJ_dpeWwUsMlxI5cdtbHIEFiWh80zYcpRJjLf4Ua9ThautBXWw3cKVWwO0kZbMI8Zo3XV-kkJiL9-Dp5DYZ68V-K87xq29jwi3AvSuhfYd6ng-MKk_HGJbot7zSYzGB1y3iJJg",
  hallway:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChGeI1zXi0exRPeUCN5ytEhkqDOm-AGJ5Q4FUI2DBDvx_v_xmz-rHJRBaXrzyV_uhmoWDki6UG3v1PjXAlrf1UnATeSAsShlRu2xPHCZL3xO7Mwdtx5l_Fg2DiGFTZakjCY4GCx0NXFS8MtB6FhcJyAWRAF2_6gkRGlSUCO2-Hz1sGqOKFBroAMUkjneal3lF3jwNBqsfunEhGxyjXZr5VA1ebA6rUesV3IVoVudcHpNAaMoxIUIPsYQ",
  teamFemale:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5qnhu98OseXg1X8bf5umFfxG1TSRgLMiAOT1iM4eMtHp7jUDzCW40qlarcaI9NkAKQi5V3i3pnhhRBAHlHNd7V5a8moK1qTrCY9JapTMUL_7K84fjxME1ldC9HQVjbtV4qV3_vOTfbSk57GUJHB_x_kabCr2mDo2K2pQVho97yEyjjsLzN2BVVAXz_uORP9XsZc80Mup7avlpSDCQDDE6xS_mjk6SIMLY59iPOAT0XPL4PNvIXDSmw",
  teamMale:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0Obit9jd6y1O-QMJciKTb-Zl7ksnQSrlBXThkRlprGhcoLqVact_-vat77Vo623qzQIiR4qqyJTelCHl6s7Cy6rcd_ovgEJqh84dDeSgLahy5EZpFHDXKKylqLMoGszdZ1w2iIf8vswcRTqwaxMih7JGIEWnAxagg1E-ZFdRstjXRudGxOCNRhcPGzEkPHWAlGegLI5QqAfECWtXUWNwRAt-iY2ZmQssnzVK7soB5fkuFC98nEl0PbQ",
};

// Contact page images
export const contactImages = {
  banner:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBSZabkKErzrMR6SYLYfRpPvFrSZnTDKbqy3WY3R0O7TG-Im6Q_-5cjSKUM498oRcMCCkFYlBuWpKdwFax35ErJLucCShX9u-pEp0gt6I0gpl1b_9T3uyL-cjC7ZDgToBor5L4hvQcmiJDHIdJWlSSpWnKR52Dmyhn6XLFB1ojzZLzdZT1Y8yyfh9DEGjUrL5TCdC1t-TAZUpFs7wSq3ifHR-_8VJJiVKeM1reWciPE0-yxSd4rlU5Q0Q",
  map: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB1Maxt03ATzO0FZ3hUMjwtfixa_6svsej2V9WIfSi6Dx8wmu-SwGksoe_vUeF25gAUq4V0SBKzX-5l8GaHxWLpTikJOYHKEYVAEK_sCt22_cMozIt0X-nZiHDUuOMD93s9MnwwdQZCNsXvvDLM6yHNq7QARZQf7Nq0ljdJa1d-TfZEQ1Gk6gEgA3BpxKBpaCc13nXAVW2lJ5MIv1xaHfKQ_DiU7-3vThR2p9XsRifPaeUPROZiP2s9g",
};

// Featured units for home page (first 3)
export const featuredUnits = availableUnits.slice(0, 3);
