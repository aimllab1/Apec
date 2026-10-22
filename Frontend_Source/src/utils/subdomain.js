/**
 * Subdomain Routing Utilities for APEC
 * Supports:
 * - Localhost: aiml.localhost:5173
 * - LAN / Neighbor laptops via nip.io or sslip.io: aiml.192.168.26.126.nip.io:5173
 * - Production custom domain: aiml.apec.edu.in (or wildcard *.apec.edu.in)
 * - Fallback to standard path /departments/:id for domains like *.vercel.app
 */

export const DEPARTMENT_ALIASES = {
  'ai-ml': 'aiml',
  'ai_ml': 'aiml',
  'ai-ds': 'aids',
  'ai_ds': 'aids',
  'mechanical': 'mech',
  'chemical-engg': 'chemical',
  'chem': 'chemical',
  'agriculture': 'agri',
  'mecse': 'me-cse',
  'mevlsi': 'me-vlsi',
  'meped': 'me-ped',
  'methermal': 'me-thermal',
  'mecem': 'me-cem',
  's-h': 'sh',
  'science-humanities': 'sh',
  'science-and-humanities': 'sh',
};

export const VALID_DEPARTMENTS = new Set([
  'aiml', 'chemical', 'civil', 'mca', 'cse', 'mech',
  'it', 'eee', 'ece', 'mba', 'sh', 'csd', 'agri',
  'phd-civil', 'phd-mech', 'phd-ece', 'phd-eee', 'aids',
  'me-cse', 'me-vlsi', 'me-ped', 'me-thermal', 'me-cem'
]);

function isIpAddress(hostname) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

/**
 * Detects if current URL is under a department subdomain.
 * Returns department key (e.g. 'aiml', 'cse') or null.
 */
export function getDepartmentFromSubdomain() {
  if (typeof window === 'undefined') return null;
  const hostname = (window.location.hostname || '').toLowerCase();
  if (!hostname || isIpAddress(hostname)) return null;

  let candidate = null;

  // 1. Check for wildcard DNS services: e.g. aiml.192.168.26.126.nip.io or aiml.192-168-26-126.sslip.io
  const nipMatch = hostname.match(/^([a-z0-9_-]+)\.(?:(?:\d{1,3}[.-]){3}\d{1,3})\.(?:nip|sslip)\.io$/);
  if (nipMatch) {
    candidate = nipMatch[1];
  } 
  // 2. Check for *.localhost (e.g. aiml.localhost)
  else if (hostname.endsWith('.localhost')) {
    candidate = hostname.replace(/\.localhost$/, '');
  } 
  // 3. Check for local network domain (e.g. aiml.local or aiml.apec.local)
  else if (hostname.endsWith('.local')) {
    candidate = hostname.replace(/\.local$/, '').split('.')[0];
  } 
  // 4. Check for custom domain (e.g. aiml.apec.edu.in or aiml.apec-edu.com)
  else {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      const first = parts[0];
      if (first !== 'www' && first !== 'apec' && first !== 'apec-edu') {
        candidate = first;
      }
    }
  }

  if (!candidate) return null;
  candidate = candidate.toLowerCase();
  if (DEPARTMENT_ALIASES[candidate]) candidate = DEPARTMENT_ALIASES[candidate];

  return VALID_DEPARTMENTS.has(candidate) ? candidate : null;
}

/**
 * Returns whether current window is viewed via department subdomain.
 */
export function isSubdomainMode() {
  return Boolean(getDepartmentFromSubdomain());
}

/**
 * Returns the URL pointing back to the main College portal.
 */
export function getRootCollegeUrl(path = '') {
  if (typeof window === 'undefined') return path || '/';
  const { protocol, hostname, port } = window.location;
  const portStr = port ? `:${port}` : '';
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (isIpAddress(hostname)) {
    return cleanPath || '/';
  }

  // nip.io / sslip.io: e.g. aiml.192.168.26.126.nip.io -> http://192.168.26.126.nip.io:5173
  const nipMatch = hostname.match(/^[a-z0-9_-]+\.((?:(?:\d{1,3}[.-]){3}\d{1,3})\.(?:nip|sslip)\.io)$/i);
  if (nipMatch) {
    return `${protocol}//${nipMatch[1]}${portStr}${cleanPath}`;
  }
  if (hostname.endsWith('.nip.io') || hostname.endsWith('.sslip.io')) {
    return `${protocol}//${hostname}${portStr}${cleanPath}`;
  }

  // localhost: aiml.localhost -> http://localhost:5173
  if (hostname.endsWith('.localhost')) {
    return `${protocol}//localhost${portStr}${cleanPath}`;
  }

  if (hostname.endsWith('.local')) {
    return `${protocol}//local${portStr}${cleanPath}`;
  }

  // Custom domain: e.g. aiml.apec.edu.in -> https://apec.edu.in
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    const rootDomain = parts.slice(1).join('.');
    return `${protocol}//${rootDomain}${portStr}${cleanPath}`;
  }

  return cleanPath || '/';
}

/**
 * Returns the URL for a specific department (either subdomain URL or relative path).
 */
export function getDepartmentUrl(deptId) {
  if (!deptId) return '/departments';
  if (typeof window === 'undefined') return `/departments/${deptId}`;

  const { protocol, hostname, port } = window.location;
  const portStr = port ? `:${port}` : '';

  // Free Vercel domains (*.vercel.app) do not support wildcard subdomains
  if (hostname.endsWith('.vercel.app')) {
    return `/departments/${deptId}`;
  }

  // Raw IP (no DNS host)
  if (isIpAddress(hostname)) {
    return `/departments/${deptId}`;
  }

  // nip.io / sslip.io
  const nipMatch = hostname.match(/^(?:[a-z0-9_-]+\.)?((?:(?:\d{1,3}[.-]){3}\d{1,3})\.(?:nip|sslip)\.io)$/i);
  if (nipMatch) {
    return `${protocol}//${deptId}.${nipMatch[1]}${portStr}/`;
  }

  // localhost
  if (hostname.includes('localhost')) {
    return `${protocol}//${deptId}.localhost${portStr}/`;
  }

  // local network domain
  if (hostname.endsWith('.local')) {
    return `${protocol}//${deptId}.local${portStr}/`;
  }

  // Custom domain
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    const rootDomain = parts.slice(1).join('.');
    return `${protocol}//${deptId}.${rootDomain}${portStr}/`;
  }

  return `/departments/${deptId}`;
}
