import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('swolemates.db');


// Create all tables

export const setupDatabase = () => {
    db.transaction(tx => {
      // Profiles
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        );`
      );
  
      // Gyms (removed "type")
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS gyms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          address TEXT,
          rating REAL
        );`
      );
  
      // Reviews
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profileId INTEGER,
          gymId INTEGER,
          rating INTEGER,
          comment TEXT,
          date TEXT,
          FOREIGN KEY (profileId) REFERENCES profiles (id),
          FOREIGN KEY (gymId) REFERENCES gyms (id)
        );`
      );
    },
    (error) => console.log('Error creating tables:', error),
    () => console.log('Tables created successfully'));
  };


// Profile functions

export const createProfile = (username, password, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO profiles (username, password) VALUES (?, ?)',
      [username, password],
      (_, result) => callback(result.insertId),
      (_, error) => console.log(error)
    );
  });
};

export const profileLogin = (username, password, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM profiles WHERE username = ? AND password = ?',
      [username, password],
      (_, { rows }) => callback(rows._array[0]),
      (_, error) => console.log(error)
    );
  });
};


// Gym functions

export const loadGyms = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM gyms',
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log(error)
    );
  });
};

export const inputGyms = () => {
    const gyms = [
      { name: 'In-Shape Health Clubs', address: '4100 Ming Ave, Bakersfield, CA' },
      { name: 'Crunch Fitness', address: '3761 Ming Ave, Bakersfield, CA' },
      { name: 'Planet Fitness', address: '3120 Coffee Rd, Bakersfield, CA' },
    ];
  
    db.transaction(tx => {
      gyms.forEach(g => {
        tx.executeSql(
          'INSERT OR IGNORE INTO gyms (name, address, rating) VALUES (?, ?, ?)',
          [g.name, g.address, 0]
        );
      });
    });
  };


//  Review functions

export const addReview = (profileId, gymId, rating, comment, date, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO reviews (profileId, gymId, rating, comment, date) VALUES (?, ?, ?, ?, ?)',
      [profileId, gymId, rating, comment, date],
      (_, result) => callback(result.insertId),
      (_, error) => console.log(error)
    );
  });
};

export const gymReviews = (gymId, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT r.*, p.username FROM reviews r JOIN profiles p ON r.profileId = p.id WHERE r.gymId = ?',
      [gymId],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log(error)
    );
  });
};

export default db;
