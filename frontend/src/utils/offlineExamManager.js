/**
 * Offline Exam Manager
 * Handles TRUE offline mode - laptop WiFi must be physically OFF
 */

class OfflineExamManager {
  constructor() {
    this.DB_NAME = 'MarqueeOfflineDB';
    this.DB_VERSION = 1;
    this.db = null;
  }

  /**
   * Initialize IndexedDB for offline storage
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store exam data
        if (!db.objectStoreNames.contains('exams')) {
          db.createObjectStore('exams', { keyPath: 'examId' });
        }

        // Store student answers
        if (!db.objectStoreNames.contains('answers')) {
          db.createObjectStore('answers', { keyPath: 'examId' });
        }

        // Store offline submissions
        if (!db.objectStoreNames.contains('submissions')) {
          const submissionStore = db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
          submissionStore.createIndex('examId', 'examId', { unique: false });
          submissionStore.createIndex('submitted', 'submitted', { unique: false });
        }
      };
    });
  }

  /**
   * Check if REALLY offline (not just DevTools)
   */
  async checkRealOfflineStatus() {
    console.log("🔍 Checking offline status...");
    console.log("navigator.onLine:", navigator.onLine);
    
    // IMPORTANT: Use timestamp to prevent Service Worker caching
    const timestamp = Date.now();
    const testUrl = `https://www.google.com/favicon.ico?t=${timestamp}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(testUrl, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      clearTimeout(timeoutId);
      console.log("✅ Network request succeeded - ONLINE");
      return { isOffline: false, method: 'network-request-success' };
    } catch (error) {
      console.log("❌ Network request failed - OFFLINE");
      console.log("Error:", error.message);
      
      // Double-check: if navigator says offline too, definitely offline
      if (!navigator.onLine) {
        console.log("✅ Confirmed offline (navigator.onLine also false)");
        return { isOffline: true, method: 'network-request-failed-confirmed', error: error.message };
      }
      
      // If fetch failed, we're truly offline
      return { isOffline: true, method: 'network-request-failed', error: error.message };
    }
  }

  /**
   * Save exam data for offline use (while online)
   */
  async saveExamForOffline(examData) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['exams'], 'readwrite');
      const store = transaction.objectStore('exams');
      const request = store.put(examData);

      request.onsuccess = () => {
        console.log('✅ Exam saved for offline use:', examData.examId);
        // Also save to localStorage as backup
        localStorage.setItem(`exam_${examData.examId}`, JSON.stringify(examData));
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Load exam data (works offline)
   */
  async loadExamData(examId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['exams'], 'readonly');
      const store = transaction.objectStore('exams');
      const request = store.get(examId);

      request.onsuccess = () => {
        if (request.result) {
          console.log('✅ Exam loaded from IndexedDB:', examId);
          resolve(request.result);
        } else {
          // Try localStorage as fallback
          const backup = localStorage.getItem(`exam_${examId}`);
          if (backup) {
            console.log('✅ Exam loaded from localStorage backup:', examId);
            resolve(JSON.parse(backup));
          } else {
            reject(new Error('Exam not found in offline storage'));
          }
        }
      };

      request.onerror = () => {
        // Try localStorage as fallback
        const backup = localStorage.getItem(`exam_${examId}`);
        if (backup) {
          resolve(JSON.parse(backup));
        } else {
          reject(request.error);
        }
      };
    });
  }

  /**
   * Save answer (works offline)
   */
  async saveAnswer(examId, questionId, answer) {
    if (!this.db) await this.initDB();

    const answersKey = `answers_${examId}`;
    
    // Load existing answers
    let answers = {};
    try {
      const transaction = this.db.transaction(['answers'], 'readonly');
      const store = transaction.objectStore('answers');
      const request = store.get(examId);
      
      answers = await new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result?.answers || {});
        request.onerror = () => resolve({});
      });
    } catch (error) {
      console.warn('Failed to load answers from IndexedDB, using empty object');
    }

    // Update answer
    answers[questionId] = {
      answer,
      timestamp: Date.now()
    };

    // Save to IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['answers'], 'readwrite');
      const store = transaction.objectStore('answers');
      const request = store.put({ examId, answers });

      request.onsuccess = () => {
        console.log('✅ Answer saved offline:', questionId);
        // Also save to localStorage as backup
        localStorage.setItem(answersKey, JSON.stringify(answers));
        resolve(request.result);
      };

      request.onerror = () => {
        // Fallback to localStorage
        localStorage.setItem(answersKey, JSON.stringify(answers));
        resolve();
      };
    });
  }

  /**
   * Load all answers (works offline)
   */
  async loadAnswers(examId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve) => {
      const transaction = this.db.transaction(['answers'], 'readonly');
      const store = transaction.objectStore('answers');
      const request = store.get(examId);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.answers || {});
        } else {
          // Try localStorage as fallback
          const backup = localStorage.getItem(`answers_${examId}`);
          resolve(backup ? JSON.parse(backup) : {});
        }
      };

      request.onerror = () => {
        // Try localStorage as fallback
        const backup = localStorage.getItem(`answers_${examId}`);
        resolve(backup ? JSON.parse(backup) : {});
      };
    });
  }

  /**
   * Save submission for later upload (when back online)
   */
  async saveOfflineSubmission(examId, answers, metadata) {
    if (!this.db) await this.initDB();

    const submission = {
      examId,
      answers,
      metadata,
      timestamp: Date.now(),
      submitted: false
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      const request = store.add(submission);

      request.onsuccess = () => {
        console.log('✅ Submission saved offline, will upload when online');
        // Also save to localStorage as backup
        localStorage.setItem(`submission_${examId}`, JSON.stringify(submission));
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Upload pending submissions when back online
   */
  async uploadPendingSubmissions() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      const index = store.index('submitted');
      const request = index.openCursor(IDBKeyRange.only(false));

      const submissions = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          submissions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(submissions);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Mark submission as uploaded
   */
  async markSubmissionUploaded(submissionId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      const request = store.get(submissionId);

      request.onsuccess = () => {
        const submission = request.result;
        if (submission) {
          submission.submitted = true;
          const updateRequest = store.put(submission);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear exam data after successful submission
   */
  async clearExamData(examId) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(['exams', 'answers'], 'readwrite');
    
    transaction.objectStore('exams').delete(examId);
    transaction.objectStore('answers').delete(examId);

    // Also clear localStorage
    localStorage.removeItem(`exam_${examId}`);
    localStorage.removeItem(`answers_${examId}`);
    localStorage.removeItem(`submission_${examId}`);

    console.log('✅ Exam data cleared:', examId);
  }
}

// Export singleton instance
const offlineExamManager = new OfflineExamManager();
export default offlineExamManager;
