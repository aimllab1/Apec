/**
 * Central Inquiry & Lead Management Service
 * Synchronizes inquiry data between the backend database and client storage.
 * Works seamlessly across Localhost, Local IP network devices (e.g. 192.168.x.x),
 * and deployed production instances.
 */

const STORAGE_KEY = 'apec_inquiries';

/**
 * Submit a new admission inquiry to the database.
 */
export async function submitInquiry(inquiryData) {
  const timestamp = Date.now();
  const formattedInquiry = {
    id: inquiryData.id || `inq_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    name: inquiryData.name || '',
    phone: inquiryData.phone || inquiryData.contactNumber || '',
    cutoff: inquiryData.cutoff || '',
    dept: inquiryData.dept || inquiryData.department || '',
    email: inquiryData.email || '',
    source: inquiryData.source || 'Website Admission Popup',
    status: inquiryData.status || 'New',
    notes: inquiryData.notes || '',
    maths: inquiryData.maths || null,
    physics: inquiryData.physics || null,
    chemistry: inquiryData.chemistry || null,
    schoolName: inquiryData.schoolName || '',
    board: inquiryData.board || '',
    yearOfPassing: inquiryData.yearOfPassing || '',
    date: inquiryData.date || new Date().toLocaleString(),
    createdAt: timestamp
  };

  // 1. Instant local storage cache update for offline resiliency
  try {
    const localList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedLocal = [formattedInquiry, ...localList.filter(item => item.id !== formattedInquiry.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('apec_storage_update'));
    window.dispatchEvent(new Event('apec_inquiries_updated'));
  } catch (err) {
    console.warn('[InquiryService] Local storage write warning:', err);
  }

  // 2. Transmit to backend API / Database
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedInquiry)
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.inquiry || formattedInquiry };
    } else {
      console.warn('[InquiryService] Server response not ok:', res.status);
      return { success: true, fallback: true, data: formattedInquiry };
    }
  } catch (netErr) {
    console.warn('[InquiryService] Network submit fallback to local cache:', netErr.message);
    return { success: true, fallback: true, data: formattedInquiry };
  }
}

/**
 * Fetch all admission inquiries from the central database.
 * Merges with local cache to ensure no leads are lost even if offline.
 */
export async function fetchInquiries() {
  let serverInquiries = [];
  let fetchFailed = false;

  try {
    const res = await fetch('/api/inquiries', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        serverInquiries = data;
      } else if (data && Array.isArray(data.inquiries)) {
        serverInquiries = data.inquiries;
      }
    } else {
      fetchFailed = true;
    }
  } catch (err) {
    fetchFailed = true;
    console.warn('[InquiryService] Failed to reach /api/inquiries, reading local cache:', err.message);
  }

  // Retrieve local cache
  let localInquiries = [];
  try {
    localInquiries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    localInquiries = [];
  }

  if (fetchFailed || serverInquiries.length === 0) {
    return localInquiries;
  }

  // Merge server inquiries with any unique local records
  const map = new Map();
  serverInquiries.forEach(item => {
    if (item && (item.id || item._id)) {
      const key = String(item.id || item._id);
      map.set(key, item);
    }
  });

  localInquiries.forEach(item => {
    if (item && item.id) {
      const key = String(item.id);
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
  });

  const merged = Array.from(map.values()).sort((a, b) => {
    const timeA = a.createdAt || (a.id && !isNaN(a.id) ? Number(a.id) : 0);
    const timeB = b.createdAt || (b.id && !isNaN(b.id) ? Number(b.id) : 0);
    return timeB - timeA;
  });

  // Sync merged back to local storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('apec_storage_update'));
  } catch (e) {}

  return merged;
}

/**
 * Update the status of a candidate inquiry (e.g. 'New', 'Contacted', 'Admitted', 'Cold')
 */
export async function updateInquiryStatus(id, newStatus) {
  // Update local storage
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = local.map(item => item.id === id ? { ...item, status: newStatus } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('apec_storage_update'));
  } catch (e) {}

  // Sync with backend API
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_status',
        id,
        status: newStatus
      })
    });
  } catch (err) {
    console.warn('[InquiryService] Error updating status on server:', err.message);
  }
}

/**
 * Update candidate notes / admission remarks
 */
export async function updateInquiryNotes(id, notes) {
  // Update local storage
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = local.map(item => item.id === id ? { ...item, notes } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('apec_storage_update'));
  } catch (e) {}

  // Sync with backend API
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_notes',
        id,
        notes
      })
    });
  } catch (err) {
    console.warn('[InquiryService] Error updating notes on server:', err.message);
  }
}

/**
 * Delete single inquiry
 */
export async function deleteInquiry(id) {
  // Update local storage
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = local.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('apec_storage_update'));
  } catch (e) {}

  // Sync with backend API
  try {
    await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[InquiryService] Error deleting inquiry on server:', err.message);
  }
}

/**
 * Purge all inquiries
 */
export async function purgeAllInquiries() {
  // Clear local storage
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('apec_storage_update'));
  } catch (e) {}

  // Sync with backend API
  try {
    await fetch('/api/inquiries?all=true', {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[InquiryService] Error purging inquiries on server:', err.message);
  }
}

/**
 * DEPARTMENT FEEDBACK MANAGEMENT SERVICE
 */
const FEEDBACK_STORAGE_KEY = 'apec_department_feedbacks';

export async function submitDepartmentFeedback(feedbackData) {
  const timestamp = Date.now();
  const formattedFeedback = {
    id: feedbackData.id || `fb_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    name: feedbackData.name || 'Anonymous User',
    dept: feedbackData.dept || feedbackData.department || 'General',
    section: feedbackData.section || 'General Feedback',
    email: feedbackData.email || '',
    phone: feedbackData.phone || '',
    rating: feedbackData.rating || 5,
    message: feedbackData.message || feedbackData.comments || '',
    date: feedbackData.date || new Date().toLocaleString(),
    createdAt: timestamp
  };

  try {
    const list = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
    const updated = [formattedFeedback, ...list.filter(item => item.id !== formattedFeedback.id)];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('apec_storage_update'));
    window.dispatchEvent(new Event('apec_feedback_updated'));
  } catch (err) {
    console.warn('[FeedbackService] Local storage write error:', err);
  }

  try {
    fetch('/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedFeedback)
    }).catch(() => {});
  } catch (e) {}

  return { success: true, feedback: formattedFeedback };
}

export function getDepartmentFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function deleteDepartmentFeedback(id) {
  try {
    const list = getDepartmentFeedbacks().filter(f => f.id !== id);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('apec_storage_update'));
    window.dispatchEvent(new Event('apec_feedback_updated'));
  } catch (e) {}
}
