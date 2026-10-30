import facultyCloudinaryMap from '../data/facultyCloudinaryMap.json';

// Explicit high-priority overrides for specific faculty members
const explicitFacultyOverrides = {
  // Dr. Sakthi Raadha. S (Science & Humanities) -> NEVER match MCA Mrs. Sakthi S!
  'drsakthiraadhas': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338393/apec/Faculty/1793338392270_sh_sakthi_radha_jpg.jpg',
  'sakthiraadha': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338393/apec/Faculty/1793338392270_sh_sakthi_radha_jpg.jpg',
  'drsakthiradhas': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338393/apec/Faculty/1793338392270_sh_sakthi_radha_jpg.jpg',
  'sakthiradha': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338393/apec/Faculty/1793338392270_sh_sakthi_radha_jpg.jpg',
  'shakthiradha': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338393/apec/Faculty/1793338392270_sh_sakthi_radha_jpg.jpg',
  'shakthiraadha': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338393/apec/Faculty/1793338392270_sh_sakthi_radha_jpg.jpg',

  // Mrs. Sakthi S (MCA)
  'mrssakthis': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338324/apec/Faculty/1793338322997_mca_sakthi_jpg.jpg',
  'sakthis': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338324/apec/Faculty/1793338322997_mca_sakthi_jpg.jpg',

  // Ms. I. Sakthidevi (Civil)
  'msisakthidevi': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338314/apec/Faculty/1793338313532_civil_sakthidevi_jpg.jpg',
  'sakthidevi': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338314/apec/Faculty/1793338313532_civil_sakthidevi_jpg.jpg',

  // Mr. Sakthivel P (IT)
  'mrsakthivelp': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338358/apec/Faculty/1793338357871_it_sakthivel_jpg.jpg',

  // Mr. B. Sakthivel (EEE)
  'mrbsakthivel': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338368/apec/Faculty/1793338367468_eee_sakthivel_jpg.jpg',
  'sakthivelb': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338368/apec/Faculty/1793338367468_eee_sakthivel_jpg.jpg',

  // Dr. V. Vijayasundaram (Science & Humanities / COE)
  'drvvijayasundaram': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793354946/apec/Faculty/1793354942812_sh_vijay_sundram_new.jpg',
  'drvijayasundaram': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793354946/apec/Faculty/1793354942812_sh_vijay_sundram_new.jpg',
  'vijayasundaram': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793354946/apec/Faculty/1793354942812_sh_vijay_sundram_new.jpg',
  'vijaysundram': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793354946/apec/Faculty/1793354942812_sh_vijay_sundram_new.jpg',

  // Mrs. Vijayalakshmi P (Science & Humanities)
  'mrsvijayalakshmip': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338401/apec/Faculty/1793338400250_sh_vijaylakshmi_jpg.jpg',
  'vijayalakshmi': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338401/apec/Faculty/1793338400250_sh_vijaylakshmi_jpg.jpg',
  'vijaylakshmi': 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338401/apec/Faculty/1793338400250_sh_vijaylakshmi_jpg.jpg'
};

// Pre-sorted keys by length descending to prevent shorter words (like 'sakthi') matching before longer names
const sortedCloudKeys = Object.keys(facultyCloudinaryMap).sort((a, b) => b.length - a.length);

/**
 * Normalizes string for fuzzy key lookup (letters & numbers only)
 */
function cleanKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Robustly resolves any faculty image URL.
 * Works seamlessly whether the source is Cloudinary, local storage, or stale localStorage cache.
 */
export function getFacultyImageUrl(image, name = '') {
  const nameClean = cleanKey(name);

  // 1. Check explicit override first
  if (nameClean && explicitFacultyOverrides[nameClean]) {
    return explicitFacultyOverrides[nameClean];
  }
  for (const overrideKey in explicitFacultyOverrides) {
    if (nameClean.includes(overrideKey) || overrideKey.includes(nameClean)) {
      return explicitFacultyOverrides[overrideKey];
    }
  }

  // 2. If it's already a full CDN URL or Base64 data string, verify it's not a known mismatched URL
  if (image && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/'))) {
    // If name is Sakthi Raadha but image URL is mca_sakthi, correct it!
    if (nameClean.includes('radha') && image.includes('mca_sakthi')) {
      return explicitFacultyOverrides['sakthiraadha'];
    }
    return image;
  }

  // 3. Direct lookup by cleaned faculty name
  if (nameClean && facultyCloudinaryMap[nameClean]) {
    return facultyCloudinaryMap[nameClean];
  }

  // 4. Partial substring search on name (sorted by longest key first!)
  if (nameClean && nameClean.length >= 4) {
    for (const key of sortedCloudKeys) {
      if (key.length >= 4 && (nameClean.includes(key) || key.includes(nameClean))) {
        return facultyCloudinaryMap[key];
      }
    }
  }

  // 5. Lookup by filename / local path if provided
  if (image && typeof image === 'string') {
    const filename = image.split('/').pop().replace(/\.[^.]+$/, '');
    const fileClean = cleanKey(filename);
    if (fileClean && explicitFacultyOverrides[fileClean]) {
      return explicitFacultyOverrides[fileClean];
    }
    if (fileClean && facultyCloudinaryMap[fileClean]) {
      return facultyCloudinaryMap[fileClean];
    }
    for (const key of sortedCloudKeys) {
      if (key.length >= 4 && (fileClean.includes(key) || key.includes(fileClean))) {
        return facultyCloudinaryMap[key];
      }
    }
  }

  // 6. Fallback to original image path (e.g. local) or null
  return image || null;
}

/**
 * Error fallback handler for <img onError={handleFacultyImageError(name)} />
 */
export function handleFacultyImageError(e, name = '', originalSrc = '') {
  const cdnUrl = getFacultyImageUrl(null, name);
  if (cdnUrl && e.target.src !== cdnUrl) {
    e.target.src = cdnUrl;
    return;
  }
  e.target.style.display = 'none';
}
