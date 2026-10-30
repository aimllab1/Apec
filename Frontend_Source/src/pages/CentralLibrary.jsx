import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Building2, 
  Bookmark, 
  Globe2, 
  FileText, 
  CheckCircle2, 
  Tv, 
  Headphones, 
  Monitor, 
  Barcode, 
  Scissors, 
  Award, 
  X,
  Users,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Info,
  Images
} from 'lucide-react';

export default function CentralLibrary() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFacilityIndex, setActiveFacilityIndex] = useState(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  // New Central Library Block Slideshow State & Images
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mainLibrarySlides = [
    {
      src: "/Images/Gallery/library/main_library.jpeg",
      title: "New Central Library Block",
      subtitle: "4,000 sq.m Two-Storied Academic Facility",
      tag: "Academic Landmark • Estd. 1984"
    },
    {
      src: "/Images/Gallery/library/main_library_view.jpg",
      title: "Campus Library Complex",
      subtitle: "Two-Tier Architecture & Landscaped Environs",
      tag: "Architectural Overview"
    },
    {
      src: "/Images/Gallery/library/main_library_entrance.jpg",
      title: "Grand Entrance Foyer",
      subtitle: "Central Access to Stack Wings & Academic Units",
      tag: "Main Library Entrance"
    },
    {
      src: "/Images/Gallery/library/main_library_reading_area.jpg",
      title: "Main Reading & Study Hall",
      subtitle: "324 sq.m Quiet Study Space for 108 Simultaneous Readers",
      tag: "Ground Floor Study Wing"
    },
    {
      src: "/Images/Gallery/library/main_library_area.jpg",
      title: "Classified Stack Section",
      subtitle: "56,600+ Volumes Arranged under UDC & AACR-II",
      tag: "Curriculum & Reference Aisles"
    }
  ];

  // Auto-play slideshow for New Central Library Block
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainLibrarySlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, mainLibrarySlides.length]);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + mainLibrarySlides.length) % mainLibrarySlides.length);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % mainLibrarySlides.length);
  };

  // Core Statistics
  const stats = [
    { label: "Total Volumes", value: "56,615", subtext: "Classified engineering & science collection", icon: BookOpen },
    { label: "Book Titles", value: "22,613", subtext: "Curriculum and reference titles", icon: Bookmark },
    { label: "Periodicals", value: "245", subtext: "National & international technical serials", icon: FileText },
    { label: "Back Volumes", value: "4,800", subtext: "Bound research journals archive", icon: Layers },
    { label: "Building Area", value: "4,000 sq.m", subtext: "Spacious independent two-storied block", icon: Building2 },
  ];

  // Online Journal Subscriptions (10 Packages)
  const subscriptions = [
    { name: "Science Direct", count: 275, provider: "Elsevier" },
    { name: "IEEE ASPP", count: 152, provider: "IEEE" },
    { name: "ASCE", count: 34, provider: "Civil Engineering" },
    { name: "ASME", count: 26, provider: "Mechanical Engineering" },
    { name: "ASTMDL", count: 2369, provider: "Digital Library Standards" },
    { name: "EBSCO", count: 1098, provider: "Engineering & Applied Sciences" },
    { name: "J-Gate (JET)", count: 2005, provider: "Engineering & Technology" },
    { name: "J-Gate (JSMS)", count: 2628, provider: "Social & Management Sciences" },
    { name: "Springer (EE & CSE)", count: 149, provider: "Electrical & Computing" },
    { name: "McGraw-Hill", count: 363, provider: "Technical Reference" }
  ];

  // Institutional Memberships & Consortiums
  const memberships = [
    { title: "DELNET (Developing Library Network), Delhi", role: "National Inter-Library Resource Sharing" },
    { title: "British Council Library (BCL), Chennai", role: "International Literature & Research Lending" },
    { title: "Institution of Engineers (IEI), Kolkata", role: "Technical Society Library Affiliation" },
    { title: "IEEE, USA", role: "Global Professional Technical Consortium" },
    { title: "INDEST-AICTE Consortium — IEL Online Journals", role: "AICTE Sponsored Research Electronic Resources" },
    { title: "INDEST-AICTE Consortium — ScienceDirect Online Journals", role: "AICTE Sponsored Elsevier Portal" },
    { title: "INDEST-AICTE Consortium — SpringerLink Online Journals", role: "AICTE Sponsored Springer Repository" }
  ];

  // Consolidated & Deduplicated Library Facilities Dataset
  const libraryFacilities = [
    {
      id: "reading-hall",
      title: "Main Reading Hall",
      category: "ground-floor",
      categoryLabel: "Ground Floor Facility",
      floor: "Ground Floor",
      tagline: "324 sq.m Quiet Study Space for 108 Simultaneous Readers",
      images: [
        { src: "/Images/Gallery/library/main_library_reading_area.jpg", caption: "Main Study Hall Interior" }
      ],
      overview: "Engineered for quiet concentration and deep study, the reading hall offers well-spaced ergonomic study desks with comfortable seating for students and faculty.",
      metrics: [
        { label: "Floor Area", value: "324 sq.m" },
        { label: "Seating Capacity", value: "108 Seats" },
        { label: "Daily Student Usage", value: "250+ Minimum" },
        { label: "Location", value: "Ground Floor" }
      ],
      highlights: [
        "Direct access to both Stack Sections for immediate on-demand reference.",
        "Averages a daily student footfall exceeding 250 learners.",
        "Natural daylighting complemented by quiet, well-ventilated study rows."
      ]
    },
    {
      id: "stack-sections",
      title: "Classified Stack Sections (I & II)",
      category: "ground-floor",
      categoryLabel: "Ground Floor Facility",
      floor: "Ground Floor",
      tagline: "Systematic Collections for Circuit & Non-Circuit Disciplines",
      images: [
        { src: "/Images/Gallery/library/main_library_area.jpg", caption: "Stack Aisles & Book Racks" }
      ],
      overview: "Two distinct 324 sq.m stack rooms housing standard textbooks, reference works, and syllabus compendiums catalogued under Universal Decimal Classification (UDC) and AACR-II rules.",
      metrics: [
        { label: "Stack I (Circuit)", value: "324 m² • 15 Racks" },
        { label: "Stack II (Non-Circuit)", value: "324 m² • 15 Racks" },
        { label: "Reading Tables", value: "10 per Section" },
        { label: "Chairs", value: "40 per Section" }
      ],
      highlights: [
        "Stack I: Circuit branches including CSE, ECE, EEE, MCA, and IT.",
        "Stack II: Non-circuit disciplines including MBA, Civil, Mech, Chemical, and Basic Sciences.",
        "Book Purchase Procedure: Syllabus-based selections from HOD recommendations and national publisher exhibitions."
      ]
    },
    {
      id: "circulation-counters",
      title: "Circulation Desks (Issue & Return)",
      category: "ground-floor",
      categoryLabel: "Ground Floor Facility",
      floor: "Ground Floor",
      tagline: "Automated Check-out, Renewal & Return Processing",
      images: [], // Image removed from this window as requested
      overview: "Fast, automated circulation desks managing all member accounts, book loans, returns, and renewals through optical barcode scanning.",
      metrics: [
        { label: "Daily Issues", value: "280+ Books" },
        { label: "Daily Returns", value: "154+ Books" },
        { label: "Daily Renewals", value: "126 Books" },
        { label: "Scanning Hardware", value: "LS 300 kbi/f" }
      ],
      highlights: [
        "Issue Counter: Minimum 280 books issued daily using AUTO LIB integrated software.",
        "Return Counter: Minimum 154 books returned and 126 renewed daily.",
        "All documents are barcoded for computerized circulation tracking."
      ]
    },
    {
      id: "book-bank",
      title: "Student Book Bank Section",
      category: "ground-floor",
      categoryLabel: "Ground Floor Facility",
      floor: "Ground Floor",
      tagline: "3,720 Books & 750 Titles Dedicated for SC/ST Students",
      images: [
        { src: "/Images/Gallery/library/book_bank_students.jpg", caption: "Students Using Books in Library — Book Bank" },
        { src: "/Images/Gallery/library/book_bank_students_reading.jpg", caption: "Students Reading & Study Area" }
      ],
      overview: "A welfare facility providing semester-long textbook lending privileges for eligible SC/ST students, with more than 140 learners drawing and returning volumes each day.",
      metrics: [
        { label: "Total Books", value: "3,720 Books" },
        { label: "Total Titles", value: "750 Titles" },
        { label: "Eligible Users", value: "SC/ST Students" },
        { label: "Daily Circulation", value: "140+ Users" }
      ],
      highlights: [
        "Enables students to borrow prescribed textbooks for the full duration of each semester.",
        "Maintains multiple copies of syllabus-oriented engineering and science textbooks.",
        "Over 140 students actively utilize this welfare facility every working day."
      ]
    },
    {
      id: "binding-section",
      title: "Binding & Conservation Section",
      category: "ground-floor",
      categoryLabel: "Ground Floor Facility",
      floor: "Ground Floor",
      tagline: "In-House Bindery Preserving 1,000+ Volumes Annually",
      images: [],
      overview: "On-site preservation workshop maintaining damaged textbook spines and hard-binding previous years' periodicals and magazines into archival research volumes.",
      metrics: [
        { label: "Annual Output", value: "1,000+ Books" },
        { label: "Equipment", value: "4 Units" },
        { label: "Materials", value: "Journals & Books" },
        { label: "Preservation", value: "Hardbound Archives" }
      ],
      highlights: [
        "Equipped with cutting machine, paper cutter, spiral punching machine, and bill book punching unit.",
        "Binds a minimum of 1,000 books and journal issues annually.",
        "Safeguards rare publications and loose serials for long-term reference."
      ]
    },
    {
      id: "ref-periodicals",
      title: "Reference Section (Periodicals & Books)",
      category: "first-floor",
      categoryLabel: "First Floor Facility",
      floor: "First Floor",
      tagline: "548 sq.m Research Hub • 245 Journals & 4,981 Reference Volumes",
      images: [
        { src: "/Images/Gallery/library/reference_section.png", caption: "Reference Section & Periodicals Reading Hall" },
        { src: "/Images/Gallery/library/periodicals_magazine_section.jpg", caption: "Periodicals & Bound Journals Archive" }
      ],
      overview: "Comprehensive first-floor research wing integrating the Periodicals Section (178 sq.m, 65 seats, 245 current journals, 4,220 bound back volumes) and the Specialized Reference Section (370 sq.m, 4,981 non-circulating volumes, engineering treatises, handbooks, and design codes) for faculty and research scholars.",
      metrics: [
        { label: "Total Area", value: "548 sq.m (178 + 370)" },
        { label: "Reference Volumes", value: "4,981 Books" },
        { label: "Active Periodicals", value: "245 Titles" },
        { label: "Bound Volumes", value: "4,220 Volumes" }
      ],
      highlights: [
        "Combines the 178 sq.m Periodicals Gallery and 370 sq.m Reference Books Consultation Wing.",
        "Subscribes to 62 National Periodicals and 104 International Periodicals alongside 4,220 bound serial archives.",
        "Houses 4,981 authoritative reference treatises, standard encyclopedias, and engineering design handbooks.",
        "Quiet ergonomic consultation seating specifically configured for postgraduate students, faculty, and research projects."
      ]
    },
    {
      id: "audio-visual",
      title: "Audio-Visual Library",
      category: "first-floor",
      categoryLabel: "First Floor Facility",
      floor: "First Floor",
      tagline: "154 sq.m Air-Conditioned Multimedia Theater with 120 Seats",
      images: [
        { src: "/Images/Gallery/library/audio_visual_library.png", caption: "Audio-Visual Library & Multimedia Screen" }
      ],
      overview: "Multimedia hall equipped with digital projection systems broadcasting educational telecasts and digitized courses from premier academic institutions.",
      metrics: [
        { label: "Floor Area", value: "154 sq.m" },
        { label: "Available Seats", value: "120 Seats" },
        { label: "Broadcasts", value: "EDUSAT & Gyan Darshan" },
        { label: "Courseware", value: "IIT & NPTEL" }
      ],
      highlights: [
        "Anna University EDUSAT interactive telecasts and IIT curriculum transmissions.",
        "Gyan Darshan educational channels of Doordarshan Kendra.",
        "Extensive collection of IIT web and video courses for engineering disciplines."
      ]
    },
    {
      id: "conference-hall",
      title: "Central Conference Hall",
      category: "first-floor",
      categoryLabel: "First Floor Facility",
      floor: "First Floor",
      tagline: "231 sq.m Acoustically Engineered Hall with 76 Seats",
      images: [
        { src: "/Images/Gallery/library/conference_hall.png", caption: "Central Conference Hall & Auditorium" }
      ],
      overview: "Acoustically treated seminar auditorium within the Central Library, designed for scholarly discussions, symposiums, and NPTEL orientations.",
      metrics: [
        { label: "Floor Area", value: "231 sq.m" },
        { label: "Available Seats", value: "76 Seats" },
        { label: "Acoustics", value: "Sound Treated" },
        { label: "Usage", value: "Seminars & NPTEL" }
      ],
      highlights: [
        "NPTEL orientation programmes, faculty seminars, and academic workshops.",
        "Modern digital presentation dais and public address acoustics.",
        "Directly adjoins the assistant librarian administration room."
      ]
    },
    {
      id: "language-lab",
      title: "Communication Lab / Language Lab",
      category: "first-floor",
      categoryLabel: "First Floor Facility",
      floor: "First Floor",
      tagline: "154 sq.m Interactive Lab with 680 Communication CDs",
      images: [],
      overview: "Interactive multimedia lab designed to develop students' spoken English, phonetic accuracy, verbal fluency, and ICT communication skills.",
      metrics: [
        { label: "Floor Area", value: "154 sq.m" },
        { label: "Communication CDs", value: "680 Discs" },
        { label: "Software", value: "Globarana & English Lab" },
        { label: "Objective", value: "Fluency & Career Skills" }
      ],
      highlights: [
        "Software includes Globarana Software, English Lab Software, and career-oriented learning modules.",
        "Contains 680 communication CDs and audio exercises for phonetic practice.",
        "Prepares students for corporate interviews and competitive examinations."
      ]
    },
    {
      id: "digital-library",
      title: "Digital Library",
      category: "first-floor",
      categoryLabel: "First Floor Facility",
      floor: "First Floor",
      tagline: "289 sq.m Computing Center with 60 Systems & 5,000 E-Resources",
      images: [
        { src: "/Images/Gallery/library/digital_library.png", caption: "Digital Library Computer Workstations" }
      ],
      overview: "High-speed networked computer lab providing campus-wide access to online international journals, digital databases, e-books, and multimedia archives.",
      metrics: [
        { label: "Floor Area", value: "289 sq.m" },
        { label: "Available Seats", value: "60 Systems" },
        { label: "E-Resources", value: "5,000+ Titles" },
        { label: "Network", value: "High-Speed Campus LAN" }
      ],
      highlights: [
        "60 high-performance computer terminals connected to campus high-speed fiber internet.",
        "Access to 5,000 e-books and digital resources on CDs and DVDs.",
        "Campus-wide online access to Science Direct, IEEE ASPP, ASCE, ASME, ASTMDL, EBSCO, and J-Gate."
      ]
    }
  ];

  // Category filter tabs
  const categoryFilters = [
    { id: 'all', label: 'All Facilities' },
    { id: 'ground-floor', label: 'Ground Floor Facilities' },
    { id: 'first-floor', label: 'First Floor Facilities' }
  ];

  const filteredFacilities = activeCategory === 'all' 
    ? libraryFacilities 
    : libraryFacilities.filter(f => f.category === activeCategory);

  // Modal navigation
  const openFacilityModal = (index) => {
    setActiveFacilityIndex(index);
    setActiveModalImageIndex(0);
  };

  const closeFacilityModal = () => {
    setActiveFacilityIndex(null);
    setActiveModalImageIndex(0);
  };

  const nextFacility = () => {
    if (activeFacilityIndex !== null) {
      setActiveFacilityIndex((activeFacilityIndex + 1) % libraryFacilities.length);
      setActiveModalImageIndex(0);
    }
  };

  const prevFacility = () => {
    if (activeFacilityIndex !== null) {
      setActiveFacilityIndex((activeFacilityIndex - 1 + libraryFacilities.length) % libraryFacilities.length);
      setActiveModalImageIndex(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeFacilityIndex === null) return;
      if (e.key === 'Escape') closeFacilityModal();
      if (e.key === 'ArrowRight') nextFacility();
      if (e.key === 'ArrowLeft') prevFacility();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFacilityIndex]);

  const currentFacility = activeFacilityIndex !== null ? libraryFacilities[activeFacilityIndex] : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B1528] font-sans antialiased selection:bg-red-700 selection:text-white">

      {/* =========================================================================
          HERO & INTRODUCTION
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-2">
                  Adhiparasakthi Engineering College
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#07113A] tracking-tight leading-tight">
                  Central Library
                </h1>
              </div>

              <div className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed space-y-4 font-normal text-justify">
                <p>
                  The College Library was started in the year <strong>1984</strong> and initially functioned in the Main Building of the college (Main Block). It has since been shifted to a spacious <strong>New Central Library Block</strong> with an area of <strong>4,000 sq.m</strong>. It is a two-storied building.
                </p>
                <p>
                  The <strong>first floor</strong> contains a Conference Hall, Audio-Visual Section, Reference Section, Language Lab, and Digital Library. The <strong>ground floor</strong> contains Stack Sections, Circulation Section, Informal Reading Section, Book Bank Section, and Binding Section.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a 
                  href="#photo-showcase" 
                  className="px-5 py-3 rounded-xl bg-red-700 text-white hover:bg-red-800 text-base font-semibold transition shadow-sm flex items-center gap-2"
                >
                  <span>Explore Facilities & Photos</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#statistics" 
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-base font-semibold text-[#07113A] transition"
                >
                  Library Statistics
                </a>
              </div>
            </div>

            {/* Introduction Visual: Interactive Slideshow */}
            <div className="lg:col-span-5">
              <div 
                className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 aspect-4/3 group select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Slides Layer */}
                {mainLibrarySlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === currentSlide ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                    }`}
                  >
                    <img 
                      src={slide.src} 
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/Images/Gallery/library/main_library.jpeg";
                      }}
                    />
                  </div>
                ))}

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#07113A]/95 via-[#07113A]/35 to-transparent pointer-events-none" />

                {/* Top Badge: Slide Counter */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold border border-white/15">
                  <Images className="w-3.5 h-3.5 text-red-400" />
                  <span>{currentSlide + 1} / {mainLibrarySlides.length}</span>
                </div>

                {/* Navigation Chevrons */}
                <button
                  onClick={handlePrevSlide}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Content Info & Pagination Dots */}
                <div className="absolute inset-x-0 bottom-0 z-30 p-5 flex flex-col justify-end">
                  <div className="text-white mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-300 block mb-1">
                      {mainLibrarySlides[currentSlide].tag}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                      {mainLibrarySlides[currentSlide].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-0.5 line-clamp-1">
                      {mainLibrarySlides[currentSlide].subtitle}
                    </p>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex items-center gap-2">
                    {mainLibrarySlides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(dotIdx);
                        }}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          dotIdx === currentSlide
                            ? "w-7 bg-red-500"
                            : "w-2 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PHOTO GALLERY & OVERFLOW WINDOW EXPLORER (FIRST VIEW AFTER INTRO)
          ========================================================================= */}
      <section id="photo-showcase" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
                Visual Campus Facilities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
                Photo Gallery & Facility Directory
              </h2>
              <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
                Click any facility card below to open its dedicated overflow details window.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 text-red-700" />
              <span>Select any card to open overflow window</span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200/80 pb-4">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Clean Responsive Facility Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFacilities.map((facility) => {
              const originalIndex = libraryFacilities.findIndex(f => f.id === facility.id);
              const previewImage = facility.images[0]?.src || "/Images/Gallery/library/main_library_reading_area.jpg";
              const isMultiImage = facility.images.length > 1;

              return (
                <div 
                  key={facility.id}
                  onClick={() => openFacilityModal(originalIndex)}
                  className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                  title={`Open ${facility.title} in overflow window`}
                >
                  {facility.images && facility.images.length > 0 ? (
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={previewImage} 
                        alt={facility.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/Images/Gallery/library/main_library_reading_area.jpg";
                        }}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-[#07113A]/90 text-white text-xs font-bold">
                          {facility.floor}
                        </span>
                        {isMultiImage && (
                          <span className="px-2 py-1 rounded-md bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                            <Images className="w-3 h-3" />
                            <span>{facility.images.length} Views</span>
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="px-4 py-2 rounded-xl bg-white text-[#07113A] font-bold text-sm shadow-lg flex items-center gap-1.5">
                          <Maximize2 className="w-4 h-4 text-red-700" />
                          <span>Open Window</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-4/3 w-full bg-gradient-to-br from-[#07113A] to-[#162758] flex flex-col items-center justify-center p-6 text-white text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-2.5">
                        <Barcode className="w-6 h-6 text-red-300" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-white">Circulation Services</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Automated Issue & Return Desks</p>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-xs font-bold">
                          {facility.floor}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="px-4 py-2 rounded-xl bg-white text-[#07113A] font-bold text-sm shadow-lg flex items-center gap-1.5">
                          <Maximize2 className="w-4 h-4 text-red-700" />
                          <span>Open Window</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 border-t border-slate-100">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#07113A] truncate">
                      {facility.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 mt-1 font-normal">
                      {facility.tagline}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LIBRARY STATISTICS
          ========================================================================= */}
      <section id="statistics" className="py-14 sm:py-18 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
              Resource Inventory
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
              Library Statistics
            </h2>
            <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
              Official metrics representing the library's physical, academic, and archival resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#FAF8F5] border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#07113A] tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-slate-600 mt-1 font-normal">
                      {item.subtext}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ONLINE JOURNAL SUBSCRIPTIONS
          ========================================================================= */}
      <section id="subscriptions" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
              Digital Repositories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
              Online Journal Subscriptions
            </h2>
            <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
              Campus-wide institutional access to world-renowned technical journals, databases, and scientific research publications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {subscriptions.map((sub, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-red-200 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <Globe2 className="w-5 h-5 text-red-700 mb-3" />
                  <h3 className="text-base sm:text-lg font-bold text-[#07113A] leading-snug">
                    {sub.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1 font-medium">
                    {sub.provider}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-700">
                    {sub.count.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">titles</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CLASSIFICATION AND AUTOMATION
          ========================================================================= */}
      <section id="automation" className="py-14 sm:py-18 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
              Technical Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
              Library Classification and Automation
            </h2>
            <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
              Automated institutional workflows driven by internationally recognized cataloguing rules and barcode hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#07113A] mb-2">
                Universal Decimal Classification (UDC)
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                All books and monographs are arranged and retrieved according to the Universal Decimal Classification scheme.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#07113A] mb-2">
                Anglo-American Cataloguing Rules (AACR-II)
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                Standardized bibliographic entries, records, and book indexes strictly follow the AACR-II framework.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#07113A] mb-2">
                AUTOLIB Software Integration
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                Library operations, accessioning, and database management are fully integrated through AUTO LIB software.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#07113A] mb-2">
                Computerized Circulation
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                User checkout, return, and renewal procedures are electronically administered at circulation desks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                <Barcode className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#07113A] mb-2">
                Barcoded Documents
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                Every document in the library possesses a unique barcode identifier enabling real-time inventory management.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-700 flex items-center justify-center mb-4">
                <Barcode className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#07113A] mb-2">
                LS 300 kbi/f Barcode Scanners
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                Equipped with high-accuracy LS 300 kbi/f laser barcode scanners for rapid book check-outs and check-ins.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INSTITUTIONAL MEMBERSHIP & NETWORKS
          ========================================================================= */}
      <section id="memberships" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
              Academic Alliances
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
              Institutional Membership & Networks
            </h2>
            <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
              Active affiliations facilitating inter-library loan privileges, digital consortiums, and national resource sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {memberships.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 hover:border-slate-300 transition shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#07113A] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: GROUND FLOOR & FIRST FLOOR FACILITIES OVERVIEW
          ========================================================================= */}
      <section id="facilities" className="py-14 sm:py-18 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Ground Floor Facilities */}
          <div>
            <div className="max-w-3xl mb-8">
              <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
                Level 0
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
                Ground Floor Facilities
              </h2>
              <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
                Click any section card to open its full specifications in the overflow window.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "stack-sections", title: "Stack Section I & II", desc: "Circuit (CSE, ECE, EEE, MCA, IT) & Non-Circuit (MBA, Civil, Mech, Chem, Sciences). 648 sq.m, 30 racks, 80 chairs." },
                { id: "reading-hall", title: "Main Reading Hall", desc: "324 sq.m quiet learning hall accommodating 108 simultaneous readers, with daily footfall exceeding 250 students." },
                { id: "book-bank", title: "Book Bank & Binding", desc: "3,720 books & 750 titles for SC/ST students (140+ daily users). On-site bindery processing 1,000+ volumes annually." }
              ].map((card, i) => {
                const targetIdx = libraryFacilities.findIndex(f => f.id === card.id);
                return (
                  <div 
                    key={i}
                    onClick={() => openFacilityModal(targetIdx >= 0 ? targetIdx : 0)}
                    className="bg-[#FAF8F5] border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-red-200 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-700">Ground Floor</span>
                        <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-red-700 transition" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#07113A] mb-2 group-hover:text-red-700 transition">
                        {card.title}
                      </h3>
                      <p className="text-base text-slate-700 leading-relaxed font-normal">
                        {card.desc}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-bold text-red-700 flex items-center gap-1">
                      <span>Click to view details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* First Floor Facilities */}
          <div>
            <div className="max-w-3xl mb-8">
              <span className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wider block mb-1">
                Level 1
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#07113A]">
                First Floor Facilities
              </h2>
              <p className="text-base sm:text-lg text-slate-700 mt-2 font-normal">
                Click any section card to open its full specifications in the overflow window.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "ref-periodicals", title: "Reference Section (Periodicals & Books)", desc: "178 sq.m periodicals gallery (245 journals, 4,220 back volumes) and 370 sq.m books reference (4,981 volumes)." },
                { id: "audio-visual", title: "Audio-Visual Library & Conference Hall", desc: "154 sq.m AV room (120 seats, EDUSAT, NPTEL) and 231 sq.m acoustic Conference Auditorium (76 seats)." },
                { id: "digital-library", title: "Digital Library & Language Lab", desc: "289 sq.m digital center (60 systems, 5,000+ e-resources) and 154 sq.m language lab (Globarana software, 680 CDs)." }
              ].map((card, i) => {
                const targetIdx = libraryFacilities.findIndex(f => f.id === card.id);
                return (
                  <div 
                    key={i}
                    onClick={() => openFacilityModal(targetIdx >= 0 ? targetIdx : 0)}
                    className="bg-[#FAF8F5] border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-red-200 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-700">First Floor</span>
                        <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-red-700 transition" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#07113A] mb-2 group-hover:text-red-700 transition">
                        {card.title}
                      </h3>
                      <p className="text-base text-slate-700 leading-relaxed font-normal">
                        {card.desc}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-bold text-red-700 flex items-center gap-1">
                      <span>Click to view details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE OVERFLOW DETAIL WINDOW (MODAL WINDOW WITH DEDUPLICATED SPECS)
          ========================================================================= */}
      {currentFacility && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={closeFacilityModal}
        >
          <div 
            className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Overflow Window Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FAF8F5] shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                  {currentFacility.categoryLabel}
                </span>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  Facility {activeFacilityIndex + 1} of {libraryFacilities.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={prevFacility}
                  className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-[#07113A] transition cursor-pointer"
                  title="Previous Facility"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextFacility}
                  className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-[#07113A] transition cursor-pointer"
                  title="Next Facility"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={closeFacilityModal}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-700 hover:text-white text-red-700 transition cursor-pointer ml-2"
                  title="Close Window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Overflow Window Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {currentFacility.images && currentFacility.images.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Facility Image Preview (With interactive thumbnail switch if multiple images exist) */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 bg-slate-100 relative">
                      <img 
                        src={currentFacility.images[activeModalImageIndex]?.src || currentFacility.images[0]?.src} 
                        alt={currentFacility.images[activeModalImageIndex]?.caption || currentFacility.title}
                        className="w-full h-full object-cover transition-all duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/Images/Gallery/library/book_bank_students.jpg";
                        }}
                      />
                      <div className="absolute bottom-2.5 left-3 right-3 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-xs font-medium">
                        {currentFacility.images[activeModalImageIndex]?.caption || currentFacility.title}
                      </div>
                    </div>

                    {/* Thumbnail Row if facility has multiple images (e.g. New Central Library Block) */}
                    {currentFacility.images.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {currentFacility.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveModalImageIndex(idx)}
                            className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                              activeModalImageIndex === idx 
                                ? 'border-red-700 ring-2 ring-red-700/20' 
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Key Details & Metrics */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#07113A]">
                        {currentFacility.title}
                      </h3>
                      <p className="text-sm sm:text-base text-red-700 font-semibold mt-1">
                        {currentFacility.tagline}
                      </p>
                    </div>

                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {currentFacility.overview}
                    </p>

                    {/* Quantitative Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {currentFacility.metrics.map((m, mi) => (
                        <div key={mi} className="p-3 rounded-xl bg-[#FAF8F5] border border-slate-200">
                          <div className="text-xs text-slate-500 font-semibold uppercase">{m.label}</div>
                          <div className="text-base font-extrabold text-[#07113A] mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Full-width clean layout when facility has no image (e.g. Circulation Desks) */
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#07113A] to-[#162758] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
                        <Barcode className="w-3.5 h-3.5" />
                        <span>Circulation Services</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        {currentFacility.title}
                      </h3>
                      <p className="text-sm text-slate-200 mt-1">
                        {currentFacility.tagline}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white/10 text-center shrink-0">
                        <div className="text-xl font-black text-white">280+</div>
                        <div className="text-[11px] text-slate-300 uppercase">Daily Issues</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/10 text-center shrink-0">
                        <div className="text-xl font-black text-white">154+</div>
                        <div className="text-[11px] text-slate-300 uppercase">Daily Returns</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                    {currentFacility.overview}
                  </p>

                  {/* Quantitative Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {currentFacility.metrics.map((m, mi) => (
                      <div key={mi} className="p-4 rounded-xl bg-[#FAF8F5] border border-slate-200">
                        <div className="text-xs text-slate-500 font-semibold uppercase">{m.label}</div>
                        <div className="text-xl font-extrabold text-[#07113A] mt-1">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grouped Facility Specifications List */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-serif text-lg font-bold text-[#07113A] mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-red-700" />
                  <span>Facility Highlights & Operations</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentFacility.highlights.map((h, hi) => (
                    <div key={hi} className="p-4 rounded-xl bg-[#FAF8F5] border border-slate-200 text-sm text-slate-700 leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Overflow Window Bottom Action Bar */}
            <div className="px-6 py-4 bg-[#FAF8F5] border-t border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-600 shrink-0">
              <span>Use arrow keys or buttons to navigate across facilities</span>
              <button
                onClick={closeFacilityModal}
                className="px-4 py-2 rounded-xl bg-[#07113A] text-white font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}