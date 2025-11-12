import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  ticket_type_id: string;
  event_id: string;
  event_title: string;
  ticket_name: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface VoteCartItem {
  artist_id: string;
  artist_name: string;
  package_id: string;
  package_name: string;
  votes: number;
  price: number;
  quantity: number;
  currency: string;
}

interface CartStore {
  // Ticket Cart
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (ticket_type_id: string) => void;
  updateQuantity: (ticket_type_id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;

  // Vote Cart
  voteItems: VoteCartItem[];
  addVoteItem: (item: Omit<VoteCartItem, 'quantity'>, quantity?: number) => void;
  removeVoteItem: (artist_id: string, package_id: string) => void;
  updateVoteQuantity: (artist_id: string, package_id: string, quantity: number) => void;
  clearVoteCart: () => void;
  getVoteTotal: () => number;
  getVoteCount: () => number;
  getTotalVotes: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Ticket Cart State
      items: [],

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.ticket_type_id === item.ticket_type_id
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.ticket_type_id === item.ticket_type_id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        });
      },

      removeItem: (ticket_type_id) => {
        set((state) => ({
          items: state.items.filter((i) => i.ticket_type_id !== ticket_type_id),
        }));
      },

      updateQuantity: (ticket_type_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(ticket_type_id);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.ticket_type_id === ticket_type_id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      // Vote Cart State
      voteItems: [],

      addVoteItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.voteItems.find(
            (i) =>
              i.artist_id === item.artist_id && i.package_id === item.package_id
          );

          if (existingItem) {
            return {
              voteItems: state.voteItems.map((i) =>
                i.artist_id === item.artist_id &&
                i.package_id === item.package_id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }

          return {
            voteItems: [...state.voteItems, { ...item, quantity }],
          };
        });
      },

      removeVoteItem: (artist_id, package_id) => {
        set((state) => ({
          voteItems: state.voteItems.filter(
            (i) => !(i.artist_id === artist_id && i.package_id === package_id)
          ),
        }));
      },

      updateVoteQuantity: (artist_id, package_id, quantity) => {
        if (quantity <= 0) {
          get().removeVoteItem(artist_id, package_id);
          return;
        }

        set((state) => ({
          voteItems: state.voteItems.map((i) =>
            i.artist_id === artist_id && i.package_id === package_id
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearVoteCart: () => {
        set({ voteItems: [] });
      },

      getVoteTotal: () => {
        const state = get();
        return state.voteItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getVoteCount: () => {
        const state = get();
        return state.voteItems.reduce((count, item) => count + item.quantity, 0);
      },

      getTotalVotes: () => {
        const state = get();
        return state.voteItems.reduce(
          (total, item) => total + item.votes * item.quantity,
          0
        );
      },
    }),
    {
      name: 'afromerica-cart',
      partialize: (state) => ({
        items: state.items,
        voteItems: state.voteItems,
      }),
    }
  )
);