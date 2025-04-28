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
      final_list_duplicate: {
        Row: {
          id: string
          company_name: string
          type: 'existing' | 'inbound' | 'outbound'
          location: string | null
          name: string | null
          email: string | null
          role_of_contact: string | null
          location_of_contact: string | null
          company_description: string | null
          revenue_usd: string | null
          company_industry: string | null
          customer_profile: string | null
          subscription: string | null
          score: string | null
          industry_growth_rate: string | null
          exchange_market_code: string | null
          how_did_you_find_us: string | null
          what_will_you_use_nexus_for: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_name: string
          type: 'existing' | 'inbound' | 'outbound'
          location?: string | null
          name?: string | null
          email?: string | null
          role_of_contact?: string | null
          location_of_contact?: string | null
          company_description?: string | null
          revenue_usd?: string | null
          company_industry?: string | null
          customer_profile?: string | null
          subscription?: string | null
          score?: string | null
          industry_growth_rate?: string | null
          exchange_market_code?: string | null
          how_did_you_find_us?: string | null
          what_will_you_use_nexus_for?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string
          type?: 'existing' | 'inbound' | 'outbound'
          location?: string | null
          name?: string | null
          email?: string | null
          role_of_contact?: string | null
          location_of_contact?: string | null
          company_description?: string | null
          revenue_usd?: string | null
          company_industry?: string | null
          customer_profile?: string | null
          subscription?: string | null
          score?: string | null
          industry_growth_rate?: string | null
          exchange_market_code?: string | null
          how_did_you_find_us?: string | null
          what_will_you_use_nexus_for?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      auth_users: {
        Row: {
          id: string
          email: string
          password: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string | null
          created_at?: string
        }
      }
    }
  }
}