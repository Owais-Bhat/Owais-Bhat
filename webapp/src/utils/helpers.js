export const formatCurrency = (value, currency = '₹') => {
  if (!value) return '₹0';
  return `${currency}${value.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN');
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export const calculateAttendancePercentage = (present, total) => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'emerald',
    inactive: 'gray',
    pending: 'amber',
    success: 'emerald',
    failed: 'red',
    warning: 'amber',
    error: 'red',
  };
  return colors[status] || 'gray';
};

export const getStatusBadge = (status) => {
  const badges = {
    active: { label: 'Active', color: 'bg-emerald-500/20 text-emerald-300' },
    inactive: { label: 'Inactive', color: 'bg-gray-500/20 text-gray-300' },
    pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-300' },
    success: { label: 'Success', color: 'bg-emerald-500/20 text-emerald-300' },
    failed: { label: 'Failed', color: 'bg-red-500/20 text-red-300' },
  };
  return badges[status] || { label: status, color: 'bg-gray-500/20 text-gray-300' };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const downloadJSON = (data, filename = 'data.json') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
