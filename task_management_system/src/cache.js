import NodeCache from 'node-cache';

// stdTTL: 60 seconds — cached data expires automatically after 1 minute
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export default cache;