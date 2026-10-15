export type Language = "en" | "hi";

export interface TranslationDictionary {
  navbar: {
    title: string;
    subtitle: string;
    directory: string;
    register: string;
    admin: string;
  };
  home: {
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    registerBtn: string;
    exploreBtn: string;
    statusLabel: string;
    statusValue: string;
    totalLabel: string;
    totalSuffix: string;
    instantLabel: string;
    instantValue: string;
    directoryHeading: string;
    directorySubtitle: string;
  };
  form: {
    heading: string;
    subheading: string;
    badge: string;
    backBtn: string;
    photoTitle: string;
    photoGuidance: string;
    uploadBtn: string;
    changeBtn: string;
    selectPhoto: string;

    // Sections
    personalTitle: string;
    fullName: string;
    dob: string;
    tob: string;
    pob: string;
    height: string;
    age: string;
    gotra: string;

    locationTitle: string;
    gaon: string;
    area: string;
    domicile: string;
    residentAddress: string;

    eduCareerTitle: string;
    education: string;
    occupation: string;

    familyTitle: string;
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    siblings: string;
    grandFather: string;
    grandMother: string;

    contactTitle: string;
    primaryPhone: string;
    fatherContact: string;
    motherContact: string;

    submitBtn: string;
    submitting: string;
    disclaimer: string;
  };
  profile: {
    backBtn: string;
    verifiedBadge: string;
    ageLabel: string;
    birthDetails: string;
    pob: string;
    tob: string;
    height: string;
    gotra: string;
    originTitle: string;
    gaon: string;
    area: string;
    domicile: string;
    address: string;
    eduTitle: string;
    education: string;
    occupation: string;
    familyTitle: string;
    father: string;
    mother: string;
    siblings: string;
    grandFather: string;
    grandMother: string;
    contactTitle: string;
    primaryPhone: string;
    fatherPhone: string;
    motherPhone: string;
    callNow: string;
    qrTitle: string;
    qrSubtitle: string;
    shareWhatsApp: string;
    downloadQr: string;
    copyLink: string;
    printBiodata: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    navbar: {
      title: "Samaj Biodata",
      subtitle: "Official Community Verification Hub • Est. 2026",
      directory: "Directory",
      register: "Register Biodata",
      admin: "Admin",
    },
    home: {
      badge: "Verified Community Registry",
      heroTitle: "Community Biodata & Lineage Directory",
      heroSubtitle: "A trusted community directory linking native roots, verified educational & professional profiles, and shareable digital QR biodatas.",
      registerBtn: "Register New Biodata",
      exploreBtn: "Explore Directory",
      statusLabel: "Registry Status",
      statusValue: "Admin Verified",
      totalLabel: "Total Published",
      totalSuffix: "Active Records",
      instantLabel: "Instant Access",
      instantValue: "Scan & Share via QR",
      directoryHeading: "Verified Community Directory",
      directorySubtitle: "Filter by native village, metropolitan area, or search by profession.",
    },
    form: {
      heading: "Community Biodata Registration",
      subheading: "Please submit authentic and accurate details for verification. Once approved by the administrator, your digital QR biodata will be published.",
      badge: "Official Registration Form",
      backBtn: "Back to Directory",
      photoTitle: "Passport Photograph",
      photoGuidance: "Please upload a recent, clear portrait photo (JPG, PNG, max 5MB).",
      uploadBtn: "Upload Photograph",
      changeBtn: "Change Photo",
      selectPhoto: "Select Photo",

      personalTitle: "1. Personal Identity & Astrological Details",
      fullName: "Full Name",
      dob: "Date of Birth (D.O.B.)",
      tob: "Time of Birth",
      pob: "Place of Birth",
      height: "Height",
      age: "Age (in Years)",
      gotra: "Gotra",

      locationTitle: "2. Native Lineage & Residence",
      gaon: "Native Village (Gaon / Mool Niwas)",
      area: "Current City / Area",
      domicile: "Domicile State / City",
      residentAddress: "Full Residential Address",

      eduCareerTitle: "3. Education & Profession",
      education: "Highest Education / Degree",
      occupation: "Current Occupation / Business",

      familyTitle: "4. Family Details & Lineage",
      fatherName: "Father's Name",
      fatherOccupation: "Father's Occupation",
      motherName: "Mother's Name",
      motherOccupation: "Mother's Occupation",
      siblings: "Siblings (Brothers / Sisters)",
      grandFather: "Grandfather's Name (Paternal)",
      grandMother: "Grandmother's Name (Paternal)",

      contactTitle: "5. Contact & Emergency Details",
      primaryPhone: "Primary Contact Number (10-Digit)",
      fatherContact: "Father's Contact Number",
      motherContact: "Mother's Contact Number",

      submitBtn: "Submit Biodata for Verification",
      submitting: "Submitting Biodata & Uploading...",
      disclaimer: "Your information is secure. Profiles are published to the public directory only after administrator verification.",
    },
    profile: {
      backBtn: "Back to Directory",
      verifiedBadge: "Verified Samaj Record",
      ageLabel: "Age",
      birthDetails: "Birth & Horoscope Details",
      pob: "Place of Birth",
      tob: "Time of Birth",
      height: "Height",
      gotra: "Gotra",
      originTitle: "Native Village & Residence",
      gaon: "Native Village (Gaon)",
      area: "Current Area / City",
      domicile: "Domicile",
      address: "Residential Address",
      eduTitle: "Education & Career",
      education: "Education",
      occupation: "Occupation",
      familyTitle: "Family Details & Lineage",
      father: "Father",
      mother: "Mother",
      siblings: "Siblings",
      grandFather: "Paternal Grandfather",
      grandMother: "Paternal Grandmother",
      contactTitle: "Contact Details",
      primaryPhone: "Primary Phone",
      fatherPhone: "Father's Phone",
      motherPhone: "Mother's Phone",
      callNow: "Call",
      qrTitle: "Digital Biodata QR Code",
      qrSubtitle: "Scan from any smartphone camera or WhatsApp to open this verified card.",
      shareWhatsApp: "Share on WhatsApp",
      downloadQr: "Download QR (PNG)",
      copyLink: "Copy Profile Link",
      printBiodata: "Print Biodata",
    },
  },
  hi: {
    navbar: {
      title: "समाज बायोडाटा",
      subtitle: "प्रमाणित समुदाय निर्देशिका • स्था. 2026",
      directory: "निर्देशिका",
      register: "बायोडाटा जोड़ें",
      admin: "प्रशासन",
    },
    home: {
      badge: "प्रमाणित समाज अभिलेख",
      heroTitle: "सामूहिक बायोडाटा एवं पारिवारिक निर्देशिका",
      heroSubtitle: "मूल गाँव, प्रमाणित शैक्षणिक व व्यावसायिक प्रोफाइल एवं डिजिटल क्यूआर पहचान पत्र को जोड़ने वाली विश्वसनीय समुदाय निर्देशिका।",
      registerBtn: "नया बायोडाटा जोड़ें",
      exploreBtn: "निर्देशिका देखें",
      statusLabel: "सत्यापन स्थिति",
      statusValue: "एडमिन सत्यापित",
      totalLabel: "कुल प्रकाशित",
      totalSuffix: "सक्रिय अभिलेख",
      instantLabel: "त्वरित पहुँच",
      instantValue: "QR द्वारा साझा करें",
      directoryHeading: "सत्यापित निर्देशिका",
      directorySubtitle: "मूल गाँव, शहर अथवा व्यवसाय के आधार पर खोजें।",
    },
    form: {
      heading: "समाज बायोडाटा पंजीकरण प्रपत्र",
      subheading: "कृपया सत्यापन हेतु प्रामाणिक विवरण भरें। प्रशासनिक अनुमोदन के उपरांत आपका डिजिटल बायोडाटा व क्यूआर कार्ड प्रकाशित किया जाएगा।",
      badge: "आधिकारिक पंजीकरण फॉर्म",
      backBtn: "निर्देशिका पर वापस लौटें",
      photoTitle: "पासपोर्ट आकार का फोटो",
      photoGuidance: "कृपया स्पष्ट एवं हालिया फोटो अपलोड करें (JPG, PNG, अधिकतम 5MB)।",
      uploadBtn: "फोटो अपलोड करें",
      changeBtn: "फोटो बदलें",
      selectPhoto: "फोटो चुनें",

      personalTitle: "1. व्यक्तिगत एवं जन्म विवरण",
      fullName: "पूरा नाम (Full Name)",
      dob: "जन्म तिथि (D.O.B.)",
      tob: "जन्म समय (Time of Birth)",
      pob: "जन्म स्थान (Place of Birth)",
      height: "ऊंचाई (Height)",
      age: "आयु (Age in Years)",
      gotra: "गोत्र (Gotra)",

      locationTitle: "2. मूल निवास एवं पता",
      gaon: "मूल गाँव (Native Village / Mool Niwas)",
      area: "वर्तमान नगर / क्षेत्र (Current City)",
      domicile: "स्थायी निवास (Domicile State/City)",
      residentAddress: "वर्तमान निवास का पूरा पता (Address)",

      eduCareerTitle: "3. शिक्षा एवं आजीविका",
      education: "शैक्षणिक स्तर (Highest Education)",
      occupation: "व्यवसाय / पद (Occupation / Company)",

      familyTitle: "4. पारिवारिक विवरण एवं कुल",
      fatherName: "पिता का नाम (Father's Name)",
      fatherOccupation: "पिता का व्यवसाय (Father's Occupation)",
      motherName: "माता का नाम (Mother's Name)",
      motherOccupation: "माता का व्यवसाय (Mother's Occupation)",
      siblings: "भाई-बहन (Siblings)",
      grandFather: "दादाजी का नाम (Grandfather)",
      grandMother: "दादीजी का नाम (Grandmother)",

      contactTitle: "5. संपर्क सूत्र",
      primaryPhone: "प्राथमिक मोबाइल नंबर (10-Digit Phone)",
      fatherContact: "पिताजी का संपर्क नंबर (Father Contact)",
      motherContact: "माताजी का संपर्क नंबर (Mother Contact)",

      submitBtn: "सत्यापन हेतु बायोडाटा जमा करें",
      submitting: "अपलोड एवं प्रक्रिया जारी है...",
      disclaimer: "आपकी जानकारी सुरक्षित है। प्रशासनिक समीक्षा एवं सत्यापन के बाद ही निर्देशिका में प्रदर्शित होगी।",
    },
    profile: {
      backBtn: "निर्देशिका पर वापस लौटें",
      verifiedBadge: "प्रमाणित समाज अभिलेख",
      ageLabel: "आयु",
      birthDetails: "जन्म एवं ज्योतिषीय विवरण",
      pob: "जन्म स्थान",
      tob: "जन्म समय",
      height: "ऊंचाई",
      gotra: "गोत्र",
      originTitle: "मूल निवास एवं वर्तमान पता",
      gaon: "मूल गाँव",
      area: "वर्तमान क्षेत्र",
      domicile: "स्थायी निवास",
      address: "निवास का पता",
      eduTitle: "शिक्षा एवं व्यवसाय",
      education: "शिक्षा",
      occupation: "व्यवसाय / पद",
      familyTitle: "पारिवारिक विवरण एवं वंश",
      father: "पिता",
      mother: "माता",
      siblings: "भाई-बहन",
      grandFather: "दादाजी",
      grandMother: "दादीजी",
      contactTitle: "संपर्क सूत्र",
      primaryPhone: "मुख्य मोबाइल",
      fatherPhone: "पिताजी का संपर्क",
      motherPhone: "माताजी का संपर्क",
      callNow: "कॉल करें",
      qrTitle: "डिजिटल क्यूआर कोड",
      qrSubtitle: "स्मार्टफोन कैमरा या व्हाट्सएप से स्कैन कर डिजिटल बायोडाटा तुरंत खोलें।",
      shareWhatsApp: "व्हाट्सएप पर साझा करें",
      downloadQr: "QR कोड डाउनलोड करें (PNG)",
      copyLink: "प्रोफाइल लिंक कॉपी करें",
      printBiodata: "बायोडाटा प्रिंट करें",
    },
  },
};
