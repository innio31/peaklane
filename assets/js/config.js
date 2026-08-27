/* ============================================================
   SITE CONFIG — Peak Lane Model School
   ------------------------------------------------------------
   This is the ONLY file you edit to reuse this template for a
   different school on the acad.com.ng multi-tenant system.
   Everything else (index.html / about.html / admissions.html /
   main.js) reads content from this file + the live CMS API, so
   a new school = a new config.js + a new subdomain.
   ============================================================ */
window.PLMS_CONFIG = {
  // Matches `schools.school_code` in the DB — used by the API to
  // resolve which tenant's content/forms this site talks to.
  schoolCode: "plms",

  // Base URL of the shared public API (see /backend/public in the
  // delivered zip). One API deployment serves every school; each
  // request is scoped by schoolCode above.
  apiBase: "https://acad.com.ng/api/website",

  // Link back to this school's student/staff portal.
  portalUrl: "https://acad.com.ng/plms/",

  school: {
    name: "Peak Lane Model School",
    shortName: "Peak Lane",
    motto: "Epitome of Knowledge",
    founded: "2021",
    address: "Opposite Adeosun Street, Bayo Block, Oju-Ore, Ota, Ogun State",
    phones: ["09046024608", "08038165750", "08059797732"],
    email: "peakmodel21@gmail.com",
    social: {
      facebook: "",
      instagram: "",
      whatsapp: "https://wa.me/2349046024608"
    }
  },

  // ----------------------------------------------------------
  // FALLBACK CONTENT
  // Shown instantly on load and used if the CMS API is not yet
  // reachable. Once the school's admin fills in the Website
  // Editor in the portal, the live API values (same shape)
  // override every field below automatically — nothing here
  // needs to be touched again after go-live.
  // ----------------------------------------------------------
  fallback: {
    stats: [
      { number: "2021", label: "Year Founded" },
      { number: "4", label: "Levels of Learning" },
      { number: "4+", label: "Awards Earned" },
      { number: "100%", label: "Dedicated to Your Child" }
    ],
    features: [
      { title: "Qualitative Education", description: "A curriculum built to give every child a strong, lasting academic foundation.", icon: "cap" },
      { title: "Affordable Education", description: "Excellent schooling within reach of every family in our community.", icon: "coin" },
      { title: "Proper Care", description: "A warm, attentive environment where every child is known and looked after.", icon: "heart" },
      { title: "Discipline & Values", description: "Character and good conduct built alongside academic excellence.", icon: "shield" }
    ],
    programs: [
      { name: "Crèche / Nursery", age: "Ages 6 months – 5 years", description: "Safe, nurturing early care that builds curiosity from the very start." },
      { name: "Primary School", age: "Primary 1 – 6", description: "A rigorous, engaging curriculum that builds strong academic foundations." },
      { name: "Junior Secondary", age: "JSS 1 – 3", description: "Broadening core subjects while developing independent, critical thinkers." },
      { name: "Senior Secondary", age: "SSS 1 – 3", description: "Focused, examination-ready preparation for WAEC, NECO and beyond." }
    ],
    extracurricular: [
      { title: "Football", description: "Structured coaching that builds teamwork, discipline and healthy competition.", icon: "⚽" },
      { title: "Creative Arts", description: "Drawing, craft and design sessions that grow imagination and fine motor skill.", icon: "🎨" },
      { title: "Music & Drama", description: "Vocal, instrumental and stage performance for confident self-expression.", icon: "🎭" },
      { title: "Clubs & Debate", description: "Guided clubs that sharpen public speaking, reasoning and leadership.", icon: "🗣️" }
    ],
    whyChooseUs: [
      "Small class sizes with individual attention for every learner",
      "Qualified, caring teaching staff dedicated to each child's growth",
      "A safe, secure and disciplined learning environment",
      "Strong foundation in literacy, numeracy and moral values",
      "Regular parent–teacher engagement and progress reporting",
      "Affordable, transparent school fees"
    ],
    values: [
      { title: "Excellence", description: "We hold every learner to a high standard, and support them to reach it." },
      { title: "Curiosity", description: "We nurture questions before answers, and wonder before worksheets." },
      { title: "Integrity", description: "We teach honesty and good character as firmly as any subject on the timetable." },
      { title: "Community", description: "School, home and pupil grow together, not apart." },
      { title: "Discipline", description: "Structure and consistency that helps every child thrive." },
      { title: "Care", description: "Every child is known by name, and looked after as one of our own." }
    ],
    milestones: [
      { year: "2021", title: "Peak Lane Model School founded", description: "Opened our doors at Oju-Ore, Ota with a small pioneer set of pupils." },
      { year: "2022", title: "Expansion of classrooms", description: "Grew our facilities to accommodate a fast-rising pupil population." },
      { year: "2023", title: "First set of academic awards", description: "Recognised for outstanding performance in inter-school competitions." },
      { year: "2024", title: "Extracurricular programmes launched", description: "Introduced football and creative arts as part of regular school life." },
      { year: "2025", title: "Growing school community", description: "Continued growth in enrolment, staff and community trust." }
    ],
    leadership: [
      { name: "Recovery Adekunle", role: "School Administrator", bio: "Provides overall leadership and direction for Peak Lane Model School." },
      { name: "Tokede Boluwatife", role: "Head Teacher", bio: "Oversees the day-to-day academic life and welfare of every pupil." },
      { name: "Oyesiji Badirat", role: "Academic Coordinator", bio: "Coordinates curriculum delivery and teacher performance across levels." },
      { name: "Oludegun Ayomide", role: "Administrative Officer", bio: "Manages school administration, records and parent relations." }
    ],
    awards: [
      "Outstanding Academic Performance Award",
      "Best Emerging School Award",
      "Excellence in Extracurricular Activities",
      "Community Impact Recognition"
    ],
    gallery: [],
    news: []
  },

  applyingLevels: [
    "Crèche / Nursery",
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3"
  ]
};
