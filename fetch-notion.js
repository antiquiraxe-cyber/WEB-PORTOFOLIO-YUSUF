import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const secret = process.env.NOTION_SECRET;
const databaseId = process.env.NOTION_DATABASE_ID;

async function getNotionData() {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // Looping data dari Notion
    const projects = data.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        name: props.Name?.title[0]?.plain_text || 'Untitled',
        tags: props.Tags?.multi_select.map(t => t.name) || [],
        description: props.Deskripsi?.rich_text[0]?.plain_text || '',
        link: props.Link_Proyek?.url || props['Link Proyek']?.url || '#',
        image: props.Gambar?.files[0]?.file?.url || props.Gambar?.files[0]?.name || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
      };
    });

    // Simpan hasilnya ke dalam folder app proyek Next.js baru lu
    const outputPath = path.join(process.cwd(), 'app', 'data-notion.json');
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
    console.log('✅ Berhasil menarik data dari Notion dan menyimpan ke app/data-notion.json');
  } catch (error) {
    console.error('❌ Gagal menarik data dari Notion:', error);
  }
}

getNotionData();