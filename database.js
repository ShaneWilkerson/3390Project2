// import the SQLite library
// For local storage
import { openDatabaseAsync } from 'expo-sqlite';


// Open database 
const dbPromise = openDatabaseAsync('swolemates.db');

// Creates main tables 
export const setupDatabase = async () => {
  const db = await dbPromise; // wait till its ready

  await db.execAsync(`
    -- Profiles table stores account info for each user
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
    
    -- Gyms table stores basic gym information
    CREATE TABLE IF NOT EXISTS gyms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      address TEXT,
      rating REAL
    );

    -- Reviews table connects users and gyms with ratings and comments
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profileId INTEGER,
      gymId INTEGER,
      rating INTEGER,
      comment TEXT,
      date TEXT,
      FOREIGN KEY (profileId) REFERENCES profiles (id),
      FOREIGN KEY (gymId) REFERENCES gyms (id)
    );
  `);

  console.log('Tables created successfully');
};

// Export the database connection so other files can use it.
export default dbPromise;


// Create a new user profile, username and password
// (this is just for signing up)
export const createProfile = async (username, password) => {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO profiles (username, password) VALUES (?, ?)',
    [username, password]
  );
};

// Check to see if username and password match
export const profileLogin = async (username, password) => {
  const db = await dbPromise;
  const result = await db.getAllAsync(
    'SELECT * FROM profiles WHERE username = ? AND password = ?',
    [username, password]
  );
  return result[0]; // Returns profile
};



// load all gyms on the homescreen
export const loadGyms = async () => {
  const db = await dbPromise;
  const gyms = await db.getAllAsync('SELECT * FROM gyms');
  return gyms;
};

// hardcoded gym names from google
export const inputGyms = async () => {
  const db = await dbPromise;
  const gyms = [
    { name: 'In-Shape Health Clubs', address: '4100 Ming Ave, Bakersfield, CA' },
    { name: 'Crunch Fitness', address: '3761 Ming Ave, Bakersfield, CA' },
    { name: 'Planet Fitness', address: '3120 Coffee Rd, Bakersfield, CA' },
    { name: '24 Hour Fitness', address: '3550 Coffee Rd, Bakersfield, CA' },
    { name: 'Orangetheory Fitness', address: '5201 California Ave, Bakersfield, CA' },
    { name: 'Anytime Fitness', address: '8200 Stockdale Hwy Ste F-4, Bakersfield, CA' },
    { name: 'GB3 Fitness', address: '8530 Wible Rd, Bakersfield, CA' },
    { name: 'Fit For Life Gym', address: '4300 Stine Rd, Bakersfield, CA' },
    { name: 'The Strength Factory', address: '6600 District Blvd #A, Bakersfield, CA' },
    { name: 'Body Xchange Sports Club', address: '5100 California Ave, Bakersfield, CA' },
    { name: 'Iron Works Gym', address: '2104 Eye St, Bakersfield, CA' },
    { name: 'CrossFit Rosedale', address: '10705 Rosedale Hwy, Bakersfield, CA' },
    { name: 'Planet Fitness East Bakersfield', address: '2220 Chester Ave, Bakersfield, CA' },
    { name: 'EōS Fitness', address: '4025 Riverlakes Dr, Bakersfield, CA' },
    { name: 'Bakersfield Boxing & Fitness', address: '2500 Brundage Ln, Bakersfield, CA' },
  ];

  // Insert each gym into the database — if it already exists, skip it.
  for (const g of gyms) {
    await db.runAsync(
      'INSERT OR IGNORE INTO gyms (name, address, rating) VALUES (?, ?, ?)',
      [g.name, g.address, 0]
    );
  }
};


// Add a new review to the database, uses a user id and gym id
export const addReview = async (profileId, gymId, rating, comment, date) => {
  const db = await dbPromise;
  await db.runAsync(
    'INSERT INTO reviews (profileId, gymId, rating, comment, date) VALUES (?, ?, ?, ?, ?)',
    [profileId, gymId, rating, comment, date]
  );
};

// loads all reviews for a certain gym that is clicked on
export const gymReviews = async (gymId) => {
  const db = await dbPromise;
  const reviews = await db.getAllAsync(
    'SELECT r.*, p.username FROM reviews r JOIN profiles p ON r.profileId = p.id WHERE r.gymId = ?',
    [gymId]
  );
  return reviews;
};

// load reviews that match a profile ID
export const getUserReviews = async (profileId) => {
  const db = await dbPromise;
  const reviews = await db.getAllAsync(
    `SELECT r.*, g.name AS gymName 
     FROM reviews r 
     JOIN gyms g ON r.gymId = g.id 
     WHERE r.profileId = ? 
     ORDER BY r.id DESC`,
    [profileId]
  );
  return reviews;
};

// Update a review
export const updateReview = async (id, rating, comment) => {
  const db = await dbPromise;
  await db.runAsync(
    'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
    [rating, comment, id]
  );
};

// Delete a review
export const deleteReview = async (id) => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM reviews WHERE id = ?', [id]);
};


// Delete all gyms, used in testing keeping just in case 
export const clearGyms = async () => {
  const db = await dbPromise;
  await db.execAsync('DELETE FROM gyms;');
  console.log('All gyms cleared');
};

// Reset the entire gyms table, once again for testing 
export const resetGymsTable = async () => {
  const db = await dbPromise;

  // Delete old gyms table completely, for testing 
  await db.execAsync("DROP TABLE IF EXISTS gyms;");

  // make sure there is no duplicates 
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS gyms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      address TEXT,
      rating REAL
    );
  `);

  console.log("Gyms table reset with unique constraint");
};

