export const initialCuratedResources = [
  {
    id: 'res-cs-notes',
    title: 'Core Computer Science Handwritten Study Notes (OS, DBMS, Networks, OOP)',
    category: 'Core CS Study Notes',
    role: 'SDE',
    company: 'All Companies',
    description: 'Comprehensive handwritten review notes covering Operating Systems (Virtual Memory & Deadlocks), DBMS (SQL, ACID & B+ Tree Indexing), Computer Networks (TCP/IP & HTTPS), and Object-Oriented Design (SOLID).',
    topics: [
      'OS Virtual Memory, Paging & Page Replacement (LRU/FIFO)',
      '4 Conditions for Deadlock & Banker\'s Avoidance Algorithm',
      'DBMS Normalization (1NF, 2NF, 3NF, BCNF) & SQL Joins',
      'ACID Properties, Transaction Isolation Levels & Dirty Reads',
      'B+ Tree Indexing vs Hash Indexing in High-Scale Databases',
      'TCP 3-Way Handshake, TCP vs UDP, and TLS Handshake',
      'SOLID Principles with C++ / Java Code Snippets',
    ],
    link: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
    notes: `### 📌 Operating Systems (OS) Cheatsheet
1. **Deadlock Conditions (Coffman Conditions)**:
   - Mutual Exclusion: Only one process can use a resource at a time.
   - Hold and Wait: A process holds at least one resource and is waiting for additional resources.
   - No Preemption: Resources cannot be forcibly taken from a process.
   - Circular Wait: A closed loop exists where each process waits for a resource held by the next.
   - *Avoidance*: Banker's Algorithm (checks if allocating resources leaves system in a safe state).

2. **Process vs Thread vs Coroutine**:
   - Process: Independent execution unit with its own virtual memory address space. Expensive context switch.
   - Thread: Light-weight unit within a process sharing the same heap and data segment, but having its own stack and registers.
   - Coroutine: User-space cooperative multitasking with negligible overhead.

3. **Virtual Memory & Paging**:
   - Page Fault occurs when a program accesses a memory page not currently mapped in physical RAM.
   - Belady's Anomaly: In FIFO page replacement, increasing page frames can paradoxically increase page faults. Optimal is LRU or Clock algorithm.

---
### 📌 Database Management Systems (DBMS) Cheatsheet
1. **ACID Properties**:
   - **A**tomicity: All operations in a transaction succeed, or none do (Rollback via WAL logs).
   - **C**onsistency: Data must satisfy all defined schema constraints and invariants.
   - **I**solation: Concurrent transactions execute without interfering (Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
   - **D**urability: Once committed, changes survive crashes (saved to non-volatile disk/redo log).

2. **B+ Tree Indexing vs Hash Indexing**:
   - B+ Trees store all actual data in leaf nodes linked sequentially, enabling efficient range queries (\`WHERE age BETWEEN 20 AND 30\`) with $O(\\log N)$ lookup.
   - Hash Indexes provide $O(1)$ point lookups (\`WHERE id = 42\`) but cannot perform range scans.

3. **Normalization**:
   - 1NF: Atomic values only; no repeating groups.
   - 2NF: 1NF + no partial dependency on a composite primary key.
   - 3NF: 2NF + no transitive dependencies (non-key attribute depends on another non-key).

---
### 📌 Computer Networks (CN) Cheatsheet
1. **TCP 3-Way Handshake**:
   - Client sends \`SYN\` (seq = x)
   - Server responds with \`SYN-ACK\` (seq = y, ack = x + 1)
   - Client sends \`ACK\` (ack = y + 1) -> Connection Established!

2. **TCP vs UDP**:
   - TCP: Connection-oriented, ordered delivery, flow control (Sliding Window), congestion control. Used for HTTP, WebSockets, SSH.
   - UDP: Connectionless, lightweight, no delivery guarantee, minimal latency. Used for DNS, video streaming, online gaming.`,
    referenceLinks: [
      { title: 'GeeksforGeeks Operating Systems Last Minute Notes', url: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/' },
      { title: 'Gate Vidyalay DBMS Normalization & Indexing Guide', url: 'https://www.gatevidyalay.com/database-management-system/' },
      { title: 'Stanford CS144 Computer Networks Notes', url: 'https://cs144.github.io/' },
    ],
    contributor: 'Karan Mehra (Microsoft SWE & Mentor)',
    rating: 4.9,
    downloads: 4120,
    date: 'Oct 2026',
  },
  {
    id: 'res-interview-guide',
    title: 'Technical & HR Behavioral Interview Handbook (STAR Method)',
    category: 'Interview Prep Guides',
    role: 'All Roles',
    company: 'Google, Amazon, Microsoft, Deloitte',
    description: 'Battle-tested frameworks for answering behavioral, conflict resolution, leadership, and system design questions with high-impact quantifiable storytelling.',
    topics: [
      'STAR Framework: Situation, Task, Action, and Measurable Result',
      'Amazon 16 Leadership Principles & Example Anecdotes',
      'Handling Disagreements with Teammates (Disagree and Commit)',
      'Explaining a Failed Project & Constructive Retrospective',
      'System Design Communication Structure (Functional vs Non-Functional)',
      'Questions to Ask the Interviewer at the End of the Round',
    ],
    link: 'https://careers.google.com/how-we-hire/interviewing/',
    notes: `### 📌 The STAR Framework for Behavioral Rounds
- **Situation (15%)**: Set the background concisely. Mention the company/project, deadline, and technical stakes.
- **Task (15%)**: State the explicit challenge or objective you were responsible for solving.
- **Action (50%)**: Explain YOUR individual contribution. Use "I" rather than "we". Walk through the design decisions, trade-offs, and how you overcame hurdles.
- **Result (20%)**: Highlight quantifiable metrics (e.g. "Reduced API response latency from 450ms to 85ms", "Delivered 2 days ahead of sprint deadline", "Decreased cloud compute cost by 18%").

### 📌 Amazon Leadership Principles Scenarios:
1. **Customer Obsession**: Start with the customer problem first and invent backwards.
2. **Ownership**: Act on behalf of the entire company, not just your team. Never say "that's not my job".
3. **Bias for Action**: Speed matters in software. Many decisions are two-way doors and reversible.`,
    referenceLinks: [
      { title: 'Google Interviewing Process Guide', url: 'https://careers.google.com/how-we-hire/interviewing/' },
      { title: 'Amazon Leadership Principles Official Guide', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles' },
      { title: 'Harvard Career Services Behavioral Interview Rubric', url: 'https://careerservices.fas.harvard.edu/' },
    ],
    contributor: 'Priya Sundaram (Senior Tech Recruiter & Coach)',
    rating: 4.9,
    downloads: 3250,
    date: 'Oct 2026',
  },
  {
    id: 'res-dsa-sheet',
    title: 'Top 180 DSA Practice Sheets (Striver / Love Babbar)',
    category: 'DSA Practice Sheets',
    role: 'SDE',
    company: 'Google, Amazon, Flipkart, Uber',
    description: 'Complete problem sets covering Arrays, Two Pointers, Sliding Window, Trees, Graphs, Dynamic Programming, and LRU Cache implementations.',
    topics: [
      'Arrays & Two Pointers (3Sum, Trapping Rainwater)',
      'Sliding Window & Monotonic Stack (Next Greater Element)',
      'Binary Search on Answer (Koko Eating Bananas, Aggressive Cows)',
      'Binary Trees & BSTs (LCA, Max Path Sum, Serialization)',
      'Graphs: Multi-source BFS, Dijkstra & Topological Sort',
      'Dynamic Programming: Knapsack, LCS, LIS & Grid Paths',
    ],
    link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    notes: `### 📌 Core Algorithmic Patterns & Time Complexities
1. **Two Pointers & Sliding Window**:
   - Used for sorted arrays, contiguous subarrays, and substring problems.
   - Typical Time: $O(N)$, Space: $O(1)$ or $O(K)$.

2. **Monotonic Stack**:
   - Used for "Next Greater Element", "Largest Rectangle in Histogram", "Daily Temperatures".
   - Keeps elements in strictly increasing or decreasing order. Time: $O(N)$.

3. **Lowest Common Ancestor (Binary Tree)**:
   \`\`\`cpp
   TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
       if (!root || root == p || root == q) return root;
       TreeNode* left = lowestCommonAncestor(root->left, p, q);
       TreeNode* right = lowestCommonAncestor(root->right, p, q);
       if (left && right) return root;
       return left ? left : right;
   }
   \`\`\`
4. **Graph BFS (Rotten Oranges)**:
   - Push all initially rotten oranges into a queue with timestamp 0.
   - Dequeue level by level, decrementing fresh count. When queue is empty, if fresh count is 0, return elapsed time.`,
    referenceLinks: [
      { title: 'Striver A2Z DSA Course & Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
      { title: 'NeetCode 150 Practice Roadmap', url: 'https://neetcode.io/practice' },
      { title: 'Love Babbar 450 DSA Sheet', url: 'https://450dsa.com/' },
    ],
    contributor: 'Rahul Sharma (Google SDE-II)',
    rating: 4.9,
    downloads: 5120,
    date: 'Oct 2026',
  },
  {
    id: 'res-oa-archives',
    title: 'Company Online Assessment (OA) Archives 2025-2026',
    category: 'Previous OA Questions',
    role: 'SDE',
    company: 'Google, Amazon, Flipkart, Uber',
    description: 'Archive of actual Online Assessment coding challenges asked during recent campus and off-campus hiring drives with constraints and edge test cases.',
    topics: [
      'Meeting Rooms II (Min Heap intervals)',
      'Alien Dictionary (Topological Sort with cycle check)',
      'Rotten Oranges (Multi-source BFS)',
      'Frog Jump (Dynamic Programming with jump constraints)',
      'Subarray with Maximum Product (Kadane variant with min/max tracking)',
    ],
    link: 'https://leetcode.com/discuss/interview-question',
    notes: `### 📌 OA Strategy & Scoring Rules
- In campus drives (HackerEarth, HackerRank, CodeSignal), tests penalize Time Limit Exceeded (TLE) heavily.
- Check $N$:
  - $N \\le 10$: $O(N!)$ or $O(2^N)$ backtracking.
  - $N \\le 10^3$: $O(N^2)$ dynamic programming.
  - $N \\le 10^5$: $O(N \\log N)$ sorting or $O(N)$ linear pass.
  - $N \\ge 10^9$: $O(\\log N)$ binary search or mathematical formula.`,
    referenceLinks: [
      { title: 'LeetCode Discuss Online Assessment Question Bank', url: 'https://leetcode.com/discuss/interview-question' },
      { title: 'HackerRank Interview Preparation Kit', url: 'https://www.hackerrank.com/interview/interview-preparation-kit' },
    ],
    contributor: 'Ananya Verma (Amazon SDE-I)',
    rating: 4.8,
    downloads: 2450,
    date: 'Oct 2026',
  },
  {
    id: 'res-applied-ai-roadmap',
    title: 'Applied Machine Learning & GenAI Production Roadmap',
    category: 'Learning Roadmaps',
    role: 'AI / ML',
    company: 'Ola, Uber, Adobe',
    description: 'End-to-end learning path from PyTorch fundamentals to RAG pipelines, LLM fine-tuning, vector embeddings, and low-latency inference.',
    topics: [
      'Precision vs Recall & AUC-ROC for Imbalanced Data',
      'Cross-Entropy Loss vs Focal Loss',
      'Vector Databases & Approximate Nearest Neighbors (HNSW)',
      'Retrieval-Augmented Generation (RAG) Architecture',
      'Model Drift & Evident Distribution Shifts in Production',
    ],
    link: 'https://roadmap.sh/ai-data-scientist',
    notes: `### 📌 Applied ML Interview Notes
- In fraud detection or rare event prediction, accuracy is a misleading metric. Always discuss Precision-Recall curves, F1-Score, and False Positive Rate.
- Prevent data leakage: Normalize and scale using parameters computed ONLY on the training split, never on the combined dataset.`,
    referenceLinks: [
      { title: 'Roadmap.sh AI & Data Scientist Path', url: 'https://roadmap.sh/ai-data-scientist' },
      { title: 'Hugging Face Deep Learning & NLP Course', url: 'https://huggingface.co/learn' },
      { title: 'DeepLearning.AI Production ML Specialization', url: 'https://www.deeplearning.ai/' },
    ],
    contributor: 'Dr. Siddharth Rao (AI Research Scientist)',
    rating: 4.8,
    downloads: 1890,
    date: 'Oct 2026',
  },
  {
    id: 'res-analytics-handbook',
    title: 'Product & Business Analytics SQL Case Studies Handbook',
    category: 'Interview Prep Guides',
    role: 'Analyst',
    company: 'Adobe, Goldman Sachs, Deloitte',
    description: 'Real-world business case studies with SQL queries for funnel analytics, user cohort retention, A/B testing experimentation, and guardrail metrics.',
    topics: [
      'SQL Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD',
      'Cohort Retention Tables & Churn Rate Formulas',
      'A/B Testing: Sample Size, p-values & Statistical Significance',
      'Root Cause Analysis (RCA) Framework for Metric Drops',
    ],
    link: 'https://mode.com/sql-tutorial/',
    notes: `### 📌 Analytics & SQL Cheatsheet
- \`DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)\` ranks without gaps (1, 2, 2, 3).
- \`LAG(metric, 1) OVER (ORDER BY date)\` retrieves the previous day's metric for week-over-week or day-over-day growth computation.`,
    referenceLinks: [
      { title: 'Mode Analytics Advanced SQL Tutorial', url: 'https://mode.com/sql-tutorial/' },
      { title: 'Kaggle Business Analytics Case Studies', url: 'https://www.kaggle.com/' },
    ],
    contributor: 'Sneha Patel (Goldman Sachs Senior Analyst)',
    rating: 4.9,
    downloads: 2100,
    date: 'Oct 2026',
  },
  {
    id: 'res-system-design',
    title: 'Low-Level Design (LLD) & High-Level Design (HLD) Cheatsheet',
    category: 'Interview Prep Guides',
    role: 'SDE',
    company: 'Uber, Flipkart, Google',
    description: 'Object-oriented design patterns and distributed system building blocks for SDE-1 and SDE-2 campus and off-campus interviews.',
    topics: [
      'Design Rate Limiter (Token Bucket vs Sliding Window Log)',
      'In-Memory Task Scheduler with Priority Queue',
      'Consistent Hashing & Virtual Nodes',
      'Pub/Sub Event Broker & Message Queues (Kafka vs RabbitMQ)',
    ],
    link: 'https://github.com/donnemartin/system-design-primer',
    notes: `### 📌 LLD & Design Patterns Cheatsheet
- **Rate Limiter**: Token Bucket allows bursts while maintaining constant average rate.
- **Task Scheduler**: Use a min-heap ordered by next execution timestamp. Background worker thread sleeps until top task is ready.`,
    referenceLinks: [
      { title: 'The System Design Primer by Donne Martin', url: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'Refactoring.Guru Design Patterns Illustrated', url: 'https://refactoring.guru/design-patterns' },
    ],
    contributor: 'Vikram Joshi (Uber Staff Engineer)',
    rating: 4.9,
    downloads: 3800,
    date: 'Oct 2026',
  },
  {
    id: 'res-mock-tests',
    title: 'Campus Placement Mock Assessment & Aptitude Simulator',
    category: 'Mock Test Resources',
    role: 'All Roles',
    company: 'TCS Digital, Deloitte, Capgemini',
    description: 'Timed practice tests with solutions covering quantitative aptitude, logical reasoning, verbal ability, and code snippet debugging.',
    topics: [
      'Permutations & Combinations, Probability',
      'Time, Speed, Distance & Work Equations',
      'Logical Deductions & Syllogisms',
      'C++ and Java Output & Pointer Debugging',
    ],
    link: 'https://www.indiabix.com/',
    notes: `### 📌 Speed Aptitude Tips
- Practice mental arithmetic and fraction-to-percentage conversions (e.g. 1/7 = 14.28%, 1/8 = 12.5%).
- Time management: Never spend more than 90 seconds on any single quantitative question during online screening.`,
    referenceLinks: [
      { title: 'IndiaBIX Quantitative Aptitude Questions & Answers', url: 'https://www.indiabix.com/' },
      { title: 'GeeksforGeeks Placement Mock Assessment Series', url: 'https://practice.geeksforgeeks.org/' },
    ],
    contributor: 'Campus Placement Cell Mentors',
    rating: 4.7,
    downloads: 4800,
    date: 'Sep 2026',
  },
];

export const initialInterviewExperiences = [
  {
    slug: 'google-sde-intern',
    company: 'Google',
    role: 'SDE',
    title: 'Software Engineer Intern',
    level: 'Internship',
    stipend: '₹ 1,25,000 / Month',
    difficulty: 'Hard',
    date: 'May 2025',
    location: 'Bengaluru · Campus hiring',
    duration: '3 rounds over 2 weeks',
    candidateProfile: 'B.Tech Computer Science · 2026 batch · 8.6 CGPA',
    outcome: 'Offer Accepted · Selected',
    summary: 'A rigorous algorithmic evaluation focusing on data structures, clean code, and communicating trade-offs. The candidate clarified constraints before coding and tested edge cases aloud.',
    rounds: [
      {
        name: 'Online Assessment',
        duration: '90 minutes',
        format: '2 coding problems · timed platform',
        discussion: 'Both problems emphasized arrays and sliding-window patterns with heavy performance constraints. Hidden test cases made edge boundaries critical.',
        questions: ['Merge overlapping intervals with weighted profits', 'Longest substring without repeating characters with k replacements'],
      },
      {
        name: 'Technical Interview 1',
        duration: '45 minutes',
        format: 'Live coding · Google Docs / shared editor',
        discussion: 'The interviewer asked for a straightforward solution first, then probed operation complexity and how to keep recently used items ordered using doubly linked list and hash map.',
        questions: ['Design an LRU cache with O(1) get and put', 'Discuss time and space complexity with thread-safety locks'],
      },
      {
        name: 'Technical + Behavioral',
        duration: '45 minutes',
        format: 'Problem solving · project discussion',
        discussion: 'The candidate walked through a tree solution, explained the project architecture decisions, and used a specific example to describe resolving a team disagreement.',
        questions: ['Find the lowest common ancestor in a binary tree (recursive & iterative)', 'Tell me about a time you handled a disagreement with a team member'],
      },
    ],
    hrQuestions: ['Why are you interested in Google and what would you like to achieve during this internship?', 'Tell me about a time you received difficult feedback and how you adapted.'],
    preparationTips: ['Practice explaining a brute-force approach before jumping directly into an optimal one.', 'Review trees, hash maps, heaps, and sliding-window patterns.', 'Prepare one concise project walkthrough with architectural trade-offs and your individual contribution.'],
    lessonsLearned: 'Thinking aloud helped the interviewer follow the thought process. A couple of minutes spent confirming constraints prevented rework.',
    resources: [
      {
        label: 'DSA practice sheets',
        href: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
        title: 'Top 180 DSA Practice Sheets (Striver / Love Babbar)',
        category: 'DSA Practice Sheets',
        description: 'Comprehensive problem sheet covering Arrays, Sliding Window, Trees, Graphs, and LRU Cache.',
      },
      {
        label: 'Interview prep guides',
        href: 'https://careers.google.com/how-we-hire/interviewing/',
        title: 'Technical & HR Behavioral Interview Handbook (STAR Method)',
        category: 'Interview Prep Guides',
        description: 'Framework for answering Googleyness and leadership questions using the STAR method.',
      },
      {
        label: 'Previous OA questions',
        href: 'https://leetcode.com/discuss/interview-question',
        title: 'Company Online Assessment (OA) Archives',
        category: 'Previous OA Questions',
        description: 'Actual Online Assessment challenges asked by Google campus drives with constraints.',
      },
    ],
  },
  {
    slug: 'amazon-sde-i',
    company: 'Amazon',
    role: 'SDE',
    title: 'Software Development Engineer I',
    level: 'Full-time',
    stipend: '44 LPA CTC',
    difficulty: 'Hard',
    date: 'Apr 2025',
    location: 'Hyderabad · Graduate hiring',
    duration: '4 rounds across 1 day',
    candidateProfile: 'B.E. Information Technology · 2025 batch · 1 prior internship',
    outcome: 'Offer received · Accepted',
    summary: 'A coding-heavy process paired with deep behavioral probing around Amazon Leadership Principles: Customer Obsession, Ownership, and Bias for Action.',
    rounds: [
      {
        name: 'Online Assessment',
        duration: '120 minutes',
        format: '2 coding problems · work-style questionnaire',
        discussion: 'The candidate prioritized an optimal solution, then used remaining time to explain edge cases and complete the workplace simulation.',
        questions: ['Minimum number of meeting rooms II (Priority Queue approach)', 'Array transformation with contiguous subarrays and prefix sums'],
      },
      {
        name: 'Technical Interview 1',
        duration: '60 minutes',
        format: 'Live coding · project deep dive',
        discussion: 'The interviewer asked follow-ups about input validation, BST invariant maintenance, and the candidate’s personal contributions to their capstone project.',
        questions: ['Validate a binary search tree without extra space', 'Explain an end-to-end architecture you owned and how it handled scale'],
      },
      {
        name: 'Technical Interview 2',
        duration: '60 minutes',
        format: 'Data structures · debugging scenario',
        discussion: 'The discussion covered connected components on a 2D matrix and a systematic approach to isolating latency bottlenecks in a microservice.',
        questions: ['Number of islands (DFS vs BFS memory consumption)', 'How would you debug a 504 Gateway Timeout in a distributed order service?'],
      },
      {
        name: 'Bar Raiser & Behavioral',
        duration: '45 minutes',
        format: 'Leadership Principles deep dive',
        discussion: 'Every behavioral question required answering using the STAR format with quantifiable business impact and personal lessons learned.',
        questions: ['Tell me about a time you took a calculated risk and failed', 'Describe a project where you disagreed with senior feedback and how you navigated it'],
      },
    ],
    hrQuestions: ['What excites you most about working at AWS or Amazon Retail?', 'Share an example of taking ownership far beyond your assigned task.'],
    preparationTips: ['Prepare 6-8 distinct stories mapped directly to Amazon Leadership Principles.', 'Practice explaining time and space complexity with exact Big-O notation.', 'Write modular, production-ready code with clear variable names and edge validation.'],
    lessonsLearned: 'Behavioral answers resonated much better when backed by metrics (e.g. reduced load times by 28%) rather than vague general claims.',
    resources: [
      {
        label: 'Previous OA questions',
        href: 'https://leetcode.com/discuss/interview-question',
        title: 'Company Online Assessment (OA) Archives',
        category: 'Previous OA Questions',
        description: 'Meeting Rooms II and interval problem sets asked during Amazon 2025 campus drives.',
      },
      {
        label: 'Study notes',
        href: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        title: 'Core Computer Science Handwritten Study Notes',
        category: 'Core CS Study Notes',
        description: 'Revision notes covering Deadlocks, Microservices latency isolation, and B+ Trees.',
      },
      {
        label: 'Interview prep guides',
        href: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles',
        title: 'Technical & HR Behavioral Interview Handbook (STAR Method)',
        category: 'Interview Prep Guides',
        description: 'Amazon 16 Leadership Principles response bank with quantified story templates.',
      },
    ],
  },
  {
    slug: 'flipkart-sde-intern',
    company: 'Flipkart',
    role: 'SDE',
    title: 'Software Development Engineer Intern',
    level: 'Internship',
    stipend: '₹ 1,00,000 / Month',
    difficulty: 'Hard',
    date: 'Mar 2025',
    location: 'Bengaluru · On-Campus Drive',
    duration: '3 rounds over 3 days',
    candidateProfile: 'B.Tech CSE · 2026 batch · Pre-final year · 8.9 CGPA',
    outcome: 'Offer Accepted · PPO Opportunity',
    summary: 'Focused intensely on core data structures, algorithms, and low-level object-oriented design. Interviewers appreciated clean, extensible code and proactive edge-case testing.',
    rounds: [
      {
        name: 'Online Assessment (HackerEarth)',
        duration: '90 minutes',
        format: '3 coding problems · timed platform',
        discussion: 'Problems were medium-to-hard difficulty requiring multi-source BFS and DP with memoization. All test cases cleared.',
        questions: ['Rotten Oranges with obstacle grid variant', 'Frog Jump dynamic programming with minimum energy', 'Count distinct palindromic subsequences'],
      },
      {
        name: 'Technical Round 1 (DSA & Problem Solving)',
        duration: '60 minutes',
        format: 'Live pair coding · coderpad',
        discussion: 'The interviewer tested graph traversal and asked to design a rate limiter using sliding-window logs. Discussed concurrency and race conditions.',
        questions: ['Word Ladder II (Shortest transformation sequence BFS)', 'Design an in-memory Rate Limiter with 100 requests/minute rule'],
      },
      {
        name: 'Technical Round 2 (Machine Coding & Core CS)',
        duration: '60 minutes',
        format: 'Object-Oriented Design & CS fundamentals',
        discussion: 'Designed a modular In-Memory Task Scheduler. Tested knowledge of multithreading, thread pools, and DBMS isolation levels.',
        questions: ['Low-Level Design: Task Scheduler with priority and cron execution', 'Explain ACID properties, Phantom reads, and B+ Tree indexing'],
      },
      {
        name: 'Hiring Manager & Culture',
        duration: '30 minutes',
        format: 'Conversational · Project review',
        discussion: 'Discussion on Flipkart culture, customer-first mindset, and past experience handling tight deadlines during hackathons.',
        questions: ['Why Flipkart over other e-commerce companies?', 'How do you handle production incidents under high customer traffic?'],
      },
    ],
    hrQuestions: ['Tell me about your proudest technical achievement.', 'How do you prioritize learning new frameworks alongside academic coursework?'],
    preparationTips: ['Master multi-source BFS, topological sort, and 2D dynamic programming.', 'Practice Low-Level Design (LLD) using SOLID design principles.', 'Review Java/C++ concurrency concepts like thread pools and synchronized locks.'],
    lessonsLearned: 'Writing modular classes with interfaces rather than monolithic code during LLD rounds made a huge positive impression.',
    resources: [
      {
        label: 'DSA practice sheets',
        href: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
        title: 'Top 180 DSA Practice Sheets (Striver / Love Babbar)',
        category: 'DSA Practice Sheets',
        description: 'Multi-source BFS and Dynamic Programming practice sheets.',
      },
      {
        label: 'Study notes',
        href: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        title: 'Core Computer Science Handwritten Study Notes',
        category: 'Core CS Study Notes',
        description: 'Thread pool management, ACID properties, and concurrency locking.',
      },
      {
        label: 'Previous OA questions',
        href: 'https://leetcode.com/discuss/interview-question',
        title: 'Company Online Assessment (OA) Archives',
        category: 'Previous OA Questions',
        description: 'Rotten Oranges and Word Ladder previous Flipkart OA questions.',
      },
    ],
  },
  {
    slug: 'microsoft-software-engineer',
    company: 'Microsoft',
    role: 'SDE',
    title: 'Software Engineer',
    level: 'Full-time',
    stipend: '42 LPA CTC',
    difficulty: 'Medium',
    date: 'Mar 2025',
    location: 'Bengaluru · University hiring',
    duration: '3 rounds over 1 week',
    candidateProfile: 'B.Tech Computer Science · 2025 batch · open-source contributor',
    outcome: 'Offer received · Accepted',
    summary: 'Interviewers encouraged clarifying questions and valued a thoughtful approach, clean architecture, and team collaboration over rushing to a solution.',
    rounds: [
      {
        name: 'Online Assessment',
        duration: '75 minutes',
        format: '2 Coding problems + CS fundamentals',
        discussion: 'The candidate split time between coding questions and short queries on SQL optimization and operating systems.',
        questions: ['Kth largest element in an unsorted stream (Min Heap approach)', 'SQL query for second highest salary and output reasoning'],
      },
      {
        name: 'Technical Interview 1',
        duration: '60 minutes',
        format: 'Live coding · architecture discussion',
        discussion: 'The interviewer asked the candidate to state assumptions, outline a data structure, and test the design with a small concrete example.',
        questions: ['Serialize and deserialize a binary tree into a string', 'Reverse words in a sentence maintaining in-place constant space'],
      },
      {
        name: 'Managerial & Architecture',
        duration: '45 minutes',
        format: 'Project review · collaboration discussion',
        discussion: 'The project conversation focused on architectural trade-offs, handling cloud deployment latency, and incorporating peer review feedback.',
        questions: ['Walk through a technical trade-off in your project', 'What kind of team culture helps you do your best work?'],
      },
    ],
    hrQuestions: ['Why are you interested in Microsoft Cloud + AI division?', 'Describe how you pick up an unfamiliar technology stack in under a week.'],
    preparationTips: ['Practice explaining design decisions using a small example before coding.', 'Review trees, arrays, SQL basics, and object-oriented principles.', 'Be ready to discuss a past project contribution and what you would architect differently today.'],
    lessonsLearned: 'Asking clarifying questions early made the problem constraints much clearer and prevented unnecessary rework.',
    resources: [
      {
        label: 'DSA practice sheets',
        href: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
        title: 'Top 180 DSA Practice Sheets (Striver / Love Babbar)',
        category: 'DSA Practice Sheets',
        description: 'Tree serialization, deserialization, and heap problems.',
      },
      {
        label: 'Study notes',
        href: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        title: 'Core Computer Science Handwritten Study Notes',
        category: 'Core CS Study Notes',
        description: 'SQL second highest salary queries and operating system virtual memory.',
      },
      {
        label: 'Learning roadmaps',
        href: 'https://roadmap.sh',
        title: 'Role-Based Developer Roadmaps',
        category: 'Learning Roadmaps',
        description: 'Full-stack and cloud architecture roadmaps.',
      },
    ],
  },
  {
    slug: 'uber-sde-i',
    company: 'Uber',
    role: 'SDE',
    title: 'Software Engineer I',
    level: 'Full-time',
    stipend: '48 LPA CTC',
    difficulty: 'Hard',
    date: 'Feb 2025',
    location: 'Hyderabad · Off-Campus hiring',
    duration: '4 rounds over 2 weeks',
    candidateProfile: 'B.Tech CSE · 2025 batch · competitive programmer',
    outcome: 'Offer received · Accepted',
    summary: 'Challenging technical interviews heavily testing advanced graph algorithms, concurrency, and real-time distributed system architecture.',
    rounds: [
      {
        name: 'Online Assessment (CodeSignal)',
        duration: '70 minutes',
        format: '4 problems · automated test suite',
        discussion: 'Score: 840/850. Required rapid implementation of matrix manipulations, prefix sums, and topological ordering.',
        questions: ['Alien Dictionary (Topological Sort with cycle detection)', 'Count submatrices with sum divisible by k'],
      },
      {
        name: 'Technical Round 1 (Algorithms)',
        duration: '60 minutes',
        format: 'Problem solving · live pair coding',
        discussion: 'Tested graph cycle detection and dynamic programming on trees. Discussed stack depth and memory optimization.',
        questions: ['Detect cycle in directed graph using Kahn’s algorithm', 'Binary Tree Maximum Path Sum with negative nodes'],
      },
      {
        name: 'Technical Round 2 (System & Concurrency)',
        duration: '60 minutes',
        format: 'Low-Level Design & Concurrency',
        discussion: 'Design a location ping accumulator for millions of concurrent drivers. Probed caching, geo-hashing (H3 index), and mutex locks.',
        questions: ['LLD: Real-time driver location service with H3 Geo-hashing', 'Explain optimistic vs pessimistic locking in concurrent transactions'],
      },
      {
        name: 'Bar Raiser & Values',
        duration: '45 minutes',
        format: 'Culture fit & past experience',
        discussion: 'Evaluated resilience, ability to thrive in ambiguity, and customer obsession under tight production deadlines.',
        questions: ['Describe a time you navigated an ambiguous problem statement', 'How do you ensure system reliability during sudden demand spikes?'],
      },
    ],
    hrQuestions: ['Why Uber and how do you align with our engineering culture?', 'Tell me about a time you made an engineering mistake in production and how you rectified it.'],
    preparationTips: ['Thoroughly master Graph algorithms: Topological Sort, Dijkstra, and Disjoint Set Union (DSU).', 'Understand Geo-hashing and Quad-trees for geospatial queries.', 'Practice live coding under time pressure while explaining your thought process.'],
    lessonsLearned: 'Explaining why a data structure was chosen over alternatives (e.g. why Min Heap instead of Sort) showed depth of knowledge.',
    resources: [
      {
        label: 'DSA practice sheets',
        href: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
        title: 'Top 180 DSA Practice Sheets (Striver / Love Babbar)',
        category: 'DSA Practice Sheets',
        description: 'Advanced graph algorithms, topological sorting, and shortest path.',
      },
      {
        label: 'Previous OA questions',
        href: 'https://leetcode.com/discuss/interview-question',
        title: 'Company Online Assessment (OA) Archives',
        category: 'Previous OA Questions',
        description: 'CodeSignal and HackerRank Uber previous OA problem sets.',
      },
      {
        label: 'Study notes',
        href: 'https://github.com/donnemartin/system-design-primer',
        title: 'Low-Level Design (LLD) & High-Level Design (HLD) Cheatsheet',
        category: 'Interview Prep Guides',
        description: 'Geo-hashing, distributed locks, and real-time streaming architectures.',
      },
    ],
  },
  {
    slug: 'goldman-sachs-analyst',
    company: 'Goldman Sachs',
    role: 'Analyst',
    title: 'Quantitative & Data Analyst',
    level: 'Full-time',
    stipend: '₹ 1,50,000 / Mo · 32 LPA',
    difficulty: 'Hard',
    date: 'Feb 2025',
    location: 'Bengaluru · Campus recruitment',
    duration: '3 rounds over 1 day',
    candidateProfile: 'B.Tech Mathematics & Computing · 2025 batch · 9.1 CGPA',
    outcome: 'Offer received · Accepted',
    summary: 'A rigorous evaluation of probability, statistics, SQL window functions, and business acumen. Candidates must communicate mathematical reasoning with precision.',
    rounds: [
      {
        name: 'Online Assessment (HackerRank)',
        duration: '90 minutes',
        format: 'Math puzzles + SQL + 2 Coding problems',
        discussion: 'Included probability teasers, combinatorics, complex SQL joins, and dynamic programming.',
        questions: ['Two egg drop puzzle variant', 'SQL query to find top 3 transacting clients per region using DENSE_RANK', 'Subarray with maximum product'],
      },
      {
        name: 'Technical Round 1 (Math & Statistics)',
        duration: '45 minutes',
        format: 'Probability, Linear Algebra & Python',
        discussion: 'Deep dive into probability distributions, Bayes theorem, covariance matrices, and vector manipulation in NumPy/Pandas.',
        questions: ['Derive conditional probability for market price volatility', 'Write vectorized Python code to compute rolling volatility'],
      },
      {
        name: 'Technical Round 2 (Data Analytics & Risk Case)',
        duration: '45 minutes',
        format: 'Financial data case study',
        discussion: 'Case study on detecting anomalous trade execution patterns. Discussed false-positive trade-offs and latency requirements.',
        questions: ['How would you identify insider trading anomalies in transaction logs?', 'Explain how you would handle missing data in financial time series'],
      },
      {
        name: 'Director & Culture Round',
        duration: '30 minutes',
        format: 'Values, integrity & collaboration',
        discussion: 'Discussion on work ethic, precision in risk models, and Goldman Sachs cultural principles.',
        questions: ['Tell me about a high-stress project and how you stayed detail-oriented', 'Why Quantitative Analytics in investment banking?'],
      },
    ],
    hrQuestions: ['What do you hope to learn during your first year at Goldman Sachs?', 'Describe a time you had to defend an analytical conclusion to senior stakeholders.'],
    preparationTips: ['Master 50 Challenging Problems in Probability by Mosteller.', 'Practice SQL window functions: ROW_NUMBER, RANK, DENSE_RANK, and LAG/LEAD.', 'Be comfortable explaining linear regression assumptions and statistical p-values.'],
    lessonsLearned: 'Structuring the analysis into clear hypotheses before writing any query demonstrated structured analytical thinking.',
    resources: [
      {
        label: 'Study notes',
        href: 'https://mode.com/sql-tutorial/',
        title: 'Product & Business Analytics SQL Case Studies Handbook',
        category: 'Interview Prep Guides',
        description: 'SQL window functions, rolling averages, and statistical probability questions.',
      },
      {
        label: 'Interview prep guides',
        href: 'https://careers.google.com/how-we-hire/interviewing/',
        title: 'Technical & HR Behavioral Interview Handbook (STAR Method)',
        category: 'Interview Prep Guides',
        description: 'Structuring risk recommendations under ambiguity for senior directors.',
      },
      {
        label: 'Mock test resources',
        href: 'https://www.indiabix.com/',
        title: 'Campus Placement Mock Assessment & Aptitude Simulator',
        category: 'Mock Test Resources',
        description: 'Probability and quantitative math problems for financial analysts.',
      },
    ],
  },
  {
    slug: 'adobe-product-analyst',
    company: 'Adobe',
    role: 'Analyst',
    title: 'Product Analyst',
    level: 'Full-time',
    stipend: '26 LPA CTC',
    difficulty: 'Medium',
    date: 'Feb 2025',
    location: 'Noida · Graduate hiring',
    duration: '3 rounds over 5 days',
    candidateProfile: 'B.Sc. Statistics · 2025 batch · analytics project experience',
    outcome: 'Offer received · Accepted',
    summary: 'A practical analytics interview covering SQL, product sense, A/B testing experimentation, and explaining insights to non-technical stakeholders.',
    rounds: [
      {
        name: 'Online Assessment',
        duration: '60 minutes',
        format: 'SQL · data interpretation',
        discussion: 'The candidate reviewed joins and aggregation, then explained what could and could not be inferred from a small experiment table.',
        questions: ['SQL joins and aggregation with date filtering', 'Interpret a small experiment results table and explain statistical significance'],
      },
      {
        name: 'Analytics Interview',
        duration: '45 minutes',
        format: 'SQL exercise · metric design',
        discussion: 'The interviewer asked which success metric to choose, what guardrails to monitor, and how to segment user conversion funnels.',
        questions: ['How would you measure the success of an AI auto-summarizer feature?', 'Write a SQL query for weekly active users and 7-day retention'],
      },
      {
        name: 'Product + HR',
        duration: '45 minutes',
        format: 'Product case · stakeholder communication',
        discussion: 'The candidate outlined investigation steps before proposing a root cause, and separated observed facts from initial assumptions.',
        questions: ['A core engagement metric drops 15% after launch. How do you investigate?', 'How do you make an executive recommendation with incomplete telemetry data?'],
      },
    ],
    hrQuestions: ['Tell me about a time your data analysis directly influenced a product decision.', 'How do you explain a complex statistical model to a non-technical marketing lead?'],
    preparationTips: ['Practice joins, grouping, and date-based window queries in SQL.', 'For product cases, define the user, business goal, primary metric, and guardrails.', 'State hypotheses clearly and propose next validation steps when data is ambiguous.'],
    lessonsLearned: 'A good metric answer always included a primary measure and at least one guardrail rather than an isolated vanity number.',
    resources: [
      {
        label: 'Study notes',
        href: 'https://mode.com/sql-tutorial/',
        title: 'Product & Business Analytics SQL Case Studies Handbook',
        category: 'Interview Prep Guides',
        description: 'Cohort retention tables, date joins, and A/B testing statistical power.',
      },
      {
        label: 'Interview prep guides',
        href: 'https://careers.google.com/how-we-hire/interviewing/',
        title: 'Technical & HR Behavioral Interview Handbook (STAR Method)',
        category: 'Interview Prep Guides',
        description: 'Root cause analysis frameworks and stakeholder communication templates.',
      },
    ],
  },
  {
    slug: 'ola-applied-ai-intern',
    company: 'Ola',
    role: 'AI / ML',
    title: 'Applied AI Intern',
    level: 'Internship',
    stipend: '₹ 50,000 / Month',
    difficulty: 'Hard',
    date: 'Jan 2025',
    location: 'Bengaluru · Internship hiring',
    duration: '3 rounds over 8 days',
    candidateProfile: 'B.Tech Data Science · 2026 batch · ML capstone project',
    outcome: 'Offer Accepted · Selected',
    summary: 'A mix of ML fundamentals and project deep-dives, with emphasis on evaluation metrics, data leakage prevention, and real-world latency trade-offs.',
    rounds: [
      {
        name: 'Online Assessment',
        duration: '90 minutes',
        format: 'Python exercise · probability and ML basics',
        discussion: 'The candidate worked through a data manipulation task and explained why accuracy is misleading for severe class imbalance.',
        questions: ['Python vector manipulation using NumPy/Pandas', 'Probability and model evaluation questions (AUC-ROC vs Precision-Recall)'],
      },
      {
        name: 'ML Technical Interview',
        duration: '60 minutes',
        format: 'ML fundamentals · applied scenario',
        discussion: 'Follow-ups covered data split strategies, leakage checks, baseline selection, and what telemetry to monitor after model deployment.',
        questions: ['Explain precision vs. recall for an imbalanced fraud dataset', 'How would you detect model drift and data distribution shift in production?'],
      },
      {
        name: 'Project + HR',
        duration: '45 minutes',
        format: 'Project deep dive · collaboration questions',
        discussion: 'The candidate described a failed experiment and the empirical evidence that led to a pivot in model architecture.',
        questions: ['Walk through a machine learning model you built and how you evaluated it', 'What architectural changes would you implement if given another month?'],
      },
    ],
    hrQuestions: ['Why are you interested in applied AI in mobility?', 'Tell me about a time you had to learn from an experimental hypothesis that failed.'],
    preparationTips: ['Know your project data distribution, baseline, evaluation metric, and explicit limitations.', 'Review train/validation/test splits, data leakage, overfitting, and class imbalance techniques (Focal loss, SMOTE).', 'Explain why a metric fits the business use case, not just how to compute it mathematically.'],
    lessonsLearned: 'Being candid about a model’s limitations led to a much more productive discussion than presenting only the best test accuracy score.',
    resources: [
      {
        label: 'Learning roadmaps',
        href: 'https://roadmap.sh/ai-data-scientist',
        title: 'Applied Machine Learning & GenAI Production Roadmap',
        category: 'Learning Roadmaps',
        description: 'End-to-end PyTorch, RAG pipelines, and vector database architectures.',
      },
      {
        label: 'Study notes',
        href: 'https://huggingface.co/learn',
        title: 'Core Computer Science Handwritten Study Notes',
        category: 'Core CS Study Notes',
        description: 'Model evaluation formulas, cross-entropy, and precision-recall trade-offs.',
      },
    ],
  },
  {
    slug: 'tcs-digital-developer',
    company: 'TCS Digital',
    role: 'SDE',
    title: 'Systems Engineer (Digital Cadre)',
    level: 'Full-time',
    stipend: '7.5 LPA CTC',
    difficulty: 'Easy',
    date: 'Jan 2025',
    location: 'Pune · National Qualifier Test (NQT)',
    duration: '2 rounds over 1 week',
    candidateProfile: 'B.Tech Computer Science · 2025 batch · 8.1 CGPA',
    outcome: 'Offer received · Digital Cadre',
    summary: 'Focused on programming fundamentals, object-oriented concepts, basic data structures, and enthusiasm for enterprise software delivery.',
    rounds: [
      {
        name: 'National Qualifier Test (NQT)',
        duration: '110 minutes',
        format: 'Aptitude + 2 Coding Problems',
        discussion: 'Covered quantitative aptitude, logical reasoning, and two coding challenges in C++/Java.',
        questions: ['Longest Palindromic Substring in a string', 'Array manipulation and prime frequency counting'],
      },
      {
        name: 'Technical + Managerial + HR',
        duration: '40 minutes',
        format: 'Combined panel interview',
        discussion: 'Discussed final year engineering project, core OOP principles (polymorphism, encapsulation), and SQL normalization.',
        questions: ['Explain Method Overloading vs Overriding with code', 'What is difference between Primary Key and Unique Key in SQL?', 'Walk through the architecture of your college project'],
      },
    ],
    hrQuestions: ['Are you willing to relocate to any TCS delivery center in India?', 'How do you handle working across different client timezones?'],
    preparationTips: ['Practice previous TCS NQT coding questions on strings and arrays.', 'Review basic SQL queries, joins, and normal forms (1NF, 2NF, 3NF).', 'Be fluent in explaining your college project architecture and tech stack.'],
    lessonsLearned: 'Staying confident, answering clearly, and admitting when I did not know a minor detail left a positive impression.',
    resources: [
      {
        label: 'Interview prep guides',
        href: 'https://practice.geeksforgeeks.org/',
        title: 'Technical & HR Behavioral Interview Handbook (STAR Method)',
        category: 'Interview Prep Guides',
        description: 'TCS NQT interview preparation questions and OOP concepts.',
      },
      {
        label: 'Mock test resources',
        href: 'https://www.indiabix.com/',
        title: 'Campus Placement Mock Assessment & Aptitude Simulator',
        category: 'Mock Test Resources',
        description: 'Timed quantitative aptitude practice questions for TCS NQT.',
      },
    ],
  },
  {
    slug: 'deloitte-business-technology-analyst',
    company: 'Deloitte',
    role: 'Analyst',
    title: 'Business Technology Analyst',
    level: 'Full-time',
    stipend: '12 LPA CTC',
    difficulty: 'Easy',
    date: 'Dec 2024',
    location: 'Pune · Campus placement',
    duration: '3 rounds over 2 days',
    candidateProfile: 'B.E. Electronics and Communication · 2025 batch · student team project',
    outcome: 'Offer received · Accepted',
    summary: 'A process centered on communication, structured problem solving, business case estimation, and understanding how technology streamlines enterprise processes.',
    rounds: [
      {
        name: 'Online Assessment',
        duration: '75 minutes',
        format: 'Numerical reasoning · situational judgement',
        discussion: 'The candidate read each prompt carefully, checked units in the numerical questions, and prioritized clear reasoning.',
        questions: ['Numerical reasoning and data interpretation charts', 'Short situational judgement scenarios on workplace ethics'],
      },
      {
        name: 'Technical + Business Case',
        duration: '45 minutes',
        format: 'Business case · SQL and spreadsheet basics',
        discussion: 'The interviewer looked for a structured investigation plan and clear communication of assumptions for a logistics bottleneck case.',
        questions: ['Explain how you would investigate a warehouse process bottleneck', 'Basic SQL queries and spreadsheet VLOOKUP / Pivot table concepts'],
      },
      {
        name: 'HR Interview',
        duration: '30 minutes',
        format: 'Motivation · teamwork examples',
        discussion: 'The candidate connected examples from a student project to collaboration, deadlines, and learning a new technical domain.',
        questions: ['Why consulting and why Deloitte Technology practice?', 'Describe a time you worked with a tight project deadline'],
      },
    ],
    hrQuestions: ['What does exceptional teamwork look like to you?', 'How do you prioritize when you have multiple competing deadlines?'],
    preparationTips: ['Practice explaining a problem in structured bullet points before proposing a solution.', 'Review basic SQL, spreadsheet data modeling, and interpreting charts.', 'Prepare concise stories of teamwork, feedback, and time management.'],
    lessonsLearned: 'Keeping a business case answer structured made it easier to explain the recommendation and the assumptions behind it.',
    resources: [
      {
        label: 'Study notes',
        href: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        title: 'Core Computer Science Handwritten Study Notes',
        category: 'Core CS Study Notes',
        description: 'Business process modeling and SQL data aggregation basics.',
      },
      {
        label: 'Mock test resources',
        href: 'https://www.indiabix.com/',
        title: 'Campus Placement Mock Assessment & Aptitude Simulator',
        category: 'Mock Test Resources',
        description: 'Consulting case interviews and numerical reasoning simulations.',
      },
    ],
  },
];
