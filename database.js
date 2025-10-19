import { openDatabaseAsync } from 'expo-sqlite';

// open database
const dbPromise = openDatabaseAsync('swolemates.db');


// Create all tables

export const setupDatabase = async () => {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
    
    CREATE TABLE IF NOT EXISTS gyms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      rating REAL
    );

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

  console.log(' Tables created successfully');
};

export default dbPromise;



// Profile functions

export const createProfile = async (username, password) => {
    const db = await dbPromise;
    await db.runAsync(
      'INSERT INTO profiles (username, password) VALUES (?, ?)',
      [username, password]
    );
  };
  
  export const profileLogin = async (username, password) => {
    const db = await dbPromise;
    const result = await db.getAllAsync(
      'SELECT * FROM profiles WHERE username = ? AND password = ?',
      [username, password]
    );
    return result[0]; // first matching profile
  };
  
 
  //  Gym functions
 
  export const loadGyms = async () => {
    const db = await dbPromise;
    const gyms = await db.getAllAsync('SELECT * FROM gyms');
    return gyms;
  };
  
  export const inputGyms = async () => {
    const db = await dbPromise;
    const gyms = [
      { name: 'In-Shape Health Clubs', address: '4100 Ming Ave, Bakersfield, CA' },
      { name: 'Crunch Fitness', address: '3761 Ming Ave, Bakersfield, CA' },
      { name: 'Planet Fitness', address: '3120 Coffee Rd, Bakersfield, CA' },
    ];
  
    for (const g of gyms) {
      await db.runAsync(
        'INSERT OR IGNORE INTO gyms (name, address, rating) VALUES (?, ?, ?)',
        [g.name, g.address, 0]
      );
    }
  };
  
  
  //  Review functions
  
  export const addReview = async (profileId, gymId, rating, comment, date) => {
    const db = await dbPromise;
    await db.runAsync(
      'INSERT INTO reviews (profileId, gymId, rating, comment, date) VALUES (?, ?, ?, ?, ?)',
      [profileId, gymId, rating, comment, date]
    );
  };
  
  export const gymReviews = async (gymId) => {
    const db = await dbPromise;
    const reviews = await db.getAllAsync(
      'SELECT r.*, p.username FROM reviews r JOIN profiles p ON r.profileId = p.id WHERE r.gymId = ?',
      [gymId]
    );
    return reviews;
  };
  
  