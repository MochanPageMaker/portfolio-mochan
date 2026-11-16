/* Public GitHub Pages edition: seed data only, no server probing or login. */
window.PortfolioAPI = {
  ready: Promise.resolve(false),
  online: false,
  token: '',
  async content(_key, filename) {
    const response = await fetch(filename);
    if (!response.ok) throw new Error('Could not load the demo. Please refresh the page.');
    return response.json();
  },
  async call() { throw new Error('Management features are available in the server version.'); },
  async submit() { throw new Error('This demo does not submit enquiries.'); }
};
