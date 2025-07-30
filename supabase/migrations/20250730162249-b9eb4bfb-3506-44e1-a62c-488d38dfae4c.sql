-- Fix the relation between food_listings and profiles
-- Add foreign key constraint from food_listings.user_id to profiles.id
ALTER TABLE public.food_listings 
ADD CONSTRAINT fk_food_listings_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also fix claimed_by if it exists
ALTER TABLE public.food_listings 
ADD CONSTRAINT fk_food_listings_claimed_by 
FOREIGN KEY (claimed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;