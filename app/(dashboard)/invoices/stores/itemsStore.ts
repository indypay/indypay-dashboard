import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  tax?: number;
  gstRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

type NewItem = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
type ItemUpdate = Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>;

interface ItemsStore {
  items: Item[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addItem: (item: NewItem) => Promise<Item>;
  updateItem: (id: string, item: ItemUpdate) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
}

// This will be replaced with actual API calls
const mockApi = {
  async getItems(): Promise<Item[]> {
    return [] as Item[];
  },
  async createItem(item: NewItem): Promise<Item> {
    return {
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...item,
    };
  },
  async updateItem(id: string, item: ItemUpdate): Promise<Item> {
    return {
      id,
      name: '',
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...item,
    };
  },
  async deleteItem(): Promise<void> {
    // Mock delete
  },
};

export const useItemsStore = create<ItemsStore>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: async (item) => {
        try {
          set({ isLoading: true, error: null });
          const newItem = await mockApi.createItem(item);
          set((state) => ({
            items: [...state.items, newItem],
            isLoading: false,
          }));
          return newItem;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      updateItem: async (id, item) => {
        try {
          set({ isLoading: true, error: null });
          const updatedItem = await mockApi.updateItem(id, item);
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? updatedItem : i)),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      deleteItem: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await mockApi.deleteItem();
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      fetchItems: async () => {
        try {
          set({ isLoading: true, error: null });
          const items = await mockApi.getItems();
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'items-storage',
    },
  ),
);
