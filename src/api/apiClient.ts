export interface SongBlock {
  id: string;
  type: 'intro' | 'estrofe' | 'refrao' | 'ponte';
  title: string;
  sub: string;
}

export interface Song {
  id: string;
  title: string;
  key: string;
  in_playlist: boolean;
  playlist_order: number;
  reference_url: string;
  blocks: SongBlock[];
  created_date: string;
  updated_date: string;
}

// Mock backend API
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const STORAGE_KEY = 'setlistpro_songs_db_v1';

function getDb(): Song[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveDb(songs: Song[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}

export const api = {
  songs: {
    async list(): Promise<Song[]> {
      await delay(300);
      return getDb().sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
    },
    async get(id: string): Promise<Song | undefined> {
      await delay(200);
      return getDb().find(s => s.id === id);
    },
    async create(song: Omit<Song, 'id' | 'created_date' | 'updated_date'>): Promise<Song> {
      await delay(400);
      const newSong: Song = {
        ...song,
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      };
      const db = getDb();
      db.push(newSong);
      saveDb(db);
      return newSong;
    },
    async update(id: string, updates: Partial<Omit<Song, 'id' | 'created_date' | 'updated_date'>>): Promise<Song> {
      await delay(400);
      const db = getDb();
      const index = db.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Not found');
      
      const updatedSong = {
        ...db[index],
        ...updates,
        updated_date: new Date().toISOString()
      };
      db[index] = updatedSong;
      saveDb(db);
      return updatedSong;
    },
    async delete(id: string): Promise<void> {
      await delay(400);
      const db = getDb();
      saveDb(db.filter(s => s.id !== id));
    }
  }
};
