export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRoleSlug = "customer" | "professional" | "admin";
export type AccountType = "individual" | "company";
export type JobStatus =
  | "open"
  | "matched"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "removed";
export type OfferStatus = "pending" | "accepted" | "declined" | "withdrawn";
export type CreditTransactionType =
  | "registration"
  | "offer"
  | "featured"
  | "purchase"
  | "admin";
export type NotificationType =
  | "job_nearby"
  | "offer_received"
  | "offer_accepted"
  | "offer_viewed"
  | "message"
  | "review"
  | "credits"
  | "moderation"
  | "system";

export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          slug: UserRoleSlug;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: UserRoleSlug;
          name: string;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_hu: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_en: string;
          name_hu: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          slug?: string;
          name_en?: string;
          name_hu?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role_id: string;
          display_name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          locale: "en" | "hu";
          is_banned: boolean;
          banned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role_id: string;
          display_name: string;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          locale?: "en" | "hu";
          is_banned?: boolean;
          banned_at?: string | null;
        };
        Update: {
          display_name?: string;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          locale?: "en" | "hu";
          is_banned?: boolean;
          banned_at?: string | null;
          role_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_profiles: {
        Row: {
          profile_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "customer_profiles_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      professional_profiles: {
        Row: {
          profile_id: string;
          account_type: AccountType;
          business_name: string | null;
          trade: string | null;
          city: string | null;
          bio: string | null;
          years_experience: number | null;
          service_radius_km: number;
          hourly_rate: number | null;
          lat: number | null;
          lng: number | null;
          logo_url: string | null;
          photo_url: string | null;
          is_verified: boolean;
          is_available: boolean;
          working_hours: Json;
          certificates: Json;
          gallery: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          account_type?: AccountType;
          business_name?: string | null;
          trade?: string | null;
          city?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          service_radius_km?: number;
          hourly_rate?: number | null;
          lat?: number | null;
          lng?: number | null;
          logo_url?: string | null;
          photo_url?: string | null;
          is_verified?: boolean;
          is_available?: boolean;
          working_hours?: Json;
          certificates?: Json;
          gallery?: Json;
        };
        Update: {
          account_type?: AccountType;
          business_name?: string | null;
          trade?: string | null;
          city?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          service_radius_km?: number;
          hourly_rate?: number | null;
          lat?: number | null;
          lng?: number | null;
          logo_url?: string | null;
          photo_url?: string | null;
          is_verified?: boolean;
          is_available?: boolean;
          working_hours?: Json;
          certificates?: Json;
          gallery?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "professional_profiles_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      professional_categories: {
        Row: {
          id: string;
          professional_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          category_id: string;
        };
        Update: {
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "professional_categories_professional_id_fkey";
            columns: ["professional_id"];
            referencedRelation: "professional_profiles";
            referencedColumns: ["profile_id"];
          },
          {
            foreignKeyName: "professional_categories_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      addresses: {
        Row: {
          id: string;
          profile_id: string;
          label: string | null;
          line1: string;
          city: string | null;
          postal_code: string | null;
          lat: number | null;
          lng: number | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          label?: string | null;
          line1: string;
          city?: string | null;
          postal_code?: string | null;
          lat?: number | null;
          lng?: number | null;
          is_default?: boolean;
        };
        Update: {
          label?: string | null;
          line1?: string;
          city?: string | null;
          postal_code?: string | null;
          lat?: number | null;
          lng?: number | null;
          is_default?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      jobs: {
        Row: {
          id: string;
          customer_id: string;
          category_id: string;
          assigned_professional_id: string | null;
          address_id: string | null;
          title: string;
          description: string;
          address_text: string;
          lat: number | null;
          lng: number | null;
          status: JobStatus;
          emergency: boolean;
          preferred_date: string | null;
          budget_min: number | null;
          budget_max: number | null;
          flagged: boolean;
          removed_at: string | null;
          removed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          category_id: string;
          assigned_professional_id?: string | null;
          address_id?: string | null;
          title: string;
          description: string;
          address_text: string;
          lat?: number | null;
          lng?: number | null;
          status?: JobStatus;
          emergency?: boolean;
          preferred_date?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          flagged?: boolean;
        };
        Update: {
          assigned_professional_id?: string | null;
          address_id?: string | null;
          title?: string;
          description?: string;
          address_text?: string;
          lat?: number | null;
          lng?: number | null;
          status?: JobStatus;
          emergency?: boolean;
          preferred_date?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          flagged?: boolean;
          removed_at?: string | null;
          removed_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customer_profiles";
            referencedColumns: ["profile_id"];
          },
          {
            foreignKeyName: "jobs_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "jobs_assigned_professional_id_fkey";
            columns: ["assigned_professional_id"];
            referencedRelation: "professional_profiles";
            referencedColumns: ["profile_id"];
          },
        ];
      };
      job_images: {
        Row: {
          id: string;
          job_id: string;
          storage_path: string;
          alt: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          storage_path: string;
          alt?: string | null;
          sort_order?: number;
        };
        Update: {
          alt?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "job_images_job_id_fkey";
            columns: ["job_id"];
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          id: string;
          job_id: string;
          professional_id: string;
          price: number;
          available_date: string;
          duration_minutes: number | null;
          message: string;
          featured: boolean;
          status: OfferStatus;
          credit_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          professional_id: string;
          price: number;
          available_date: string;
          duration_minutes?: number | null;
          message: string;
          featured?: boolean;
          status?: OfferStatus;
          credit_cost?: number;
        };
        Update: {
          price?: number;
          available_date?: string;
          duration_minutes?: number | null;
          message?: string;
          featured?: boolean;
          status?: OfferStatus;
        };
        Relationships: [
          {
            foreignKeyName: "offers_job_id_fkey";
            columns: ["job_id"];
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_professional_id_fkey";
            columns: ["professional_id"];
            referencedRelation: "professional_profiles";
            referencedColumns: ["profile_id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          job_id: string;
          customer_id: string;
          professional_id: string;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          customer_id: string;
          professional_id: string;
          last_message_at?: string | null;
        };
        Update: {
          last_message_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_job_id_fkey";
            columns: ["job_id"];
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read_at?: string | null;
        };
        Update: {
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      credits_wallet: {
        Row: {
          profile_id: string;
          balance: number;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          balance?: number;
        };
        Update: {
          balance?: number;
        };
        Relationships: [
          {
            foreignKeyName: "credits_wallet_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "professional_profiles";
            referencedColumns: ["profile_id"];
          },
        ];
      };
      credits_transactions: {
        Row: {
          id: string;
          wallet_id: string;
          type: CreditTransactionType;
          delta: number;
          balance_after: number;
          offer_id: string | null;
          job_id: string | null;
          detail: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_id: string;
          type: CreditTransactionType;
          delta: number;
          balance_after: number;
          offer_id?: string | null;
          job_id?: string | null;
          detail?: string | null;
          created_by?: string | null;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "credits_transactions_wallet_id_fkey";
            columns: ["wallet_id"];
            referencedRelation: "credits_wallet";
            referencedColumns: ["profile_id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          job_id: string;
          customer_id: string;
          professional_id: string;
          rating: number;
          comment: string | null;
          would_hire_again: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          customer_id: string;
          professional_id: string;
          rating: number;
          comment?: string | null;
          would_hire_again?: boolean;
        };
        Update: {
          rating?: number;
          comment?: string | null;
          would_hire_again?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey";
            columns: ["job_id"];
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          id: string;
          customer_id: string;
          professional_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          professional_id: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: NotificationType;
          title: string;
          body: string | null;
          payload: Json;
          job_id: string | null;
          offer_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: NotificationType;
          title: string;
          body?: string | null;
          payload?: Json;
          job_id?: string | null;
          offer_id?: string | null;
          read_at?: string | null;
        };
        Update: {
          read_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      accept_offer: {
        Args: { p_offer_id: string };
        Returns: string;
      };
      admin_grant_credits: {
        Args: {
          p_professional_id: string;
          p_amount: number;
          p_detail?: string;
        };
        Returns: number;
      };
      current_role_slug: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_customer: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_professional: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      account_type: AccountType;
      job_status: JobStatus;
      offer_status: OfferStatus;
      credit_transaction_type: CreditTransactionType;
      notification_type: NotificationType;
    };
  };
};
