import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export class ProfileManager {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findOrCreateProfile(username: string, userId?: string): Promise<any> {
    let profile;

    try {
      // First check if this is the user's own profile
      if (userId) {
        console.log('Checking user profile first:', userId);
        const { data: userProfile, error: userProfileError } = await this.supabase
          .from('profiles')
          .select('id, instagram_account')
          .eq('id', userId)
          .maybeSingle();

        if (userProfileError) {
          console.error('Error checking user profile:', userProfileError);
          throw userProfileError;
        }

        if (userProfile) {
          console.log('Found user profile:', userProfile);
          // If this is the user's profile, update it with the Instagram account if needed
          if (userProfile.instagram_account !== username) {
            const { data: updatedProfile, error: updateError } = await this.supabase
              .from('profiles')
              .update({ instagram_account: username })
              .eq('id', userId)
              .select()
              .maybeSingle();

            if (updateError) {
              console.error('Error updating user profile:', updateError);
              throw updateError;
            }
            profile = updatedProfile;
          } else {
            profile = userProfile;
          }
        }
      }

      // If we haven't found a profile yet, check for existing profile by instagram account
      if (!profile) {
        console.log('Checking for existing profile with instagram account:', username);
        const { data: existingProfiles, error: profileError } = await this.supabase
          .from('profiles')
          .select('id, instagram_account')
          .eq('instagram_account', username);

        if (profileError) {
          console.error('Error checking existing profile:', profileError);
          throw profileError;
        }

        if (existingProfiles && existingProfiles.length > 0) {
          console.log('Found existing profile:', existingProfiles[0]);
          profile = existingProfiles[0];
        } else {
          console.log('Creating new profile for instagram account:', username);
          const { data: newProfile, error: createError } = await this.supabase
            .from('profiles')
            .insert([{ instagram_account: username }])
            .select()
            .maybeSingle();

          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }

          console.log('Created new profile:', newProfile);
          profile = newProfile;
        }
      }

      return profile;
    } catch (error) {
      console.error('Error in profile management:', error);
      throw new Error(`Failed to check existing profile: ${error.message}`);
    }
  }
}