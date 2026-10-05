/** No trackers load by default. A future consent manager can consume these events. */
const allowed = new Set([
  'whatsapp_click',
  'phone_click',
  'directions_click',
  'branch_view',
  'treatment_view',
]);
document.addEventListener('click', (event) => {
  const link = (event.target as Element)?.closest<HTMLElement>('[data-event]');
  const name = link?.dataset.event;
  if (name && allowed.has(name))
    window.dispatchEvent(new CustomEvent('mydentist:analytics', { detail: { name } }));
});
const pageType = document.querySelector<HTMLElement>('[data-page-event]')?.dataset.pageEvent;
if (pageType && allowed.has(pageType))
  window.dispatchEvent(new CustomEvent('mydentist:analytics', { detail: { name: pageType } }));
export const analyticsConfig = {
  ga4: import.meta.env.PUBLIC_GA4_ID,
  googleAds: import.meta.env.PUBLIC_GOOGLE_ADS_ID,
  meta: import.meta.env.PUBLIC_META_PIXEL_ID,
};
