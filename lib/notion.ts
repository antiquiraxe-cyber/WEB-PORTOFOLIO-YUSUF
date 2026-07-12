import { PortfolioItem } from '@/types/portfolio';

export async function getNotionProjects(): Promise<PortfolioItem[]> {
  const secret = process.env.NOTION_SECRET;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!secret || !databaseId) {
    console.warn("Missing NOTION_SECRET or NOTION_DATABASE_ID in .env");
    return [];
  }

  try {
    // We add revalidate: 0 to always fetch fresh data (fixes expired Notion S3 image URLs)
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Notion API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const projects: PortfolioItem[] = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: props.Name?.title[0]?.plain_text || 'Untitled',
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
        description: props.Deskripsi?.rich_text[0]?.plain_text || '',
        link: props.Link_Proyek?.url || props['Link Proyek']?.url || '#',
        images: props.Gambar?.files?.length > 0 
          ? props.Gambar.files.map((fileObj: any) => fileObj?.file?.url || fileObj?.external?.url || fileObj?.name) 
          : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f']
      };
    });

    return projects;
  } catch (error) {
    console.error('Failed to fetch data from Notion:', error);
    return [];
  }
}

export async function getNotionArchives(): Promise<import('@/types/portfolio').ArchiveItem[]> {
  const secret = process.env.NOTION_SECRET;
  const databaseId = process.env.NOTION_ARCHIVE_DATABASE_ID;

  if (!secret || !databaseId) {
    console.warn("Missing NOTION_ARCHIVE_DATABASE_ID in .env. Falling back to static data.");
    return [
      { id: '1', year: '2023', name: 'Legacy System v1', tech: ['PHP', 'jQuery'], link: '#' },
      { id: '2', year: '2022', name: 'Terminal UI Clone', tech: ['HTML', 'CSS', 'JS'], link: '#' },
      { id: '3', year: '2021', name: 'First Personal Web', tech: ['HTML'], link: '#' }
    ];
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Notion API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: props.Name?.title[0]?.plain_text || 'Untitled',
        year: props.Year?.rich_text[0]?.plain_text || props.Tahun?.rich_text[0]?.plain_text || props.Year?.number?.toString() || 'N/A',
        tech: props.Tech?.multi_select?.map((t: any) => t.name) || props.Tags?.multi_select?.map((t: any) => t.name) || [],
        link: props.Link?.url || '#'
      };
    });
  } catch (error) {
    console.error('Failed to fetch archive data from Notion:', error);
    return [];
  }
}

