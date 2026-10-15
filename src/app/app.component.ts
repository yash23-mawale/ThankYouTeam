import { Component, HostListener, OnInit } from '@angular/core';

// Strict Department Union Type - Leads, Developers, and QA only
export type Department = 'leadership' | 'engineering' | 'qa';

// 🎨 Palette of beautiful card gradients (Automatically assigned to cards)
export const CARD_GRADIENTS: string[] = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo -> Purple
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink -> Rose
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan -> Blue
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber -> Orange
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald -> Green
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', // Violet -> Fuchsia
  'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', // Sky -> Indigo
  'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', // Rose -> Sunset
  'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', // Purple -> Cyan
  'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)'  // Teal -> Blue
];

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: Department; // Strict: 'leadership' | 'engineering' | 'qa'
  nickname?: string;
  avatarUrl?: string; // Optional image URL (agar image nahi hai to avatarInitials use hoga)
  avatarInitials: string;
  gradient?: string; // Optional: agar nahi denge to automatic CARD_GRADIENTS me se lag jayega
  badge?: string; // Fun badge/tag
  personalMessage: string; // Heartfelt thank you note
  bestMemory?: string; // Special memory/moment
  specialSkill?: string; // Superpower
  partingWish?: string; // Warm wish
  tags?: string[];
  likesCount?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Title & Metadata
  title = 'Before I Sign Off...';

  // Search & Filter State
  searchQuery: string = '';
  activeFilter: string = 'all';

  // Modal State
  selectedMember: TeamMember | null = null;
  isModalOpen: boolean = false;
  isLikedInModal: boolean = false;

  // Sound effects toggle
  soundEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;

  // =====================================================================
  // 📝 EDIT YOUR TEAM MEMBERS DATA HERE:
  // (Ab gradient daalne ki zaroorat nahi hai, automatic assign hoga!)
  // =====================================================================
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Snehal Kulkarni',
      role: 'CEO',
      department: 'leadership',
      nickname: 'The Inspiring Leader 🌟',
      avatarInitials: 'SK',
      badge: 'Visionary Leader 👑',
      personalMessage: 'Thank you, Ma’am, for your valuable guidance, constant support, and encouragement. Your leadership and trust have motivated me to learn, improve, and grow professionally. I am truly grateful for the opportunity to be part of this organization and for the positive impact your guidance has had on my journey. Your support will always be appreciated and remembered.',
      bestMemory: 'My interview with you is one of the most memorable moments of my professional journey. Thank you, Ma’am, for giving me the opportunity to be part of this organization and take an important step forward in my career. That experience will always hold a special place in my memories, and I will remain grateful for the opportunity and trust you gave me.',
      specialSkill: 'The ability to inspire people, lead with confidence, and turn a clear vision into meaningful progress while encouraging others to learn, grow, and achieve their best.',
      partingWish: 'Wishing you and the organization continued success, new milestones, and many more achievements in the years ahead. May your vision continue to inspire people, your leadership create new opportunities, and your efforts bring lasting success to everyone around you. Thank you once again, Ma’am, for your guidance and support. It has been a privilege to be part of this journey, and I will always look back on this chapter with gratitude and respect.',
      tags: ['#InspiringLeadership', '#VisionaryLeader', '#Gratitude', '#ProfessionalGrowth'],
      likesCount: 1
    },
    {
      id: 2,
      name: 'Abhijit Kulkarni',
      role: 'Co-CEO',
      department: 'leadership',
      nickname: 'The Visionary Mentor 🌟',
      avatarInitials: 'AK',
      badge: 'Leadership Inspiration 👑',
      personalMessage: 'Thank you, Sir, for your valuable guidance, encouragement, and support. I truly appreciate the opportunity to learn from your experience and leadership. Your willingness to guide others and share your knowledge has made a meaningful difference in my professional journey. I am grateful for your trust and for the lessons I have learned along the way.',
      bestMemory: 'One of my best memories is your guidance and support while working on the CSI dashboards. Your insights helped me better understand the requirements and approach the work with greater confidence. I truly appreciate the time you took to guide me and make the experience a valuable learning opportunity.',
      specialSkill: 'Inspires people to aim higher, brings out the best in every team, and makes even the biggest challenges feel manageable. His only real superpower might be turning ambitious visions into everyone’s next exciting mission! 🚀',
      partingWish: 'Wishing you continued success, good health, and many more remarkable achievements ahead, Sir. May your vision lead to new milestones, your leadership continue to inspire others, and every new venture bring exciting opportunities and lasting success. Thank you for your guidance and encouragement. It has been a privilege to learn from you, and I will always carry these valuable lessons forward. Best wishes for everything ahead!',
      tags: ['#InspirationalLeader', '#Mentorship', '#CSIProjects', '#LeadershipExcellence'],
      likesCount: 1
    },
    {
      id: 3,
      name: 'Onkar Swami',
      role: 'Tech Lead',
      department: 'leadership',
      nickname: 'The Tech Mentor 💻',
      avatarInitials: 'OS',
      badge: 'Technical Excellence 🚀',
      personalMessage: 'Thank you, Sir, for your guidance, support, and encouragement. Your technical knowledge and willingness to help have made a real difference in my learning journey. I truly appreciate the time you take to share your experience, explain complex concepts, and help the team overcome challenges. Your mentorship has encouraged me to become a better developer and approach problems with greater confidence.',
      bestMemory: 'One of my best memories is working with you on the Biocon project. I really appreciated the opportunity to collaborate with you, learn from your technical expertise, and gain valuable insights throughout the project. Your guidance and support made the experience both enjoyable and a great learning opportunity. I will always cherish the experience of working with you on Biocon and the lessons I gained along the way.',
      specialSkill: 'A true technical problem-solver who can break down complex challenges, find practical solutions, and guide the team in the right direction. Always ready with technical insights and the perfect approach when things get complicated! 💡',
      partingWish: 'Wishing you continued success, exciting technical challenges, and many more achievements in your career. May your expertise continue to inspire the team, your projects bring new opportunities, and your leadership help many more developers grow. Thank you for sharing your knowledge and making a positive impact. All the very best for everything ahead! 🚀',
      tags: ['#TechLead', '#TechnicalMentor', '#ProblemSolver', '#Teamwork'],
      likesCount: 1
    },
    {
      id: 4,
      name: 'Som Swami',
      role: 'Product Manager',
      department: 'leadership',
      nickname: 'The Concept Simplifier 💡',
      avatarInitials: 'SS',
      badge: 'Architecture Mentor 🏆',
      personalMessage: 'Thank you, Sir, for your valuable guidance and for helping me understand software architecture concepts more clearly. Your ability to explain complex ideas in a simple and practical way has helped me improve my technical understanding and approach problems with greater confidence. I truly appreciate the time you have taken to guide me and share your knowledge. Your support has been an important part of my learning journey.',
      bestMemory: 'One of my memorable moments was when you explained the Consumption API to me. I remember struggling to understand the concept at first, while you patiently walked me through it. It took me a little time to connect all the dots, but your explanation finally made things clearer! Looking back, it was a funny yet valuable learning experience that I will always remember with a smile.',
      specialSkill: 'An exceptional ability to simplify complex concepts and explain them so clearly that everything starts making sense. After one of your explanations, the concept is already clear in my mind, and all that remains is to translate the understanding into code. Your way of teaching makes even challenging technical topics feel approachable. Truly a master at turning confusion into clarity! 💡',
      partingWish: 'Wishing you continued success, good health, and many exciting opportunities ahead, Sir. May your ideas continue to shape great products, your guidance inspire more people, and every new challenge bring another opportunity to achieve something remarkable. Thank you for sharing your knowledge and making complex concepts easier to understand. I will always value the lessons I have learned from you. Best wishes for your future endeavors, and may you continue making a positive impact wherever you go! 🚀',
      tags: ['#ProductLeadership', '#ArchitectureMentor', '#LearningAndGrowth', '#ConceptSimplifier'],
      likesCount: 1
    },
    {
      id: 5,
      name: 'Vishal Bhoknal',
      role: 'Project Manager',
      department: 'leadership',
      nickname: 'The Clarity Champion 🎯',
      avatarInitials: 'VB',
      badge: 'Requirements Expert 🏆',
      personalMessage: 'Thank you, Sir, for always explaining the requirements clearly and helping me understand exactly what needs to be built. Your guidance has helped me translate requirements into the right features and deliver them with greater confidence. I truly appreciate your patience, support, and the clarity you bring to every discussion. Your guidance has made my work easier and helped me grow professionally.',
      bestMemory: 'One of my most memorable experiences is our morning stand-up meetings. Those daily updates, discussions, and clarifications helped me understand the priorities, stay aligned with the team, and approach my tasks with a clear direction. These regular interactions may have seemed like a small part of the day, but they became an important and memorable part of my work experience.',
      specialSkill: 'An excellent ability to understand business needs, clarify even the smallest details, and turn requirements into a clear roadmap for the team. You know how to ask the right questions and ensure everyone understands what needs to be delivered. With your guidance, even complicated requirements become much easier to understand and implement! 🎯',
      partingWish: 'Wishing you continued success, great achievements, and many exciting projects ahead, Sir. May every project run smoothly, every requirement be crystal clear, and every milestone bring new reasons to celebrate. Thank you for your guidance, support, and the valuable lessons you have shared. I hope you continue to inspire teams, build successful products, and achieve even greater milestones in your career. Best wishes for your future endeavors! 🚀',
      tags: ['#ProjectManagement', '#ClearRequirements', '#TeamAlignment', '#SuccessfulDelivery'],
      likesCount: 1
    },
    {
      id: 6,
      name: 'Mitali Deshpande',
      role: 'HR',
      department: 'leadership',
      nickname: 'The People Champion 🌷',
      avatarInitials: 'MD',
      badge: 'People & Culture Star 🌟',
      personalMessage: 'Thank you, Ma’am, for your support, guidance, and kindness throughout my journey. Your approachable nature and willingness to help have made the workplace a more comfortable and positive environment. I truly appreciate the efforts you put into supporting employees and making sure everyone feels heard and valued. Thank you for the important role you play in creating a welcoming and supportive workplace.',
      bestMemory: 'One of my fondest memories is the support and guidance I received whenever I needed help or clarification. Your approachable nature made it easier to ask questions and navigate workplace processes with confidence. I genuinely appreciate the positive interactions and the care you show toward employees, which made my work experience more pleasant and memorable.',
      specialSkill: 'An exceptional ability to understand people, listen with empathy, and handle workplace matters with patience and professionalism. You make people feel comfortable, turn difficult conversations into constructive discussions, and help create a positive environment where everyone feels respected and supported. 🌟',
      partingWish: 'Wishing you continued success, happiness, and new opportunities in your professional journey, Ma’am. May you continue making a positive difference in people’s lives, building stronger workplace relationships, and inspiring others through your kindness and dedication. Thank you for your support and for contributing to such a welcoming work environment. May the road ahead bring you wonderful achievements, meaningful experiences, and countless reasons to smile. Best wishes for everything ahead! 🌷',
      tags: ['#PeopleFirst', '#HRExcellence', '#WorkplaceCulture', '#Gratitude'],
      likesCount: 1
    },
    {
      id: 7,
      name: 'Deepak Godase',
      role: 'Senior Backend Developer',
      department: 'engineering',
      nickname: 'The Architecture Master ⚡',
      avatarInitials: 'DG',
      badge: 'Backend Expert 🏆',
      personalMessage: 'Thank you, Deepak sir, for your valuable guidance, constant support, and for sharing your technical knowledge with us. Your experience and willingness to help have made a real difference in our learning journey. I truly appreciate everything I have learned from you.',
      bestMemory: 'Working with you on the hierarchy bugs was an amazing experience. Your technical approach, patience, and ability to break down complex problems made the challenges easier to understand and solve. It was a great learning experience working alongside you.',
      specialSkill: 'An outstanding coder with exceptional coding skills, strong logical thinking, and a deep understanding of backend architecture. Your ability to design robust solutions and solve complex technical challenges is truly admirable. Your expertise and professionalism set a great example for the team.',
      partingWish: 'Deepak sir, wishing you success, happiness, and growth in every step ahead. May you continue to build amazing systems, solve bigger challenges, and inspire everyone around you with your exceptional coding skills. Thank you for your guidance and support. You will always have my respect and best wishes for an amazing future!',
      tags: ['#BackendExpert', '#SystemArchitecture', '#MasterCoder', '#ProblemSolver'],
      likesCount: 1
    },
    {
      id: 8,
      name: 'Saurabh Deokate',
      role: 'Senior Frontend Developer',
      department: 'engineering',
      nickname: 'The Bug Slayer ⚡',
      avatarInitials: 'SD',
      badge: 'Frontend Expert 🏆',
      personalMessage: 'Thank you, Saurabh sir, for your valuable guidance and support during my early learning phase. You helped me understand concepts clearly and gave me the confidence to learn and improve. Honestly, sir, you were my Antigravity even before Antigravity AI existed! 😄 Your guidance has made a real difference in my journey, and I will always be grateful for everything I learned from you.',
      bestMemory: 'One of my best memories was when you guided me through updating the Angular project. Your clear explanations and practical approach helped me understand the changes better and taught me how to handle similar tasks with confidence.',
      specialSkill: 'An exceptional developer with an incredible ability to debug even the most challenging issues. Your patience, sharp problem-solving skills, and deep understanding of frontend development make you someone the team can always rely on. No bug seems too complicated when you are around, sir!',
      partingWish: 'Saurabh sir, wishing you continued success, happiness, and exciting opportunities in your career. May you keep building amazing applications, solving challenging bugs, and inspiring others with your knowledge and guidance. Thank you for being such a great mentor during my early learning journey. I will always remember your support with gratitude and respect. Wishing you an amazing future ahead!',
      tags: ['#AngularExpert', '#BugSlayer', '#GreatMentor', '#FrontendDevelopment'],
      likesCount: 1
    },
    {
      id: 9,
      name: 'Bhumin Patel',
      role: 'Senior Frontend Developer',
      department: 'engineering',
      nickname: 'The Code Detective 🔍',
      avatarInitials: 'BP',
      badge: 'Code Quality Champion 🏆',
      personalMessage: 'Thank you, Bhumin Sir, for reviewing my PRs, pointing out mistakes, and helping me improve my code. Your feedback has taught me to pay closer attention to details and write better code. I truly appreciate your guidance and support.',
      bestMemory: 'One of my favorite memories is enjoying lunch with you, especially at Bandara Restaurant. The food, conversations, and those lunch breaks made the work experience even more enjoyable.',
      specialSkill: 'You have an incredible eye for detail and can spot potential mistakes in code before they turn into bigger problems. Your sharp reviews and helpful suggestions make the code better and help the whole team improve.',
      partingWish: 'Wishing you lots of success, happiness, and exciting opportunities ahead, Bhumin. May you continue building amazing applications, sharing your expertise, and making a difference wherever you go. And hopefully, there will be many more great lunches and conversations in the future. All the best for your next chapter!',
      tags: ['#CodeReviewer', '#AttentionToDetail', '#FrontendExpert', '#TeamPlayer'],
      likesCount: 1
    },
    {
      id: 10,
      name: 'Rushikesh Shinde',
      role: 'Backend Developer',
      department: 'engineering',
      nickname: 'The Backend Brain 🧠',
      avatarInitials: 'RS',
      badge: 'Master Coder 💻',
      personalMessage: 'Thank you, Rushikesh, for reviewing my backend code, pointing out mistakes, and guiding me toward better solutions. Your suggestions helped me understand backend concepts more clearly and improve my coding approach. I really appreciate your support and the time you took to help me learn.',
      bestMemory: 'Implementing interesting features together, especially User Access and Lift Signal, was a great experience. I enjoyed working through the challenges with you, learning new things, and seeing our efforts turn into working features.',
      specialSkill: 'A talented coder with strong logical thinking and an impressive ability to turn requirements into working solutions. Your technical skills and problem-solving approach make you a dependable teammate and a great person to learn from.',
      partingWish: 'Wishing you great success, happiness, and exciting challenges ahead, Rushikesh. May your coding journey bring you bigger opportunities, successful projects, and plenty of achievements. Keep writing great code, keep learning, and keep inspiring others with your skills. All the very best for your future!',
      tags: ['#BackendDeveloper', '#MasterCoder', '#ProblemSolver', '#Teamwork'],
      likesCount: 1
    },
    {
      id: 11,
      name: 'Yugant Patil',
      role: 'Backend Developer',
      department: 'engineering',
      nickname: 'The Focused Engineer 🎯',
      avatarInitials: 'YP',
      badge: 'Feature Builder 🚀',
      personalMessage: 'Thank you, Yugant, for your constant support and cooperation at work. Working with you has been a great experience, and I appreciate your willingness to help and contribute whenever needed. Your support made our teamwork smoother and more enjoyable.',
      bestMemory: 'One of my favorite memories was implementing notifications and several other interesting features together on the Biocon project. It was satisfying to work through the requirements, solve challenges, and see our features come together.',
      specialSkill: 'Your focus and dedication toward your work are truly admirable. Once you take ownership of a task, you give it the attention it deserves and stay committed to delivering the best possible result. Your consistency is a great quality to have.',
      partingWish: 'Wishing you continued success, happiness, and growth, Yugant. May you keep achieving your goals, building exciting features, and taking on new challenges with the same focus and dedication. Hope your next chapter brings you great opportunities and memorable achievements. All the best for everything ahead!',
      tags: ['#FocusedDeveloper', '#BackendDevelopment', '#FeatureBuilder', '#Dedicated'],
      likesCount: 1
    },
    {
      id: 12,
      name: 'Arjun Patel',
      role: 'Backend Developer',
      department: 'engineering',
      nickname: 'The Tatkal Ticket King 👑',
      avatarInitials: 'AP',
      badge: 'Coding Champion 💻',
      personalMessage: 'Thank you, Arjun, for your constant support and for helping me understand technical concepts whenever I needed it. Your willingness to explain things and work through problems together made learning easier and the day-to-day work more enjoyable. I truly appreciate your help and teamwork.',
      bestMemory: 'We implemented so many features together, and those moments made the work memorable. One thing I will especially miss is our tea breaks together. The work was important, but those little breaks and conversations made the journey even better!',
      specialSkill: 'A skilled coder with a strong understanding of backend development and a practical approach to solving problems. And of course, the legendary Tatkal ticket-booking skills deserve a special mention! When it comes to coding and booking Tatkal tickets, you know how to get things done.',
      partingWish: 'Wishing you lots of success, happiness, and exciting opportunities ahead, Arjun. May you continue building great solutions, learning new technologies, and achieving every goal you set for yourself. I will definitely miss our teamwork and tea breaks. Keep coding, keep smiling, and all the best for your next adventure!',
      tags: ['#BackendDeveloper', '#TatkalKing', '#MasterCoder', '#TeaBreakMemories'],
      likesCount: 1
    },
    {
      id: 13,
      name: 'Amar Kulkarni',
      role: 'Frontend Developer',
      department: 'engineering',
      nickname: 'The UI Craftsman 🎨',
      avatarInitials: 'AK',
      badge: 'Frontend Creator ✨',
      personalMessage: 'Thank you, Amar, for your support, cooperation, and positive attitude at work. I have genuinely enjoyed working with you, and your helpful nature made collaboration easier and more pleasant. I appreciate the teamwork and all the good moments we shared.',
      bestMemory: 'Implementing the User Access feature together was a memorable experience. It was great to collaborate, discuss the requirements, and work together to turn the idea into a working feature.',
      specialSkill: 'You have a great eye for frontend development and a talent for turning requirements into clean, user-friendly interfaces. Your willingness to collaborate and your practical approach to implementation make you a valuable member of the team.',
      partingWish: 'Wishing you success, happiness, and many exciting opportunities ahead, Amar. May you continue creating beautiful user experiences, learning new skills, and achieving great things in your career. It was a pleasure working with you, and I hope your next chapter brings plenty of growth and memorable achievements. All the best!',
      tags: ['#FrontendDeveloper', '#UICraftsman', '#Teamwork', '#UserExperience'],
      likesCount: 1
    },
    {
      id: 14,
      name: 'Tejas Patil',
      role: 'Backend Developer',
      department: 'engineering',
      nickname: 'The One-Prompt Engineer 🤖',
      avatarInitials: 'TP',
      badge: 'Prompt-to-Feature Pro 🚀',
      personalMessage: 'Thank you, Tejas, for being such a supportive teammate and for always bringing a helpful attitude to our work. Your cooperation and willingness to work together made challenging tasks easier and more enjoyable. I truly appreciate having had the opportunity to work with you.',
      bestMemory: 'Working with you on the Room Utilization Dashboard was a great experience. I enjoyed collaborating with you, discussing the requirements, and working together to bring the dashboard to life.',
      specialSkill: 'A talented backend developer who knows how to turn an idea into a working feature with impressive speed. Sometimes it feels like you need just one good prompt to get the feature done! 😄 Your efficiency and practical approach make you a fun and valuable teammate to work with.',
      partingWish: 'Wishing you great success, happiness, and exciting opportunities ahead, Tejas. May every new project bring you growth, every challenge teach you something valuable, and every feature turn out even better than expected. Keep building great things, keep that positive spirit alive, and all the best for your future!',
      tags: ['#BackendDeveloper', '#OnePromptPro', '#FeatureBuilder', '#TeamPlayer'],
      likesCount: 1
    },
    {
      id: 15,
      name: 'Nitesh Chawhan',
      role: 'Backend Developer',
      department: 'engineering',
      nickname: 'The Bug Whisperer 🐛',
      avatarInitials: 'NC',
      badge: 'Data Detective 🔎',
      personalMessage: 'Thank you, Nitesh, for being such a supportive teammate and for always being willing to help. Your cooperation, positive attitude, and readiness to tackle problems together made work much easier. I genuinely appreciate your support and the great teamwork we shared.',
      bestMemory: 'One of our most memorable experiences was solving all those data-missing bugs together. There were times when the data seemed to disappear without a trace, but we kept investigating until we found the cause. Those debugging sessions were challenging, memorable, and sometimes pretty funny!',
      specialSkill: 'A true Bug Whisperer who seems to understand bugs without even writing much code! 😄 Your ability to investigate issues, follow clues, and identify possible root causes before jumping into implementation is impressive. You remind us that sometimes the smartest debugging starts with thinking, not typing.',
      partingWish: 'Wishing you lots of success, happiness, and exciting opportunities ahead, Nitesh. May your future projects have fewer bugs, your data never go missing, and your debugging skills keep getting stronger! Thank you for your support and teamwork. Keep smiling, keep solving problems, and all the very best for your next chapter!',
      tags: ['#BugWhisperer', '#DataDetective', '#BackendDeveloper', '#ProblemSolver'],
      likesCount: 1
    },
    {
      id: 16,
      name: 'Sakshi Nagpure',
      role: 'Frontend Developer',
      department: 'engineering',
      nickname: 'The Feature Creator ✨',
      avatarInitials: 'SN',
      badge: 'Frontend Star 🌟',
      personalMessage: 'Thank you, Sakshi, for your constant support, cooperation, and for always being such a helpful teammate. I have genuinely enjoyed working with you, and your supportive nature has made our work journey more comfortable and memorable. I truly appreciate all the teamwork and positive moments we shared.',
      bestMemory: 'One of my favorite memories is implementing different features together. I really enjoyed those moments of collaborating, discussing ideas, and turning requirements into working features. Working with you made even challenging tasks more enjoyable.',
      specialSkill: 'A versatile frontend developer with the ability to take on different kinds of features and turn ideas into user-friendly experiences. Your adaptability, willingness to learn, and collaborative approach make you a valuable member of the team.',
      partingWish: 'Wishing you lots of success, happiness, and exciting opportunities ahead, Sakshi. May you continue building amazing features, learning new technologies, and achieving wonderful milestones in your career. Thank you for your support and for making our time working together memorable. All the very best for your next chapter!',
      tags: ['#FrontendDeveloper', '#FeatureCreator', '#Teamwork', '#CreativeMind'],
      likesCount: 1
    },
    {
      id: 17,
      name: 'Pooja Chaudhari',
      role: 'Frontend Developer',
      department: 'engineering',
      nickname: 'The Frontend Powerhouse 💪',
      avatarInitials: 'PC',
      badge: 'UI Expert 🏆',
      personalMessage: 'Thank you, Pooja, for your constant support, cooperation, and for being such a dependable teammate. I have really enjoyed working with you and appreciate the way you share ideas, help with discussions, and make collaboration easier. Thank you for all the positive experiences we shared during our work journey.',
      bestMemory: 'I really enjoyed our discussions about how to implement different features and understand technical concepts. Exploring possible approaches, exchanging ideas, and figuring out solutions together made those moments both interesting and valuable.',
      specialSkill: 'An independent and capable frontend developer who can confidently handle frontend tasks end to end. Your ownership, problem-solving skills, and ability to manage UI development independently are truly impressive. You show how much can be achieved with strong technical skills and determination.',
      partingWish: 'Wishing you continued success, happiness, and growth, Pooja. May you keep taking ownership of exciting projects, creating excellent user experiences, and achieving new heights in your career. Keep trusting your abilities, sharing your knowledge, and doing the amazing work you are known for. It was a pleasure working with you, and I wish you an incredible future ahead!',
      tags: ['#FrontendExpert', '#IndependentDeveloper', '#ProblemSolver', '#UIDevelopment'],
      likesCount: 1
    },
    {
      id: 18,
      name: 'Pratibha Swami',
      role: 'Senior Frontend Developer',
      department: 'engineering',
      nickname: 'The Concept Clarifier ✨',
      avatarInitials: 'PS',
      badge: 'Amazing Mentor 🏆',
      personalMessage: 'Thank you, Pratibha ma’am, for your constant support and guidance, especially during my early days working on CMMS. Your encouragement and willingness to help made it much easier for me to learn, understand new concepts, and gain confidence in my work. I will always be grateful for the support you gave me at that stage of my journey.',
      bestMemory: 'One of my best memories was when you patiently explained things to me when I had just started working on CMMS. Your clear explanations helped me understand the concepts and approach my tasks with greater confidence. Those early learning moments will always be memorable for me.',
      specialSkill: 'Your exceptional ability to explain complex concepts in a simple and understandable way is truly admirable. You make even unfamiliar topics easier to grasp, ensuring that everyone can learn with confidence. Your patience, clarity, and supportive approach make you an excellent mentor.',
      partingWish: 'Wishing you continued success, happiness, and wonderful opportunities ahead, Pratibha ma’am. May you continue inspiring others with your knowledge, guiding teammates with your patience, and achieving new milestones in your career. Thank you for making my early learning journey smoother and more memorable. I will always value your guidance and wish you all the very best for the future!',
      tags: ['#FrontendExpert', '#AmazingMentor', '#ClearGuidance', '#CMMSMemories'],
      likesCount: 1
    },
    {
      id: 19,
      name: 'Roshan Desai',
      role: 'Software Tester',
      department: 'qa',
      nickname: 'The Bug Hunter 🐞',
      avatarInitials: 'RD',
      badge: 'Quality Guardian 🛡️',
      personalMessage: 'Thank you for finding bugs in my code and helping me understand where I was going wrong. Your feedback and suggestions helped me improve my development skills and write better, more reliable code. Every defect you identified was an opportunity for me to learn and grow as a developer. I truly appreciate your support and guidance!',
      bestMemory: 'I really enjoyed working with you on the hierarchy defect. It was a great learning experience, and I will always remember the teamwork, discussions, and effort we put into resolving it together.',
      specialSkill: 'If your code passes his testing, you can confidently say it has survived the ultimate quality check! 🔍🐞',
      partingWish: 'Wishing you a future filled with successful releases, smooth testing cycles, and zero-bug deployments! May every test case pass on the first attempt, and may you continue catching hidden bugs before they ever reach production. Keep raising the quality bar and helping developers become better at what they do. Wishing you great success in everything ahead! 🚀',
      tags: ['#BugHunter', '#QualityFirst', '#QAExpert', '#ZeroBugs'],
      likesCount: 1
    },
    {
      id: 20,
      name: 'Sachin Shinde',
      role: 'Software Tester',
      department: 'qa',
      nickname: 'The Bug Hunter 🐞',
      avatarInitials: 'SS',
      badge: 'Innovation Enthusiast 💡',
      personalMessage: 'Thank you for finding bugs in my code and helping me identify areas where I could improve. Your feedback helped me understand my mistakes, improve my development skills, and write better-quality code. I truly appreciate your attention to detail and support!',
      bestMemory: 'I really enjoyed working with you on identifying and resolving defects. The collaboration, discussions, and teamwork made it a valuable learning experience for me.',
      specialSkill: 'Always full of innovative ideas and eager to explore new ways to improve applications with creative features and fresh approaches! 💡🚀',
      partingWish: 'Wishing you a future filled with exciting challenges, innovative ideas, and successful projects! May your creativity continue to shine, your testing always catch hidden bugs, and every application you work on become better than ever. Keep exploring, keep innovating, and keep making a difference. All the best for your next chapter! 🎯',
      tags: ['#BugHunter', '#Innovation', '#QualityFirst', '#ContinuousImprovement'],
      likesCount: 1
    },
    {
      id: 21,
      name: 'Kaustubh Pawar',
      role: 'Software Tester',
      department: 'qa',
      nickname: 'The Bug Hunter 🐞',
      avatarInitials: 'KP',
      badge: 'Quality Guardian 🛡️',
      personalMessage: 'Thank you for finding bugs in my code and helping me identify areas where I could improve. Your feedback helped me understand my mistakes, improve my development skills, and write better-quality code. I truly appreciate your support, attention to detail, and contribution to making our applications more reliable!',
      bestMemory: 'I really enjoyed working with you on the Pune Metro project. Working together, sharing ideas, and solving challenges made the experience memorable. I will always look back on that project with great memories of our teamwork and collaboration.',
      specialSkill: 'Always supportive, approachable, and fun to work with. You make teamwork enjoyable and bring positive energy to everyone around you! 🤝✨',
      partingWish: 'Wishing you lots of success, exciting opportunities, and happiness in every step of your journey ahead! May you continue to grow, achieve great things, and work with amazing teams wherever you go. Keep spreading positivity, supporting others, and making every project a memorable experience. All the very best for your next chapter! 🚀',
      tags: ['#BugHunter', '#PuneMetroProject', '#TeamPlayer', '#QualityFirst'],
      likesCount: 1
    }
  ];

  // Quick statistics
  get totalMembers(): number {
    return this.teamMembers.length;
  }

  get totalAppreciations(): number {
    return this.teamMembers.reduce((sum, m) => sum + (m.likesCount || 0), 0);
  }

  ngOnInit(): void {
    // Automatically assign gradient colors from CARD_GRADIENTS to all team members
    this.assignGradients();
  }

  // Assign beautiful gradients cyclically/randomly based on member id or index
  private assignGradients(): void {
    this.teamMembers.forEach((member, index) => {
      if (!member.gradient) {
        // Deterministic by ID / index so colors stay consistent across filters & search
        const colorIndex = (member.id !== undefined ? Math.abs(member.id - 1) : index) % CARD_GRADIENTS.length;
        member.gradient = CARD_GRADIENTS[colorIndex];
      }
    });
  }

  // Filtered members by search query and category
  get filteredMembers(): TeamMember[] {
    return this.teamMembers.filter(member => {
      const matchesCategory = this.activeFilter === 'all' || member.department === this.activeFilter;
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        (member.nickname && member.nickname.toLowerCase().includes(q)) ||
        (member.badge && member.badge.toLowerCase().includes(q)) ||
        (member.tags && member.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }

  // Filter selection
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.playChime(440, 'triangle');
  }

  // Open modal for a member
  openMemberModal(member: TeamMember): void {
    this.selectedMember = member;
    this.isModalOpen = true;
    this.isLikedInModal = false;
    document.body.style.overflow = 'hidden';

    // Play pleasant opening chime
    this.playCelebrationChime();

    // Trigger confetti burst
    setTimeout(() => {
      this.triggerConfetti();
    }, 150);
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedMember = null;
    document.body.style.overflow = 'auto';
    this.playChime(320, 'sine');
  }

  // Navigate to Next Member inside Modal
  nextMember(): void {
    if (!this.selectedMember) return;
    const currentList = this.filteredMembers;
    const currentIndex = currentList.findIndex(m => m.id === this.selectedMember?.id);
    const nextIndex = (currentIndex + 1) % currentList.length;
    this.selectedMember = currentList[nextIndex];
    this.isLikedInModal = false;
    this.playChime(520, 'triangle');
    this.triggerConfetti(25);
  }

  // Navigate to Previous Member inside Modal
  prevMember(): void {
    if (!this.selectedMember) return;
    const currentList = this.filteredMembers;
    const currentIndex = currentList.findIndex(m => m.id === this.selectedMember?.id);
    const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    this.selectedMember = currentList[prevIndex];
    this.isLikedInModal = false;
    this.playChime(460, 'triangle');
    this.triggerConfetti(25);
  }

  // Like / Send Love
  likeMember(member: TeamMember, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    member.likesCount = (member.likesCount || 0) + 1;
    this.isLikedInModal = true;
    this.playChime(650, 'sine');

    // Spawn floating heart particle
    if (event) {
      this.spawnFloatingHeart(event.clientX, event.clientY);
    }
  }

  // Keyboard shortcut listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;

    if (event.key === 'Escape') {
      this.closeModal();
    } else if (event.key === 'ArrowRight') {
      this.nextMember();
    } else if (event.key === 'ArrowLeft') {
      this.prevMember();
    }
  }

  // Toggle Sound
  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
  }

  // Lightweight Web Audio API Chime (Zero external dependencies)
  private playChime(freq: number = 440, type: OscillatorType = 'sine'): void {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {
      // Audio not permitted or supported; silently ignore
    }
  }

  private playCelebrationChime(): void {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq, 'triangle'), idx * 70);
    });
  }

  // Floating Heart Particle on Click
  private spawnFloatingHeart(x: number, y: number): void {
    const heart = document.createElement('div');
    heart.innerText = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.fontSize = '24px';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.transition = 'all 0.9s cubic-bezier(0.1, 0.8, 0.3, 1)';
    heart.style.opacity = '1';

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(-50%, -100px) scale(1.6) rotate(${Math.random() * 40 - 20}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 950);
  }

  // Pure Canvas Confetti Explosion
  private triggerConfetti(particleCount: number = 60): void {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#f87171', '#ffffff'];
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: canvas.width * 0.5,
      y: canvas.height * 0.45,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.35
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRotation;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
        canvas.remove();
      }
    };

    animationFrameId = requestAnimationFrame(render);
  }
}
