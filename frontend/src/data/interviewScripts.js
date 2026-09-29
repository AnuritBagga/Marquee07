// Scripted interview sequences for the demo flow.
// Each step has: ai (interviewer prompt), candidateHint (sample answer placeholder),
// optional code snippet shown on the right panel, optional followUp question.

export const DOMAINS = [
  {
    id: "dsa",
    title: "DSA & Algorithms",
    blurb: "Linked lists, trees, dynamic programming. Code defended.",
    cinematic: "01 — The Code Room",
    tone: "Senior engineer · sharp",
    duration: "~6 min",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "system",
    title: "System Design",
    blurb: "Scale a feature on a whiteboard. Trade-offs in real time.",
    cinematic: "02 — The Whiteboard",
    tone: "Staff engineer · architectural",
    duration: "~8 min",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "upsc",
    title: "UPSC Personality Test",
    blurb: "Ethics, governance, current affairs. Composure tested.",
    cinematic: "03 — The Panel",
    tone: "Board chairperson · poised",
    duration: "~7 min",
    image:
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "behavioral",
    title: "Behavioral & Leadership",
    blurb: "Conflict, ownership, ambiguity. Stories under fire.",
    cinematic: "04 — The Quiet Room",
    tone: "VP of People · empathic",
    duration: "~5 min",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
  },
];

export const SCRIPTS = {
  dsa: {
    label: "DSA & Algorithms",
    interviewer: "Riya Menon · Senior Engineer",
    interviewerTitle: "Senior Engineer · Northwind Labs",
    portrait:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&h=1100&q=85",
    steps: [
      {
        question:
          "Welcome. Let's start simple — given a linked list, how would you detect a cycle?",
        candidate:
          "I'd use Floyd's tortoise and hare — two pointers, slow moves one step, fast moves two. If they meet, there's a cycle.",
        code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False`,
      },
      {
        question:
          "Good. Why does this work mathematically? Convince me the pointers must collide if a cycle exists.",
        candidate:
          "Once both pointers are inside the cycle, the fast pointer gains exactly one step on slow per iteration. Since the cycle length is finite, the gap closes to zero in at most C iterations.",
      },
      {
        question:
          "Interesting. Now — what is the space complexity of using a hash set instead? And when would you pick that over Floyd's?",
        candidate:
          "Hash set would be O(n) space, O(n) time — useful when we also need the entry node of the cycle in one pass, or for debugging visibility.",
      },
      {
        question:
          "Sharp. Last one — modify your code to return the node where the cycle begins.",
        candidate:
          "After they meet, reset one pointer to head. Move both at equal speed; they meet at the cycle entry.",
        code: `def cycle_entry(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow == fast:
            slow = head
            while slow != fast:
                slow, fast = slow.next, fast.next
            return slow
    return None`,
      },
    ],
    closing:
      "Strong reasoning — especially the proof. We'd want you to also benchmark against tail-recursive variants in the next round.",
  },
  system: {
    label: "System Design",
    interviewer: "Karan Iyer · Staff Engineer",
    interviewerTitle: "Staff Engineer · Helix & Co.",
    portrait:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&h=1100&q=85",
    steps: [
      {
        question:
          "Design a URL shortener that handles a billion requests a day. Where do you begin?",
        candidate:
          "I'd start with the read/write ratio — likely 100:1 — which tells me to cache aggressively. Then I'd choose a key generation strategy: base62 over an auto-increment ID, distributed by a Snowflake-style service.",
      },
      {
        question:
          "Why base62 over a hash like MD5 truncated to 7 characters?",
        candidate:
          "Predictable length, no collision handling, and the ID space is dense — we don't waste keys. MD5 truncation would force probabilistic collision retries.",
      },
      {
        question:
          "Walk me through your storage layer. Postgres or a KV store?",
        candidate:
          "KV store like DynamoDB or Redis-backed. The access pattern is purely lookup-by-key. We don't need joins, and we want sub-10ms reads at the 99th percentile.",
      },
      {
        question:
          "Now — analytics. The product team wants per-link click counts in near real-time. How do you avoid hammering the KV store on every redirect?",
        candidate:
          "Fire-and-forget Kafka event on each redirect, batch-aggregated into a columnar store like ClickHouse every 30 seconds. The redirect path stays read-only and fast.",
      },
    ],
    closing:
      "Good system instincts. Next round we'd push on regional failover and cache invalidation strategies.",
  },
  upsc: {
    label: "UPSC Personality Test",
    interviewer: "Dr. Mehta · Board Chairperson",
    interviewerTitle: "Board Chairperson · UPSC",
    portrait:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=900&h=1100&q=85",
    steps: [
      {
        question:
          "Tell us — what does the phrase 'public service' mean to you, in one sentence?",
        candidate:
          "It is the discipline of placing the dignity of strangers above one's own convenience, every day.",
      },
      {
        question:
          "Beautifully put. But would you say a civil servant who quietly bends a rule to help a poor citizen is a hero, or a problem?",
        candidate:
          "A problem disguised as a hero, sir. The bent rule becomes precedent. The next bend benefits someone less deserving — and the system erodes.",
      },
      {
        question:
          "Strong answer. Suppose your senior officer asks you to do something unethical. What do you do — in the moment?",
        candidate:
          "I would seek clarity first in private, document the directive, and if it stands, refuse it formally in writing. I would not perform it, and I would notify the next reporting layer.",
      },
      {
        question:
          "And if it costs you your career?",
        candidate:
          "Then it costs me my career. Service is not a paycheck. If I cannot decline an unethical order, I have already left the service in spirit.",
      },
    ],
    closing:
      "Composed and principled. The board appreciates the clarity of your moral framework — though we would test it harder in follow-up scenarios.",
  },
  behavioral: {
    label: "Behavioral & Leadership",
    interviewer: "Anya Kapoor · VP of People",
    interviewerTitle: "VP of People · Atlas Dynamics",
    portrait:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&h=1100&q=85",
    steps: [
      {
        question:
          "Tell me about a time you disagreed with a teammate, strongly. What did you do?",
        candidate:
          "On a launch deadline, our designer wanted to ship without accessibility audits. I asked them to walk me through what we'd lose by waiting two days. We waited. The audit caught a screen-reader bug that would have embarrassed us publicly.",
      },
      {
        question:
          "What if they had refused to wait?",
        candidate:
          "I'd escalate — not to overrule them, but to bring in our product lead to weigh in with data. Disagreements should resolve in daylight, not in DMs.",
      },
      {
        question:
          "When was the last time you were genuinely wrong about a decision?",
        candidate:
          "Last quarter, I pushed for a monorepo migration. I underestimated CI cost. I had to publicly walk it back to the team. The hardest part was admitting I had been impatient.",
      },
      {
        question:
          "What did you learn from that?",
        candidate:
          "To pre-mortem before pre-announcing. Now I write down 'why this is wrong' before I write 'why this is right.'",
      },
    ],
    closing:
      "Self-aware and structured. We'd love to see how you handle peer feedback in a follow-up session.",
  },
};
