export type Language = "en" | "hi";

export interface TranslationDictionary {
  navbar: {
    title: string;
    subtitle: string;
    directory: string;
    register: string;
    admin: string;
    footerCommunity: string;
    footerCopyright: string;
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
  directory: {
    searchPlaceholder: string;
    allGaon: string;
    allAreas: string;
    sortRecent: string;
    sortAgeAsc: string;
    sortAgeDesc: string;
    verifiedProfilesCount: string;
    clearFilters: string;
    noProfilesTitle: string;
    noProfilesDesc: string;
    resetFilters: string;
    registerNow: string;
    verifiedBadge: string;
    yrs: string;
    work: string;
    edu: string;
    viewBiodata: string;
    pageTitle: string;
    pageSubtitle: string;
  };
  admin: {
    loginTitle: string;
    loginSubtitle: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInBtn: string;
    verifying: string;
    portalBadge: string;
    dashboardTitle: string;
    dashboardSubtitle: string;
    signOut: string;
    pendingTab: string;
    approvedTab: string;
    rejectedTab: string;
    searchRecords: string;
    noSubmissions: string;
    noSubmissionsDesc: string;
    colCandidate: string;
    colVillageArea: string;
    colAgePhone: string;
    colEduWork: string;
    colActions: string;
    inspectBtn: string;
    editBtn: string;
    approveBtn: string;
    rejectBtn: string;
    modalTitle: string;
    modalApprove: string;
    modalReject: string;
    adsTab: string;
    colAddedAt: string;
    saveChanges: string;
    saving: string;
    cancel: string;
    editProfileTitle: string;
    editAdTitle: string;
    createAdBtn: string;
    adActive: string;
    adInactive: string;
    deactivateBtn: string;
    activateBtn: string;
    deleteBtn: string;
    noTargetLink: string;
    viewPoster: string;
    uploadPhoto: string;
    orEnterUrl: string;
    publishAd: string;
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
    photoSpecs: string;

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

    successTitle: string;
    statusLabel: string;
    pendingStatus: string;
    reservedSlugDesc: string;
    submitAnother: string;
  };
  profile: {
    backBtn: string;
    verifiedBadge: string;
    ageLabel: string;
    yearsSuffix: string;
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
    occupationPrefix: string;
    contactTitle: string;
    primaryPhone: string;
    fatherPhone: string;
    motherPhone: string;
    callNow: string;
    qrTitle: string;
    qrSubtitle: string;
    directLink: string;
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
      footerCommunity: "Official Community Verification Hub • All India Samaj Parishad",
      footerCopyright: "© 2026 Samaj Biodata Portal. All verified records are maintained under strict community privacy guidelines.",
    },
    home: {
      badge: "Paliwal Brahmin Community Digital Registry",
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
    directory: {
      searchPlaceholder: "Search by name, occupation, degree...",
      allGaon: "All Native Villages (Gaon)",
      allAreas: "All Cities / Areas",
      sortRecent: "Sort: Recently Registered",
      sortAgeAsc: "Sort: Age (Youngest first)",
      sortAgeDesc: "Sort: Age (Oldest first)",
      verifiedProfilesCount: "Verified Community Profiles",
      clearFilters: "Clear Filters",
      noProfilesTitle: "No Verified Profiles Found",
      noProfilesDesc: "There are no profiles matching the selected village or area filters. Try widening your search or register a new family member.",
      resetFilters: "Reset Filters",
      registerNow: "Register Now",
      verifiedBadge: "VERIFIED",
      yrs: "Yrs",
      work: "Work",
      edu: "Edu",
      viewBiodata: "View Biodata & QR",
      pageTitle: "Community Directory (Prashasanik Suchi)",
      pageSubtitle: "Filter verified biodata by native village (gaon), city area, and age.",
    },
    admin: {
      loginTitle: "Admin Authentication",
      loginSubtitle: "Enter your secure administrative password to access the verification hub.",
      passwordLabel: "Admin Secret Key / Password",
      passwordPlaceholder: "••••••••••••",
      signInBtn: "Sign In to Dashboard",
      verifying: "Verifying...",
      portalBadge: "ADMINISTRATIVE PORTAL",
      dashboardTitle: "Biodata Verification Control Center",
      dashboardSubtitle: "Review submissions, inspect candidate photos & family lineage, and approve profiles to the public directory.",
      signOut: "Sign Out",
      pendingTab: "Pending Review",
      approvedTab: "Approved",
      rejectedTab: "Rejected",
      searchRecords: "Search records by name, village or city...",
      noSubmissions: "No submissions found",
      noSubmissionsDesc: "There are no applications matching this verification status.",
      colCandidate: "Candidate",
      colVillageArea: "Native Village & Area",
      colAgePhone: "Age / Phone",
      colEduWork: "Education / Work",
      colActions: "Actions",
      inspectBtn: "Inspect Details",
      editBtn: "Edit",
      approveBtn: "Approve",
      rejectBtn: "Reject",
      modalTitle: "Application Inspection",
      modalApprove: "Approve Biodata",
      modalReject: "Reject",
      adsTab: "📢 Advertisements",
      colAddedAt: "Added / Timeline",
      saveChanges: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
      editProfileTitle: "Edit Candidate Profile",
      editAdTitle: "Edit Advertisement",
      createAdBtn: "Create New Ad",
      adActive: "ACTIVE",
      adInactive: "INACTIVE",
      deactivateBtn: "Deactivate",
      activateBtn: "Activate",
      deleteBtn: "Delete",
      noTargetLink: "No target link configured",
      viewPoster: "View Poster",
      uploadPhoto: "Upload Photo File",
      orEnterUrl: "Or paste online image URL",
      publishAd: "Publish Advertisement",
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
      photoSpecs: "JPG, PNG • MAX 5MB",

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

      successTitle: "Registration Submitted!",
      statusLabel: "Status",
      pendingStatus: "Pending Admin Verification",
      reservedSlugDesc: "Your unique profile slug is reserved. Once approved, it will be published to the public directory.",
      submitAnother: "Submit Another Form",
    },
    profile: {
      backBtn: "Back to Directory",
      verifiedBadge: "Verified Samaj Record",
      ageLabel: "Age",
      yearsSuffix: "Years",
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
      occupationPrefix: "Occupation",
      contactTitle: "Contact Details",
      primaryPhone: "Primary Phone",
      fatherPhone: "Father's Phone",
      motherPhone: "Mother's Phone",
      callNow: "Call",
      qrTitle: "Digital Biodata QR Code",
      qrSubtitle: "Scan from any smartphone camera or WhatsApp to open this verified card.",
      directLink: "Direct Link",
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
      footerCommunity: "आधिकारिक समुदाय सत्यापन केंद्र • अखिल भारतीय समाज परिषद",
      footerCopyright: "© 2026 समाज बायोडाटा पोर्टल। सभी सत्यापित अभिलेख समुदाय की गोपनीयता नीतियों के तहत सुरक्षित हैं।",
    },
    home: {
      badge: "पालीवाल ब्राह्मण समाज डिजिटल अभिलेख",
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
    directory: {
      searchPlaceholder: "नाम, व्यवसाय, डिग्री द्वारा खोजें...",
      allGaon: "सभी मूल गाँव (Gaon)",
      allAreas: "सभी वर्तमान शहर / क्षेत्र",
      sortRecent: "क्रमबद्ध: हाल ही में पंजीकृत",
      sortAgeAsc: "क्रमबद्ध: आयु (कम से अधिक)",
      sortAgeDesc: "क्रमबद्ध: आयु (अधिक से कम)",
      verifiedProfilesCount: "सत्यापित समुदाय सदस्य",
      clearFilters: "फ़िल्टर हटाएं",
      noProfilesTitle: "कोई सत्यापित प्रोफाइल नहीं मिली",
      noProfilesDesc: "चयनित गाँव अथवा शहर के अनुसार कोई प्रोफाइल उपलब्ध नहीं है। कृपया अपनी खोज का दायरा बढ़ाएं या नया बायोडाटा जोड़ें।",
      resetFilters: "फ़िल्टर रीसेट करें",
      registerNow: "नया बायोडाटा जोड़ें",
      verifiedBadge: "सत्यापित",
      yrs: "वर्ष",
      work: "व्यवसाय",
      edu: "शिक्षा",
      viewBiodata: "बायोडाटा व QR देखें",
      pageTitle: "समुदाय निर्देशिका (प्रशासनिक सूची)",
      pageSubtitle: "मूल गाँव, वर्तमान नगर एवं आयु के अनुसार सत्यापित बायोडाटा देखें।",
    },
    admin: {
      loginTitle: "प्रशासकीय प्रमाणीकरण",
      loginSubtitle: "सत्यापन नियंत्रण कक्ष में प्रवेश हेतु अपना सुरक्षित एडमिन पासवर्ड दर्ज करें।",
      passwordLabel: "एडमिन गोपनीय कुंजी / पासवर्ड",
      passwordPlaceholder: "••••••••••••",
      signInBtn: "डैशबोर्ड में प्रवेश करें",
      verifying: "सत्यापन जारी है...",
      portalBadge: "प्रशासनिक पोर्टल",
      dashboardTitle: "बायोडाटा सत्यापन नियंत्रण कक्ष",
      dashboardSubtitle: "प्राप्त बायोडाटा की समीक्षा करें, फोटो व मूल वंश का सत्यापन करें तथा निर्देशिका में प्रकाशित करें।",
      signOut: "लॉग आउट",
      pendingTab: "समीक्षाधीन",
      approvedTab: "प्रमाणित",
      rejectedTab: "अस्वीकृत",
      searchRecords: "नाम, गाँव अथवा शहर द्वारा खोजें...",
      noSubmissions: "कोई आवेदन उपलब्ध नहीं है",
      noSubmissionsDesc: "इस श्रेणी में वर्तमान में कोई आवेदन शेष नहीं है।",
      colCandidate: "प्रत्याशी",
      colVillageArea: "मूल गाँव एवं क्षेत्र",
      colAgePhone: "आयु / मोबाइल",
      colEduWork: "शिक्षा / व्यवसाय",
      colActions: "कार्यवाही",
      inspectBtn: "विवरण देखें",
      editBtn: "संपादित करें",
      approveBtn: "स्वीकृत करें",
      rejectBtn: "अस्वीकार करें",
      modalTitle: "बायोडाटा निरीक्षण",
      modalApprove: "बायोडाटा स्वीकृत करें",
      modalReject: "अस्वीकार करें",
      adsTab: "📢 विज्ञापन (Ads)",
      colAddedAt: "जोड़ा गया समय",
      saveChanges: "परिवर्तन सहेजें",
      saving: "सहेजा जा रहा है...",
      cancel: "रद्द करें",
      editProfileTitle: "बायोडाटा प्रोफ़ाइल संपादित करें",
      editAdTitle: "विज्ञापन संपादित करें",
      createAdBtn: "➕ नया विज्ञापन जोड़ें",
      adActive: "सक्रिय",
      adInactive: "निष्क्रिय",
      deactivateBtn: "बंद करें",
      activateBtn: "सक्रिय करें",
      deleteBtn: "हटाएं",
      noTargetLink: "कोई लिंक निर्धारित नहीं",
      viewPoster: "पोस्टर देखें",
      uploadPhoto: "फोटो फ़ाइल अपलोड करें",
      orEnterUrl: "या ऑनलाइन इमेज URL दर्ज करें",
      publishAd: "विज्ञापन प्रकाशित करें",
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
      photoSpecs: "JPG, PNG • अधिकतम 5MB",

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

      successTitle: "पंजीकरण सफलतापूर्वक प्राप्त हुआ!",
      statusLabel: "स्थिति",
      pendingStatus: "प्रशासनिक सत्यापन हेतु लंबित",
      reservedSlugDesc: "आपका विशिष्ट प्रोफाइल कोड आरक्षित कर लिया गया है। प्रशासनिक स्वीकृति के उपरांत यह निर्देशिका में लाइव हो जाएगा।",
      submitAnother: "अन्य बायोडाटा दर्ज करें",
    },
    profile: {
      backBtn: "निर्देशिका पर वापस लौटें",
      verifiedBadge: "प्रमाणित समाज अभिलेख",
      ageLabel: "आयु",
      yearsSuffix: "वर्ष",
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
      occupationPrefix: "व्यवसाय",
      contactTitle: "संपर्क सूत्र",
      primaryPhone: "मुख्य मोबाइल",
      fatherPhone: "पिताजी का संपर्क",
      motherPhone: "माताजी का संपर्क",
      callNow: "कॉल करें",
      qrTitle: "डिजिटल क्यूआर कोड",
      qrSubtitle: "स्मार्टफोन कैमरा या व्हाट्सएप से स्कैन कर डिजिटल बायोडाटा तुरंत खोलें।",
      directLink: "सीधा लिंक",
      shareWhatsApp: "व्हाट्सएप पर साझा करें",
      downloadQr: "QR कोड डाउनलोड करें (PNG)",
      copyLink: "प्रोफाइल लिंक कॉपी करें",
      printBiodata: "बायोडाटा प्रिंट करें",
    },
  },
};
