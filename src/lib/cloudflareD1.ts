/**
 * Cloudflare D1 and Full-Stack Storage Integration
 * Enables database backup, JSON export/import for Cloudflare D1 migrations,
 * and optional worker sync.
 */

export interface ExportData {
  users: unknown[];
  products: unknown[];
  orders: unknown[];
  banners: unknown[];
  settings: unknown;
  courierConfig: unknown;
  pixelConfig: unknown;
  exportedAt: string;
}

export const exportCloudflareD1Data = (data: ExportData): string => {
  return JSON.stringify(data, null, 2);
};

export const downloadCloudflareBackup = (data: ExportData) => {
  const blob = new Blob([exportCloudflareD1Data(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `foodghor_cloudflare_d1_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateCloudflareSQLSeeds = (data: {
  products: Array<{
    id: string;
    slug: string;
    name: string;
    banglaName: string;
    category: string;
    price: number;
    regularPrice: number;
    unit: string;
    image: string;
    landingConfig: unknown;
  }>;
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    tag: string;
    imageUrl: string;
    linkUrl: string;
    buttonText: string;
    active: boolean;
    order: number;
  }>;
}): string => {
  let sql = '-- Generated Cloudflare D1 Seed Script\n';
  sql += 'BEGIN TRANSACTION;\n\n';

  for (const p of data.products) {
    const configJson = JSON.stringify(p.landingConfig).replace(/'/g, "''");
    sql += `INSERT OR REPLACE INTO products (id, slug, name, bangla_name, category, price, regular_price, unit, in_stock, image, landing_config)\nVALUES ('${p.id}', '${p.slug}', '${p.name.replace(/'/g, "''")}', '${p.banglaName.replace(/'/g, "''")}', '${p.category.replace(/'/g, "''")}', ${p.price}, ${p.regularPrice}, '${p.unit}', 1, '${p.image.replace(/'/g, "''")}', '${configJson}');\n\n`;
  }

  for (const b of data.banners) {
    sql += `INSERT OR REPLACE INTO banners (id, title, subtitle, tag, image_url, link_url, button_text, active, sort_order)\nVALUES ('${b.id}', '${b.title.replace(/'/g, "''")}', '${b.subtitle.replace(/'/g, "''")}', '${b.tag.replace(/'/g, "''")}', '${b.imageUrl.replace(/'/g, "''")}', '${b.linkUrl}', '${b.buttonText.replace(/'/g, "''")}', ${b.active ? 1 : 0}, ${b.order});\n\n`;
  }

  sql += 'COMMIT;\n';
  return sql;
};
