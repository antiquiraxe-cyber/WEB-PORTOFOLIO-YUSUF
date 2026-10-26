import { PortfolioItem } from '@/types/portfolio';

function extractUrl(prop: any): string | null {
  if (!prop) return null;
  if (prop.url) return prop.url.trim();
  if (prop.rich_text && prop.rich_text.length > 0) {
    const text = prop.rich_text[0].plain_text?.trim() || prop.rich_text[0].href?.trim() || null;
    return text;
  }
  return null;
}

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
      
      const rawLink = extractUrl(props.Link_Proyek) || extractUrl(props['Link Proyek']) || extractUrl(props.Link) || extractUrl(props.Deployment) || null;
      const rawGithub = extractUrl(props.Github) || extractUrl(props.GitHub) || extractUrl(props.Repo) || extractUrl(props.Repository) || extractUrl(props.Link_Github) || extractUrl(props['Link Github']) || extractUrl(props['Source Code']) || extractUrl(props.Source_Code) || null;

      let finalLink = rawLink;
      let finalGithub = rawGithub;

      // Smart auto-detect: if user entered a GitHub URL directly in the link column
      if (finalLink && (finalLink.includes('github.com') || finalLink.includes('gitlab.com')) && !finalGithub) {
        finalGithub = finalLink;
        finalLink = null;
      }

      const statusName = props.Status?.select?.name?.toLowerCase() || '';
      const isExplicitlyNotDeployed = 
        statusName.includes('not deployed') || 
        statusName.includes('wip') || 
        statusName.includes('in dev') || 
        props.Deployed?.checkbox === false;

      const isDeployed = isExplicitlyNotDeployed ? false : Boolean(finalLink && finalLink !== '#');

      return {
        id: page.id,
        name: props.Name?.title[0]?.plain_text || 'Untitled',
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
        description: props.Deskripsi?.rich_text[0]?.plain_text || '',
        link: finalLink || '#',
        github: finalGithub || undefined,
        isDeployed,
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

