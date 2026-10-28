/**
 * Clear Exam Data Script
 * Run this in browser console to clear all exam data
 */

(function() {
  console.log("🧹 Clearing all exam data...");
  
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  const examKeys = keys.filter(k => k.includes('exam'));
  
  console.log(`Found ${examKeys.length} exam-related keys:`, examKeys);
  
  // Clear all exam-related data
  examKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Cleared: ${key}`);
  });
  
  console.log("✨ All exam data cleared!");
  console.log("🔄 Refreshing page...");
  
  // Refresh page
  setTimeout(() => {
    location.reload();
  }, 1000);
})();
