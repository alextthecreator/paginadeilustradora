// Kept independent of consent state to avoid a configuration import cycle.
export const analyticsConfig = {
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  events: {
    CONTACT_FORM_START: 'contact_form_start',
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    CONTACT_FORM_SUCCESS: 'contact_form_success',
    CONTACT_FORM_ERROR: 'contact_form_error',
    PORTFOLIO_VIEW: 'portfolio_view',
    WORK_GALLERY_VIEW: 'work_gallery_view',
    IMAGE_CLICK: 'image_click',
    SOCIAL_CLICK: 'social_click',
    INSTAGRAM_CLICK: 'instagram_click',
    BEHANCE_CLICK: 'behance_click',
    LINKEDIN_CLICK: 'linkedin_click',
    PAGE_VIEW: 'page_view',
    NAVIGATION_CLICK: 'navigation_click',
  },
  conversions: {
    CONTACT_FORM_SUBMISSION: 'contact_form_submission',
    PORTFOLIO_ENGAGEMENT: 'portfolio_engagement',
    SOCIAL_ENGAGEMENT: 'social_engagement',
  },
};

export function hasMeasurementId(id: string) {
  return /^G-[A-Z0-9]+$/.test(id) && id !== 'G-XXXXXXXXXX';
}
