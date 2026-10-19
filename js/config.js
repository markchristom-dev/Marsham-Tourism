/**
 * Marsham Tourism — Centralized Agency Configuration
 * Update contact numbers, social links, or agency info here to reflect across pages.
 */

window.MARSHAM_CONFIG = {
  brandName: 'Marsham Tourism',
  legalName: 'Marsham Tourism LLC',
  slogan: 'Discover. Experience. Remember.',
  location: 'Karama, Dubai, United Arab Emirates',
  whatsappNumber: '971564511167',
  phoneDisplay: '+971 56 451 1167',
  email: 'marshamtourism@gmail.com',
  links: {
    whatsappBase: 'https://wa.me/971564511167',
    googleReview: 'https://g.page/r/CU8rIrPlPRl9EBM/review',
    facebook: 'https://www.facebook.com/OfiicialMarshamTourism'
  },

  /**
   * Builds a pre-filled WhatsApp URL for instant lead conversion
   * @param {string} message - Custom message text
   * @returns {string} Full WhatsApp URL
   */
  buildWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message.trim());
    return `${this.links.whatsappBase}?text=${encoded}`;
  }
};
