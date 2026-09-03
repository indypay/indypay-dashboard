import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type IntegrationDocProduct = 'payin' | 'payout';

export async function renderIntegrationDocHtml(
  product: IntegrationDocProduct,
): Promise<string> {
  const filePath = path.join(process.cwd(), 'lib', 'md-docs', `${product}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
  const parsedContent = await remark().use(html).process(content);

  const apiBaseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

  return parsedContent
    .toString()
    .replaceAll(
      '&#x3C;PROD_API_BASE_URL>',
      apiBaseUrl || 'https://api.RupeeFlow.in',
    );
}
