export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: 'customer' | 'staff' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          base_price: number;
          is_available: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          base_price: number;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          base_price?: number;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          price_delta: number;
          is_default: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          price_delta?: number;
          is_default?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          price_delta?: number;
          is_default?: boolean;
          sort_order?: number;
        };
      };
      product_options: {
        Row: {
          id: string;
          product_id: string;
          option_group: string;
          name: string;
          price_delta: number;
          is_default: boolean;
          max_selections: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          option_group: string;
          name: string;
          price_delta?: number;
          is_default?: boolean;
          max_selections?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          option_group?: string;
          name?: string;
          price_delta?: number;
          is_default?: boolean;
          max_selections?: number;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          delivery_fee: number;
          estimated_minutes: number | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          delivery_fee: number;
          estimated_minutes?: number | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          delivery_fee?: number;
          estimated_minutes?: number | null;
          is_active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          status:
            | 'pending'
            | 'confirmed'
            | 'preparing'
            | 'ready'
            | 'out_for_delivery'
            | 'delivered'
            | 'cancelled';
          subtotal: number;
          delivery_fee: number;
          platform_fee: number;
          total: number;
          payment_method: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          delivery_zone_id: string | null;
          delivery_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          status?:
            | 'pending'
            | 'confirmed'
            | 'preparing'
            | 'ready'
            | 'out_for_delivery'
            | 'delivered'
            | 'cancelled';
          subtotal: number;
          delivery_fee: number;
          platform_fee?: number;
          total: number;
          payment_method?: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          delivery_zone_id?: string | null;
          delivery_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          status?:
            | 'pending'
            | 'confirmed'
            | 'preparing'
            | 'ready'
            | 'out_for_delivery'
            | 'delivered'
            | 'cancelled';
          subtotal?: number;
          delivery_fee?: number;
          platform_fee?: number;
          total?: number;
          payment_method?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_address?: string;
          delivery_zone_id?: string | null;
          delivery_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          variant_name: string | null;
          options: Json;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          options?: Json;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          variant_name?: string | null;
          options?: Json;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      restaurant_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
