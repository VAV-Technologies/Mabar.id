export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          language: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          language?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          language?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      places: {
        Row: {
          id: string
          google_place_id: string | null
          name: string
          address: string | null
          latitude: number
          longitude: number
          category: string | null
          rating: number | null
          price_level: number | null
          photo_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          google_place_id?: string | null
          name: string
          address?: string | null
          latitude: number
          longitude: number
          category?: string | null
          rating?: number | null
          price_level?: number | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          google_place_id?: string | null
          name?: string
          address?: string | null
          latitude?: number
          longitude?: number
          category?: string | null
          rating?: number | null
          price_level?: number | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      voucher_templates: {
        Row: {
          id: string
          place_id: string | null
          discount_type: string
          discount_value: number
          title_en: string
          title_id: string
          description_en: string | null
          description_id: string | null
          terms_en: string | null
          terms_id: string | null
          min_purchase: number | null
          max_discount: number | null
          valid_for: string
          validity_hours: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          place_id?: string | null
          discount_type: string
          discount_value: number
          title_en: string
          title_id: string
          description_en?: string | null
          description_id?: string | null
          terms_en?: string | null
          terms_id?: string | null
          min_purchase?: number | null
          max_discount?: number | null
          valid_for?: string
          validity_hours?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          place_id?: string | null
          discount_type?: string
          discount_value?: number
          title_en?: string
          title_id?: string
          description_en?: string | null
          description_id?: string | null
          terms_en?: string | null
          terms_id?: string | null
          min_purchase?: number | null
          max_discount?: number | null
          valid_for?: string
          validity_hours?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'voucher_templates_place_id_fkey'
            columns: ['place_id']
            referencedRelation: 'places'
            referencedColumns: ['id']
          }
        ]
      }
      user_vouchers: {
        Row: {
          id: string
          user_id: string
          voucher_template_id: string
          place_id: string
          code: string
          status: string
          claimed_at: string
          expires_at: string
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          voucher_template_id: string
          place_id: string
          code: string
          status?: string
          claimed_at?: string
          expires_at: string
          used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          voucher_template_id?: string
          place_id?: string
          code?: string
          status?: string
          claimed_at?: string
          expires_at?: string
          used_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_vouchers_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_vouchers_voucher_template_id_fkey'
            columns: ['voucher_template_id']
            referencedRelation: 'voucher_templates'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_vouchers_place_id_fkey'
            columns: ['place_id']
            referencedRelation: 'places'
            referencedColumns: ['id']
          }
        ]
      }
      spin_history: {
        Row: {
          id: string
          user_id: string
          place_id: string
          voucher_id: string | null
          latitude: number
          longitude: number
          radius_km: number
          spun_at: string
        }
        Insert: {
          id?: string
          user_id: string
          place_id: string
          voucher_id?: string | null
          latitude: number
          longitude: number
          radius_km: number
          spun_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          place_id?: string
          voucher_id?: string | null
          latitude?: number
          longitude?: number
          radius_km?: number
          spun_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'spin_history_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'spin_history_place_id_fkey'
            columns: ['place_id']
            referencedRelation: 'places'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'spin_history_voucher_id_fkey'
            columns: ['voucher_id']
            referencedRelation: 'user_vouchers'
            referencedColumns: ['id']
          }
        ]
      }
      user_daily_spins: {
        Row: {
          id: string
          user_id: string
          spin_date: string
          spins_used: number
          max_spins: number
        }
        Insert: {
          id?: string
          user_id: string
          spin_date: string
          spins_used?: number
          max_spins?: number
        }
        Update: {
          id?: string
          user_id?: string
          spin_date?: string
          spins_used?: number
          max_spins?: number
        }
        Relationships: [
          {
            foreignKeyName: 'user_daily_spins_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_places: {
        Args: {
          lat: number
          lng: number
          radius_km: number
          category_filter?: string
        }
        Returns: {
          id: string
          name: string
          address: string | null
          latitude: number
          longitude: number
          category: string | null
          rating: number | null
          price_level: number | null
          photo_url: string | null
          distance_km: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
