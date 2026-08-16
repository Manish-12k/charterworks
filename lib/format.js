export function formatRupees(paise) {
  if (paise === null || paise === undefined) return 'Free';
  return '₹' + (paise / 100).toLocaleString('en-IN');
}

export function generateFileNo() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 89999);
  return `LF-${year}-${rand}`;
}

export const SERVICE_CATEGORIES = [
  { key: 'startups', label: 'Startups' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'licences', label: 'Licences' },
  { key: 'funding', label: 'Funding' },
];
