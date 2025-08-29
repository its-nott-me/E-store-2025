export const generateSKU = (productName, category) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}-${suffix}`;
};

export const calculateDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

export const paginate = (query, options) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
    page
  };
};

export const buildSortOptions = (sortString) => {
  const sortOptions = {};
  
  if (sortString) {
    const parts = sortString.split(',');
    parts.forEach(part => {
      const [field, order] = part.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    });
  }
  
  return sortOptions;
};